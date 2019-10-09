import moment from "moment";

import { UPVOTE, DOWNVOTE } from "~/config/constants";
import { doesNotExist } from "~/config/utils";
export { logFetchError } from "~/config/utils";

const FETCH_ERROR_MESSAGE = "Fetch error caught in promise";

export function handleCatch(err) {
  console.log(FETCH_ERROR_MESSAGE, err);
  return err;
}

export function transformVote(vote) {
  if (!doesNotExist(vote) && vote !== "null") {
    return {
      itemId: vote.item,
      voteType: transformVoteType(vote.vote_type),
      userId: vote.created_by,
      createdDate: transformDate(vote.created_date),
    };
  } else {
    return {};
  }
}

export function transformVoteType(voteType) {
  if (voteType === 1 || voteType === "1") {
    return UPVOTE;
  }
  if (voteType === 2 || voteType === "2") {
    return DOWNVOTE;
  }
}

export function transformDate(date) {
  return moment(date);
}
