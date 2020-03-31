import * as types from "./types";

export function getAuthoredPapersPending() {
  return {
    type: types.GET_AUTHORED_PAPERS_PENDING,
    payload: { authorDoneFetching: false },
  };
}
export function getAuthoredPapersFailure() {
  return {
    type: types.GET_AUTHORED_PAPERS_FAILURE,
    payload: { authorDoneFetching: true, success: false },
  };
}
export function getAuthoredPapersSuccess(authoredPapers) {
  return {
    type: types.GET_AUTHORED_PAPERS_SUCCESS,
    payload: { authorDoneFetching: true, success: true, authoredPapers },
  };
}

export function getUserDiscussionsPending() {
  return {
    type: types.GET_USER_DISCUSSIONS_PENDING,
    payload: { discussionsDoneFetching: false },
  };
}
export function getUserDiscussionsFailure() {
  return {
    type: types.GET_USER_DISCUSSIONS_FAILURE,
    payload: { discussionsDoneFetching: true, success: false },
  };
}
export function getUserDiscussionsSuccess(userDiscussions) {
  return {
    type: types.GET_USER_DISCUSSIONS_SUCCESS,
    payload: { discussionsDoneFetching: true, success: true, userDiscussions },
  };
}

export function getUserContributionsPending() {
  return {
    type: types.GET_USER_CONTRIBUTIONS_PENDING,
    payload: { contributionsDoneFetching: false },
  };
}
export function getUserContributionsFailure() {
  return {
    type: types.GET_USER_CONTRIBUTIONS_FAILURE,
    payload: { contributionsDoneFetching: true, success: false },
  };
}
export function getUserContributionsSuccess(userContributions) {
  return {
    type: types.GET_USER_CONTRIBUTIONS_SUCCESS,
    payload: {
      contributionsDoneFetching: true,
      success: true,
      userContributions,
    },
  };
}
