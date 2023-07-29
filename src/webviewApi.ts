import { Webview } from "vscode";
import { FromExtensionMessage } from "messaging";

export function postMessage(webview: Webview, message: FromExtensionMessage) {
  webview.postMessage(message);
}
