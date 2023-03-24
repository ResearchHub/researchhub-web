import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as shims from "../../../redux/discussion/shims";

import api from "~/config/api";
import { handleCatch } from "~/redux/utils";
import { sendAmpEvent } from "~/config/fetch";
import { logFetchError } from "~/config/utils/misc";

export async function postReply({
  documentType,
  paperId,
  documentId,
  threadId,
  commentId,
  text,
  plainText,
}) {
  const response = await fetch(
    api.THREAD_COMMENT_REPLY(
      documentType,
      paperId,
      documentId,
      threadId,
      commentId
    ),
    api.POST_CONFIG({
      text,
      parent: commentId,
      plain_text: plainText,
    })
  ).catch(handleCatch);

  if (response.status === 429) {
    let err = { response: {} };
    err.response.status = 429;
    handleCatch(err, dispatch);
    return dispatch(action);
  }

  if (response.ok) {
    const body = await response.json();
    const reply = body;
    let payload = {
      event_type: "create_reply",
      time: +new Date(),
      user_id: body.created_by.id,
      insert_id: `reply_${reply.id}`,
      is_removed: reply.is_removed,
      event_properties: {
        interaction: "Post Reply",
        paper: paperId,
        thread: threadId,
        comment: commentId,
      },
    };
    sendAmpEvent(payload);
    return reply;
  } else {
    logFetchError(response);
  }
}

export async function updateDiscussion({
  documentType,
  paperId,
  documentId,
  threadId,
  body,
  commentId,
  replyId,
}) {
  const response = await fetch(
    api.PAPER_CHAIN(
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ),
    api.PATCH_CONFIG(body)
  ).catch(handleCatch);

  if (response.ok) {
    const body = await response.json();
    const thread = replyId || commentId ? body : shims.thread(body);
    return thread;
  } else {
    logFetchError(response);
  }
}

export async function postDownvote({
  documentType,
  paperId,
  documentId,
  threadId,
  commentId,
  replyId,
  dispatch,
}) {
  const response = await fetch(
    api.DOWNVOTE(
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ),
    api.POST_CONFIG()
  ).catch(handleCatch);

  if (response.status === 429) {
    let err = { response: {} };
    err.response.status = 429;
    handleCatch(err, dispatch);
  }

  if (response.ok) {
    const body = await response.json();
    const vote = shims.vote(body);

    let payload = {
      event_type: "create_discussion_vote",
      time: +new Date(),
      user_id: vote.userId,
      insert_id: `dis_vote_${vote.id}`,
      event_properties: {
        interaction: "Discussion Downvote",
        paper: paperId,
        document: documentId,
        thread: threadId,
        comment: commentId,
        reply: replyId,
      },
    };
    sendAmpEvent(payload);
    return vote;
  } else {
    logFetchError(response);
    return null;
  }
}

export async function neutralVote({
  documentType,
  paperId,
  documentId,
  threadId,
  commentId,
  replyId,
  dispatch,
}) {
  const response = await fetch(
    api.NEUTRAL_VOTE(
      documentType,
      paperId,
      documentId,
      threadId,
      commentId,
      replyId
    ),
    api.POST_CONFIG()
  ).catch(handleCatch);

  if (response.status === 429) {
    let err = { response: {} };
    err.response.status = 429;
    handleCatch(err, dispatch);
  }

  if (response.ok) {
    const body = await response.json();
    const vote = shims.vote(body);
    let payload = {
      event_type: "neutralize_discussion_vote",
      time: +new Date(),
      user_id: vote.userId,
      insert_id: `dis_vote_${vote.id}`,
      event_properties: {
        interaction: "Discussion Neutral Vote",
        paper: paperId,
        document: documentId,
        thread: threadId,
        comment: commentId,
        reply: replyId,
      },
    };
    sendAmpEvent(payload);
    return vote;
  } else {
    logFetchError(response);
    return null;
  }
}

export async function postUpvote({
  documentType,
  paperId,
  documentId,
  threadId,
  commentId,
  replyId,
  dispatch,
}) {
  const response = await fetch(
    api.UPVOTE(documentType, paperId, documentId, threadId, commentId, replyId),
    api.POST_CONFIG()
  ).catch(handleCatch);

  if (response.status === 429) {
    let err = { response: {} };
    err.response.status = 429;
    handleCatch(err, dispatch);
  }

  if (response.ok) {
    const body = await response.json();
    const vote = shims.vote(body);
    let payload = {
      event_type: "create_discussion_vote",
      time: +new Date(),
      user_id: vote.userId,
      insert_id: `dis_vote_${vote.id}`,
      event_properties: {
        interaction: "Discussion Upvote",
        paper: paperId,
        document: documentId,
        thread: threadId,
        comment: commentId,
        reply: replyId,
      },
    };
    sendAmpEvent(payload);
    return vote;
  } else {
    logFetchError(response);
    return null;
  }
}
