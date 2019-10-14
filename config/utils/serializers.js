import { Value } from "slate";
import Plain from "slate-plain-serializer";

import { getNestedValue } from "./index";

export function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

export function deserializeEditor(text) {
  try {
    text = Value.fromJSON(JSON.parse(text));
  } catch (SyntaxError) {
    text = Plain.deserialize(text);
  }
  return text;
}

export function getCurrentUser(storeObject) {
  return getNestedValue(storeObject, ["auth", "user"], null);
}

export function getVoteType(vote) {
  return vote && vote.voteType;
}
