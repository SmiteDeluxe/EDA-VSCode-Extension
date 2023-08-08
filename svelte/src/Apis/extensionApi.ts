import type { State } from "../../../types/types";

export function setGlobalState(states: State[]) {
  window.injVscode.postMessage({
    command: "setGlobalState",
    value: states,
  });
}

export function createInfoToast(message: string) {
  window.injVscode.postMessage({ command: "setInfo", value: message });
}

export function createErrorToast(message: string) {
  window.injVscode.postMessage({ command: "setError", value: message });
}
