import * as types from "./types";

export function setThread(res) {
  return { type: types.FETCH_THREAD_SUCCESS, payload: res };
}
export function setThreadFailure() {
  return { type: types.FETCH_THREAD_FAILURE };
}

export function setComments(res) {
  return { type: types.FETCH_COMMENTS_SUCCESS, payload: res };
}
export function setCommentsFailure() {
  return { type: types.FETCH_COMMENTS_FAILURE };
}
