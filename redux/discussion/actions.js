import * as types from "./types";

export function setThreadPending() {
  return {
    type: types.FETCH_THREAD_PENDING,
    payload: { doneFetching: false },
  };
}
export function setThread(res) {
  return {
    type: types.FETCH_THREAD_SUCCESS,
    payload: { ...res, doneFetching: true, success: true },
  };
}
export function setThreadFailure() {
  return {
    type: types.FETCH_THREAD_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}

export function setCommentsPending() {
  return {
    type: types.FETCH_COMMENTS_PENDING,
    payload: { doneFetching: false },
  };
}
export function setComments(res) {
  return {
    type: types.FETCH_COMMENTS_SUCCESS,
    payload: { ...res, doneFetching: true, success: true },
  };
}
export function setCommentsFailure() {
  return {
    type: types.FETCH_COMMENTS_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}

export function setPostCommentPending() {
  return {
    type: types.POST_COMMENT_PENDING,
    payload: { donePosting: false },
  };
}
export function setPostCommentFailure() {
  return {
    type: types.POST_COMMENT_FAILURE,
    payload: { donePosting: true, success: false },
  };
}
export function setPostCommentSuccess(comment) {
  return {
    type: types.POST_COMMENT_SUCCESS,
    payload: { donePosting: true, success: true, postedComment: comment },
  };
}

export function setRepliesPending() {
  return {
    type: types.FETCH_REPLIES_PENDING,
    payload: { doneFetching: false },
  };
}
export function setReplies(res) {
  return {
    type: types.FETCH_REPLIES_SUCCESS,
    payload: { ...res, doneFetching: true, success: true },
  };
}
export function setRepliesFailure() {
  return {
    type: types.FETCH_REPLIES_FAILURE,
    payload: { doneFetching: true, success: false },
  };
}

export function setPostReplyPending() {
  return {
    type: types.POST_REPLY_PENDING,
    payload: { donePosting: false },
  };
}
export function setPostReplyFailure() {
  return {
    type: types.POST_REPLY_FAILURE,
    payload: { donePosting: true, success: false },
  };
}
export function setPostReplySuccess(reply) {
  return {
    type: types.POST_REPLY_SUCCESS,
    payload: { donePosting: true, success: true, postedReply: reply },
  };
}

export function setPostVotePending(isUpvote) {
  return {
    type: types.POST_VOTE_PENDING,
    payload: { donePosting: false, isUpvote },
  };
}
export function setPostVoteFailure(isUpvote) {
  return {
    type: types.POST_VOTE_FAILURE,
    payload: { donePosting: true, success: false, isUpvote },
  };
}
export function setPostVoteSuccess(vote) {
  return {
    type: types.POST_VOTE_SUCCESS,
    payload: { donePosting: true, success: true, vote },
  };
}
