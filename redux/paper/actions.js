import * as types from "./types";

export function setPostPaperPending() {
  return {
    type: types.POST_PAPER_PENDING,
    payload: { donePosting: false },
  };
}
export function setPostPaperFailure() {
  return {
    type: types.POST_PAPER_FAILURE,
    payload: { donePosting: true, success: false },
  };
}
export function setPostPaperSuccess(postedPaper) {
  return {
    type: types.POST_PAPER_SUCCESS,
    payload: { donePosting: true, success: true, postedPaper },
  };
}

export function setPostPaperSummaryPending() {
  return {
    type: types.POST_PAPER_SUMMARY_PENDING,
    payload: { donePosting: false },
  };
}
export function setPostPaperSummaryFailure() {
  return {
    type: types.POST_PAPER_SUMMARY_FAILURE,
    payload: { donePosting: true, success: false },
  };
}
export function setPostPaperSummarySuccess() {
  return {
    type: types.POST_PAPER_SUMMARY_SUCCESS,
    payload: { donePosting: true, success: true },
  };
}

export function setUserVotePending() {
  return {
    type: types.GET_PAPER_USER_VOTE_PENDING,
    payload: { doneFetching: false },
  };
}
export function setUserVoteFailure() {
  return {
    type: types.GET_PAPER_USER_VOTE_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}
export function setUserVoteSuccess(vote) {
  return {
    type: types.GET_PAPER_USER_VOTE_SUCCESS,
    payload: { doneFetching: true, success: true, vote },
  };
}
