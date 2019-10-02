import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import { logFetchError } from "~/config/utils";

export function fetchThread(paperId, threadId) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD(paperId, threadId),
      API.GET_CONFIG()
    ).catch((err) => console.log("Fetch error caught in promise", err));

    if (!response.ok) {
      logFetchError(response);
      return dispatch(actions.setThreadFailure());
    }

    const body = await response.json();
    const thread = shims.thread(body);

    return dispatch(actions.setThread(thread));
  };
}

export function fetchComments(paperId, threadId, page) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId, page),
      API.GET_CONFIG()
    ).catch((err) => console.log("Fetch error caught in promise", err));

    if (!response.ok) {
      logFetchError(response);
      return dispatch(actions.setCommentsFailure());
    }

    const body = await response.json();
    const comments = shims.comments(body);
    comments.page = page;

    return dispatch(actions.setComments(comments));
  };
}

const DiscussionActions = {
  fetchThread,
  fetchThreadPending: actions.setThreadPending,
  fetchComments,
  fetchCommentsPending: actions.setCommentsPending,
};

export default DiscussionActions;
