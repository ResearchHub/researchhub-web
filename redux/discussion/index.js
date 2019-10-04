import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import * as utils from "../utils";

const FETCH_ERROR_MESSAGE = "Fetch error caught in promise";

export function fetchThread(paperId, threadId) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD(paperId, threadId),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    const successDispatch = async () => {
      const body = await response.json();
      const thread = shims.thread(body);
      return actions.setThread(thread);
    };

    return utils.dispatchResult(
      response,
      dispatch,
      actions.setThreadFailure(),
      successDispatch()
    );
  };
}

export function fetchComments(paperId, threadId, page) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId, page),
      API.GET_CONFIG()
    ).catch(utils.handleCatch);

    const successDispatch = async () => {
      const body = await response.json();
      const comments = shims.comments(body);
      comments.page = page;

      return actions.setComments(comments);
    };

    return utils.dispatchResult(
      response,
      dispatch,
      actions.setCommentsFailure(),
      successDispatch()
    );
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

    return utils.dispatchResult(
      response,
      dispatch,
      actions.setPostCommentFailure(),
      actions.setPostCommentSuccess()
    );
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
