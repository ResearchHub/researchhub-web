export function createUsername({ createdBy }) {
  const { firstName, lastName } = createdBy;
  return `${firstName} ${lastName}`;
}

export function getVoteType(vote) {
  return vote && vote.voteType;
}
