import * as types from "./types";

export function getAuthoredPapersPending() {
  return {
    type: types.GET_AUTHORED_PAPERS_PENDING,
    payload: { doneFetching: false },
  };
}
export function getAuthoredPapersFailure() {
  return {
    type: types.GET_AUTHORED_PAPERS_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}
export function getAuthoredPapersSuccess(authoredPapers) {
  return {
    type: types.GET_AUTHORED_PAPERS_SUCCESS,
    payload: { doneFetching: true, success: true, authoredPapers },
  };
}
