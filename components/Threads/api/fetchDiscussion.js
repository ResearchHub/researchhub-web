import * as shims from "../../../redux/discussion/shims";

import api from "~/config/api";
import { handleCatch } from "~/redux/utils";
import { sendAmpEvent } from "~/config/fetch";
import { logFetchError } from "~/config/utils/misc";

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
