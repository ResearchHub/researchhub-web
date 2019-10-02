import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import { logFetchError } from "~/config/utils";

const FETCH_ERROR_MESSAGE = "Fetch error caught in promise";

export function fetchThread(paperId, threadId) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD(paperId, threadId),
      API.GET_CONFIG()
    ).catch(handleCatch);

    const successDispatch = async () => {
      const body = await response.json();
      const thread = shims.thread(body);
      return dispatch(actions.setThread(thread));
    };

    return dispatchResult(
      response,
      dispatch(actions.setThreadFailure()),
      successDispatch()
    );
  };
}

export function fetchComments(paperId, threadId, page) {
  return async (dispatch) => {
    const response = await fetch(
      API.THREAD_COMMENT(paperId, threadId, page),
      API.GET_CONFIG()
    ).catch(handleCatch);

    const successDispatch = async () => {
      const body = await response.json();
      const comments = shims.comments(body);
      comments.page = page;

      return dispatch(actions.setComments(comments));
    };

    return dispatchResult(
      response,
      dispatch(actions.setCommentsFailure()),
      successDispatch()
    );
  };
}


  };
}

function handleCatch(err) {
  console.log(FETCH_ERROR_MESSAGE, err);
  return err;
}

function dispatchResult(response, failure, success) {
  if (!response.ok) {
    logFetchError(response);
    return failure;
  }
  return success;
}

const DiscussionActions = {
  fetchThread,
  fetchThreadPending: actions.setThreadPending,
  fetchComments,
  fetchCommentsPending: actions.setCommentsPending,
};

export default DiscussionActions;
