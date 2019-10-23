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

export function getUserDiscussionsPending() {
  return {
    type: types.GET_USER_DISCUSSIONS_PENDING,
    payload: { doneFetching: false },
  };
}
export function getUserDiscussionsFailure() {
  return {
    type: types.GET_USER_DISCUSSIONS_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}
export function getUserDiscussionsSuccess(userDiscussions) {
  return {
    type: types.GET_USER_DISCUSSIONS_SUCCESS,
    payload: { doneFetching: true, success: true, userDiscussions },
  };
}

export function getUserContributionsPending() {
  return {
    type: types.GET_USER_CONTRIBUTIONS_PENDING,
    payload: { doneFetching: false },
  };
}
export function getUserContributionsFailure() {
  return {
    type: types.GET_USER_CONTRIBUTIONS_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}
export function getUserContributionsSuccess(userContributions) {
  return {
    type: types.GET_USER_CONTRIBUTIONS_SUCCESS,
    payload: { doneFetching: true, success: true, userContributions },
  };
}
