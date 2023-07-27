/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloWorldPanel = void 0;
const vscode = __webpack_require__(1);
const getNonce_1 = __webpack_require__(3);
class HelloWorldPanel {
    static createOrShow(extensionUri, context, selectedText) {
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
        const panel = vscode.window.createWebviewPanel(HelloWorldPanel.viewType, "EDA Tool", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "src", "compiled-fw"),
            ],
        });
        HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri, selectedText);
        HelloWorldPanel.currentPanel._column = column;
        panel.webview.postMessage({
            command: "setState",
            value: HelloWorldPanel.context.globalState.get("webviewState"),
        });
    }
    static kill() {
        console.log("kill");
        HelloWorldPanel.currentPanel?.dispose();
        HelloWorldPanel.currentPanel = undefined;
    }
    static revive(panel, extensionUri) {
        HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri, selectedText) {
        this._disposables = [];
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
    dispose() {
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
    async _update() {
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
    _getHtmlForWebview(webview) {
        // // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src", "compiled-fw", "main.js"));
        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
        // const cssUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
        // );
        // Use a nonce to only allow specific scripts to be run
        const nonce = (0, getNonce_1.getNonce)();
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
exports.HelloWorldPanel = HelloWorldPanel;
HelloWorldPanel.viewType = "hello-world";


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNonce = void 0;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(1);
const SwiperPanel_1 = __webpack_require__(2);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "eda-test01" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(vscode.commands.registerCommand("eda-test01.runEda", () => {
        SwiperPanel_1.HelloWorldPanel.createOrShow(context.extensionUri, context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("eda-test01.runEdaFromTable", () => {
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            vscode.window.showErrorMessage("No ative text editor!");
            return;
        }
        const newSelectedText = activeTextEditor.document.getText(activeTextEditor.selection);
        if (newSelectedText.trim() === "") {
            vscode.window.showErrorMessage("No text selected!");
            return;
        }
        SwiperPanel_1.HelloWorldPanel.createOrShow(context.extensionUri, context, newSelectedText);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("eda-test01.runEdaFromContext", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = editor.selection.active;
            const range = editor.document.getWordRangeAtPosition(position);
            if (range) {
                const newSelectedText = editor.document.getText(range);
                // TODO see if word a table
                SwiperPanel_1.HelloWorldPanel.createOrShow(context.extensionUri, context, newSelectedText);
            }
            else {
                SwiperPanel_1.HelloWorldPanel.createOrShow(context.extensionUri, context, undefined);
            }
        }
        else {
            vscode.window.showErrorMessage("No ative text editor!");
            return;
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("eda-test01.refreshWebview", () => {
        SwiperPanel_1.HelloWorldPanel.kill();
        SwiperPanel_1.HelloWorldPanel.createOrShow(context.extensionUri, context);
        setTimeout(() => {
            vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
        }, 100);
    }));
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    console.log("Deactivated");
    return;
}
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map