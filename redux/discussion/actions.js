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
    payload: { doneFetching: true, ...res },
  };
}
export function setThreadFailure() {
  return {
    type: types.FETCH_THREAD_FAILURE,
    payload: { doneFetching: true },
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
    payload: { doneFetching: true, ...res },
  };
}
export function setCommentsFailure() {
  return {
    type: types.FETCH_COMMENTS_FAILURE,
    payload: { doneFetching: true },
  };
}
