// state.ts
import type { State } from "./interfaces";
import * as extensionApi from "./extensionApi";
import { writable, derived, get } from "svelte/store";

// Define the stores
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

window.addEventListener("message", (event) => {
  const message = event.data;
  switch (message.command) {
    case "setState":
      allStates.set(message.value ?? []);
      findCurrentState(window.selectedText);
      break;
  }
});

export { currentState, allStates };
