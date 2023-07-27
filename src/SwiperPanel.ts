import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class HelloWorldPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: HelloWorldPanel | undefined;
  public static context: vscode.ExtensionContext;

  public static readonly viewType = "hello-world";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _selectedText: string | undefined;
  private _column: vscode.ViewColumn | undefined;

  public static createOrShow(extensionUri: vscode.Uri, context: vscode.ExtensionContext, selectedText?: string) {
    HelloWorldPanel.context = context;

    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    // If we already have a panel, show it.
    if (HelloWorldPanel.currentPanel) {
      HelloWorldPanel.currentPanel._panel.reveal(HelloWorldPanel.currentPanel._column);
      HelloWorldPanel.currentPanel._selectedText = selectedText;
      HelloWorldPanel.currentPanel._update();
      // Otherwise fired in 'onDidChangeViewState' listener
      if (HelloWorldPanel.currentPanel._panel.visible) {
        HelloWorldPanel.currentPanel._panel.webview.postMessage({
          command: "setState",
          value: HelloWorldPanel.context.globalState.get("webviewState"),
        });
      }
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      HelloWorldPanel.viewType,
      "EDA Tool",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "src", "compiled-fw"),
        ],
      },
    );

    HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri, selectedText);
    HelloWorldPanel.currentPanel._column = column;
    panel.webview.postMessage({
      command: "setState",
      value: HelloWorldPanel.context.globalState.get("webviewState"),
    });
  }

  public static kill() {
    console.log("kill");
    HelloWorldPanel.currentPanel?.dispose();
    HelloWorldPanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, selectedText?: string) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._selectedText = selectedText;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.onDidChangeViewState((e) => {
      const panel = e.webviewPanel;
      if (panel.visible) {
        this._column = panel.viewColumn;
        panel.webview.postMessage({
          command: "setState",
          value: HelloWorldPanel.context.globalState.get("webviewState"),
        });
      }
    });
  }

  public dispose() {
    console.log("dispose");
    HelloWorldPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "setState": {
          if (!data.value) {
            return;
          }
          HelloWorldPanel.context.globalState.update("webviewState", data.value);
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src", "compiled-fw", "main.js"));

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
    const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
    // const cssUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
    // );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <!--
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
      -->
      <meta http-equiv="Content-Security-Policy" content="img-src https: data:; 
        style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesResetUri}" rel="stylesheet">
      <link href="${stylesMainUri}" rel="stylesheet">
      <script nonce="${nonce}">
        window.injVscode = acquireVsCodeApi();
        window.selectedText = "${this._selectedText}" === "undefined" ? undefined : "${this._selectedText}";
      </script>
    </head>
    <body>
    </body>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </html>`;
  }
}
