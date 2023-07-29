import type { FromExtensionMessage } from "../../types/messaging";
import type { State } from "../../types/types";
import * as extensionApi from "./extensionApi";
import { writable, derived, get } from "svelte/store";

// Define the stores, current state to default in case the extension never calls setWebviewState( Shouldn't happen)
let currentState = writable<State | undefined>({ selectedText: window.selectedText, randomText: "" });
let allStates = writable<State[]>([]);

// Derive a store that automatically updates when currentState or allStates change
let updatedAllStates = derived([currentState, allStates], ([$currentState, $allStates]) =>
  $allStates.filter((as: State) => as.selectedText !== $currentState?.selectedText).concat([$currentState]),
);

// Set Global states whenever updatedAllStates changes
updatedAllStates.subscribe(($updatedAllStates) => {
  extensionApi.setGlobalState($updatedAllStates);
});

// Find current state in allStates
function findCurrentState(selectedText?: string) {
  let foundState = get(allStates).find((as: State) => as.selectedText === selectedText);
  if (foundState) {
    currentState.set(foundState);
  }
}

// This should be fired immediately whenever the panel is created or made visible again
window.addEventListener("message", (event) => {
  const message = event.data as FromExtensionMessage;
  switch (message.command) {
    case "setWebviewState":
      allStates.set(message.value ?? []);
      findCurrentState(window.selectedText);
      break;
  }
});

export { currentState, allStates };
