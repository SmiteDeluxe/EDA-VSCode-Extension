import { Webview } from "vscode";
import { FromExtensionMessage } from "messaging";

// Wrapper to enforce typing
export function postMessage(webview: Webview, message: FromExtensionMessage) {
  webview.postMessage(message);
}
