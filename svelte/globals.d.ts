import * as _vscode from "vscode";
import type { State } from "./src/interfaces";

declare global {
  interface Window {
    injVscode: {
      postMessage: (message: { command: string; value: any }) => void;
      // getState: () => State[];
      // setState: (state: State[]) => void;
    };
    selectedText: string;
  }
}
