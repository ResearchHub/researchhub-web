import { transformDate, transformUser, transformVote } from "../utils";

export const thread = (thread) => {
  return {
    id: thread.id,
    title: thread.title,
    text: thread.text,
    paper: thread.paper,
    createdBy: transformUser(thread.created_by),
    createdDate: transformDate(thread.created_date),
    isPublic: thread.is_public,
    score: thread.score,
    userVote: transformVote(thread.user_vote),
  };
};

export const comments = (page) => {
  return {
    page: page.page,
    count: page.count,
    nextPage: page.next,
    previousPage: page.previous,
    comments: transformComments(page.results),
  };
};

export const postCommentResponse = (comment) => {
  return transformComment(comment);
};

function transformComments(comments) {
  return comments.map((comment) => {
    return transformComment(comment);
  });
}

function transformComment(comment) {
  return {
    id: comment.id,
    text: comment.text,
    thread: comment.parent,
    createdBy: transformUser(comment.created_by),
    createdDate: comment.created_date,
    score: comment.score,
    userVote: transformVote(comment.user_vote),
    replies: transformReplies(comment.replies),
    replyCount: comment.reply_count,
  };
}

export const replies = (page) => {
  return {
    page: page.page,
    count: page.count,
    nextPage: page.next,
    previousPage: page.previousPage,
    replies: transformReplies(page.results),
  };
};

export const postReplyResponse = (reply) => {
  return transformReply(reply);
};

function transformReplies(replies) {
  return replies.map((reply) => {
    return transformReply(reply);
  });
}

function transformReply(reply) {
  return {
    id: reply.id,
    text: reply.text,
    comment: reply.parent,
    createdBy: transformUser(reply.created_by),
    createdDate: reply.created_date,
    score: reply.score,
    userVote: transformVote(reply.user_vote),
  };
}

export const vote = (vote) => {
  return transformVote(vote);
};
