import { getCurrentUserReputation } from "./serializers";

export function isValidEmail(email) {
  const re = /\S+@\S+\.edu/;
  return re.test(email);
}

export function currentUserHasMinimumReputation(stateObject, minimum) {
  reputation = getCurrentUserReputation(stateObject);
  return reputation >= minimum;
}
