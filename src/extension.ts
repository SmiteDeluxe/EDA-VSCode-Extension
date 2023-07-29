// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as cp from "child_process";
import { EDAPanel } from "./EDAPanel";
import path = require("path");

let pythonMiniServer: cp.ChildProcessWithoutNullStreams;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "eda-test01" is now active!');

  // Start Python Mini Server
  pythonMiniServer = cp.spawn(path.join(context.extensionUri.fsPath, "src/compiled-mini-server/main"));
  (["stdout", "stderr"] as const).forEach((stream) => {
    pythonMiniServer[stream].on("data", (data: Buffer) => {
      let output = data.toString();
      if (stream === "stdout") {
        console.log(`PMS OUTPUT: ${output}`);
      } else {
        // Python/Flask default logs to stderr it seems
        console.log(`PMS OUTPUT (Alleged error): ${output}`);
      }
    });
  });
  pythonMiniServer.on("close", (code) => {
    console.error(`PMS process exited with code ${code}`);
  });

  context.subscriptions.push(
    vscode.commands.registerCommand("eda-test01.runEda", () => {
      EDAPanel.createOrShow(context.extensionUri, context);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("eda-test01.runEdaFromTable", () => {
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

      EDAPanel.createOrShow(context.extensionUri, context, newSelectedText);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("eda-test01.runEdaFromContext", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const position = editor.selection.active;
        const range = editor.document.getWordRangeAtPosition(position);
        if (range) {
          const newSelectedText = editor.document.getText(range);
          // TODO see if word a table
          EDAPanel.createOrShow(context.extensionUri, context, newSelectedText);
        } else {
          EDAPanel.createOrShow(context.extensionUri, context, undefined);
        }
      } else {
        vscode.window.showErrorMessage("No ative text editor!");
        return;
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("eda-test01.refreshWebview", () => {
      EDAPanel.kill();
      EDAPanel.createOrShow(context.extensionUri, context);
      setTimeout(() => {
        vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
      }, 100);
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("Deactivated");
  pythonMiniServer.kill();
  return;
}
