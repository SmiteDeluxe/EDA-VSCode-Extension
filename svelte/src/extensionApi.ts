import type { State } from "./interfaces";

export function setGlobalState(states: State[]) {
  window.injVscode.postMessage({
    command: "setState",
    value: states,
  });
}

export function createInfoToast(message: string) {
  window.injVscode.postMessage({ command: "onInfo", value: message });
}
