import * as actions from "./actions";
import API from "~/config/api";
import { logFetchError } from "~/config/utils";

export function fetchThread(paperId, threadId) {
  return async (dispatch) => {
    const res = await fetch(
      API.THREAD(paperId, threadId),
      API.GET_CONFIG()
    ).catch((err) => console.log("Fetch error caught in promise", err));

    if (!res.ok) {
      logFetchError(res);
      return dispatch(actions.setThreadFailure());
    }
    return dispatch(actions.setThread(res.json()));
  };
}

export function fetchComments(threadId, page) {
  return (dispatch) => {
    const result = fetch();

    if (result) {
      dispatch(actions.setComments(result));
    } else {
      dispatch(actions.setCommentsFailure());
    }
  };
}

const DiscussionActions = {
  fetchThread,
  fetchThreadPending: actions.setThreadPending,
  fetchComments,
  fetchCommentsPending: actions.setCommentsPending,
};

export default DiscussionActions;
