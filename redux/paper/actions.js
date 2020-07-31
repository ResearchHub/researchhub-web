import * as types from "./types";

export function setPostPaperPending(request = "POST") {
  let type = function(request) {
    switch (request) {
      case "PATCH":
        return types.PATCH_PAPER_PENDING;
      case "PUT":
        return types.PUT_PAPER_PENDING;
      case "POST":
        return types.POST_PAPER_PENDING;
      default:
        return types.POST_PAPER_PENDING;
    }
  };

  return {
    type: type(request),
    payload: { donePosting: false },
  };
}
export function setPostPaperFailure(request = "POST", errorBody) {
  let type = function(request) {
    switch (request) {
      case "PATCH":
        return types.PATCH_PAPER_FAILURE;
      case "PUT":
        return types.PUT_PAPER_FAILURE;
      case "POST":
        return types.POST_PAPER_FAILURE;
      default:
        return types.POST_PAPER_FAILURE;
    }
  };

  return {
    type: type(request),
    payload: { donePosting: true, success: false, errorBody },
  };
}
export function setPostPaperSuccess(postedPaper, request = "POST") {
  let type = function(request) {
    switch (request) {
      case "PATCH":
        return types.PATCH_PAPER_SUCCESS;
      case "PUT":
        return types.PUT_PAPER_SUCCESS;
      case "POST":
        return types.POST_PAPER_SUCCESS;
      default:
        return types.POST_PAPER_SUCCESS;
    }
  };

  return {
    type: type(request),
    payload: { donePosting: true, success: true, postedPaper: postedPaper },
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
