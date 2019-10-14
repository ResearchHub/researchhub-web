import { Value } from "slate";
import Plain from "slate-plain-serializer";

export function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

export function getVoteType(vote) {
  return vote && vote.voteType;
}

export function deserializeEditor(text) {
  try {
    text = Value.fromJSON(JSON.parse(text));
  } catch (SyntaxError) {
    text = Plain.deserialize(text);
  }
  return text;
}
