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
export function setPostPaperSuccess() {
  return {
    type: types.POST_PAPER_SUCCESS,
    payload: { donePosting: true, success: true },
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
