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

export function setUpdateThreadPending() {
  return {
    type: types.UPDATE_THREAD_PENDING,
    payload: { doneUpdating: false },
  };
}
export function setUpdateThreadFailure() {
  return {
    type: types.UPDATE_THREAD_FAILURE,
    payload: { doneUpdating: true, success: false },
  };
}
export function setUpdateThread(thread) {
  return {
    type: types.UPDATE_THREAD_SUCCESS,
    payload: { doneUpdating: true, success: true, updatedThread: thread },
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

export function setUpdateCommentPending() {
  return {
    type: types.UPDATE_COMMENT_PENDING,
    payload: { doneUpdating: false },
  };
}
export function setUpdateCommentFailure() {
  return {
    type: types.UPDATE_COMMENT_FAILURE,
    payload: { doneUpdating: true, success: false },
  };
}
export function setUpdateComment(comment) {
  return {
    type: types.UPDATE_COMMENT_SUCCESS,
    payload: { doneUpdating: true, success: true, updatedComment: comment },
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

export function setUpdateReplyPending() {
  return {
    type: types.UPDATE_REPLY_PENDING,
    payload: { doneUpdating: false },
  };
}
export function setUpdateReplyFailure() {
  return {
    type: types.UPDATE_REPLY_FAILURE,
    payload: { doneUpdating: true, success: false },
  };
}
export function setUpdateReply(reply) {
  return {
    type: types.UPDATE_REPLY_SUCCESS,
    payload: { doneUpdating: true, success: true, updatedReply: reply },
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
