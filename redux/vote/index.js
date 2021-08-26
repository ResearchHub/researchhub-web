import * as actions from "./actions";
import * as shims from "./shims";
import API from "~/config/api";
import { handleCatch } from "../utils";
import { logFetchError } from "~/config/utils/misc";

export function postUpvote(paperId, threadId, commentId, replyId) {
  const isUpvote = true;

  return async (dispatch) => {
    const response = await fetch(
      API.UPVOTE("paper", paperId, threadId, commentId, replyId),
      API.POST_CONFIG()
    ).catch(handleCatch);

    let action = actions.setPostVoteFailure(isUpvote);

    if (response.status === 429) {
      let err = { response: {} };
      err.response.status = 429;
      handleCatch(err, dispatch);
      return dispatch(action);
    }

    if (response.ok) {
      const body = await response.json();
      const vote = shims.vote(body);
      action = actions.setPostVoteSuccess(isUpvote, vote);
    } else {
      logFetchError(response);
    }

    return dispatch(action);
  };
}

export function postDownvote(paperId, threadId, commentId, replyId) {
  const isUpvote = false;

  return async (dispatch) => {
    const response = await fetch(
      API.DOWNVOTE("paper", paperId, threadId, commentId, replyId),
      API.POST_CONFIG()
    ).catch(handleCatch);

    let action = actions.setPostVoteFailure(isUpvote);

    if (response.status === 429) {
      let err = { response: {} };
      err.response.status = 429;
      handleCatch(err, dispatch);
      return dispatch(action);
    }

    if (response.ok) {
      const body = await response.json();
      const vote = shims.vote(body);
      action = actions.setPostVoteSuccess(isUpvote, vote);
    } else {
      logFetchError(response);
    }

    return dispatch(action);
  };
}

const VoteActions = {
  postUpvote,
  postUpvotePending: () => actions.setPostVotePending(true),
  postDownvote,
  postDownvotePending: () => actions.setPostVotePending(false),
};

export default VoteActions;
