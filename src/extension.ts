// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { HelloWorldPanel } from "./SwiperPanel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "eda-test01" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("eda-test01.runEda", () => {
      HelloWorldPanel.createOrShow(context.extensionUri, context);
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

      HelloWorldPanel.createOrShow(context.extensionUri, context, newSelectedText);
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
          HelloWorldPanel.createOrShow(context.extensionUri, context, newSelectedText);
        } else {
          HelloWorldPanel.createOrShow(context.extensionUri, context, undefined);
        }
      } else {
        vscode.window.showErrorMessage("No ative text editor!");
        return;
      }
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("eda-test01.refreshWebview", () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri, context);
      setTimeout(() => {
        vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
      }, 100);
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log("Deactivated");
  return;
}
