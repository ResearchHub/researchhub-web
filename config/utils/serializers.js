import { Value } from "slate";
import Plain from "slate-plain-serializer";

import { doesNotExist, getNestedValue } from "./index";

export function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

export function convertToEditorValue(text) {
  if (Value.isValue(text)) {
    return text;
  }

  if (typeof text === "string") {
    return Plain.deserialize(text);
  }

  try {
    return Value.fromJSON(text);
  } catch {
    return undefined;
  }
}

export function getCurrentUser(storeState) {
  return getNestedValue(storeState, ["auth", "user"], null);
}

export function getCurrentUserReputation(storeState) {
  const currentUser = getCurrentUser(storeState);
  if (!doesNotExist(currentUser)) {
    return currentUser.reputation;
  }
  return null;
}

export function getMinimumReputation(storeState, key) {
  return (
    storeState.permission.success &&
    storeState.permission.data[key].minimumReputation
  );
}

export function getVoteType(vote) {
  return vote && vote.voteType;
}
