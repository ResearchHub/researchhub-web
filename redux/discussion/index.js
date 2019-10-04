import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import * as utils from "../utils";

export function fetchThread(paperId, threadId) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD(paperId, threadId),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setThreadFailure();

    if (response.ok) {
      const body = await response.json();
      const thread = shims.thread(body);
      action = actions.setThread(thread);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function fetchComments(paperId, threadId, page) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId, page),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    let action = actions.setCommentsFailure();

    if (response.ok) {
      const body = await response.json();
      const comments = shims.comments(body);
      comments.page = page;
      action = actions.setComments(comments);
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

export function postComment(paperId, threadId, text) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId),
      API.POST_CONFIG({
        text,
        parent: threadId,
      })
    ).catch(utils.handleCatch);

    let action = actions.setPostCommentFailure();

    if (response.ok) {
      action = actions.setPostCommentSuccess();
    } else {
      utils.logFetchError(response);
    }

    return dispatch(action);
  };
}

const DiscussionActions = {
  fetchThread,
  fetchThreadPending: actions.setThreadPending,
  fetchComments,
  fetchCommentsPending: actions.setCommentsPending,
  postComment,
  postCommentPending: actions.setPostCommentPending,
};

export default DiscussionActions;
