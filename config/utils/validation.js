import { getCurrentUserReputation } from "./serializers";
import { getNestedValue } from "./index";

export function isValidEmail(email) {
  const re = /\S+@\S+\.edu/;
  return re.test(email);
}

export function currentUserHasMinimumReputation(stateObject, minimum) {
  let reputation = getCurrentUserReputation(stateObject);
  return reputation >= minimum;
}

export const checkVoteTypeChanged = (prev, next) => {
  const prevVoteType = getNestedValue(prev, ["user_vote", "vote_type"]);
  const nextVoteType = getNestedValue(next, ["user_vote", "vote_type"]);
  if (prevVoteType !== nextVoteType) {
    return nextVoteType;
  }
};
