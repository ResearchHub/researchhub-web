import * as types from "./types";

export function setPostVotePending(isUpvote) {
  return {
    type: types.POST_VOTE_PENDING,
    payload: { donePosting: false, isUpvote },
  };
}
export function setPostVoteFailure(isUpvote) {
  return {
    type: types.POST_VOTE_FAILURE,
    payload: { donePosting: true, success: false, isUpvote },
  };
}
export function setPostVoteSuccess(isUpvote, vote) {
  return {
    type: types.POST_VOTE_SUCCESS,
    payload: { donePosting: true, success: true, isUpvote, vote },
  };
}
