import * as types from "./types";

export function setThreadPending() {
  return {
    type: types.FETCH_THREAD_PENDING,
    payload: { doneFetching: false },
  };
}
export function setThread(res) {
  return {
    type: types.FETCH_THREAD_SUCCESS,
    payload: { ...res, doneFetching: true, success: true },
  };
}
export function setThreadFailure() {
  return {
    type: types.FETCH_THREAD_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}

export function setCommentsPending() {
  return {
    type: types.FETCH_COMMENTS_PENDING,
    payload: { doneFetching: false },
  };
}
export function setComments(res) {
  return {
    type: types.FETCH_COMMENTS_SUCCESS,
    payload: { ...res, doneFetching: true, success: true },
  };
}
export function setCommentsFailure() {
  return {
    type: types.FETCH_COMMENTS_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}

export function setPostCommentPending() {
  return {
    type: types.POST_COMMENT_PENDING,
    payload: { donePosting: false },
  };
}
export function setPostCommentFailure() {
  return {
    type: types.POST_COMMENT_FAILURE,
    payload: { donePosting: true, success: false },
  };
}
export function setPostCommentSuccess() {
  return {
    type: types.POST_COMMENT_SUCCESS,
    payload: { donePosting: true, success: true },
  };
}
