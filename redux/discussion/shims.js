import { transformDate, transformUser, transformVote } from "../utils";

export const thread = (thread) => {
  return {
    ...thread,
    id: thread.id,
    title: thread.title,
    text: thread.text,
    paper: thread.paper,
    commentCount: thread.comment_count,
    createdBy: transformUser(thread.created_by),
    createdDate: transformDate(thread.created_date),
    isPublic: thread.is_public,
    score: thread.score,
    userVote: transformVote(thread.user_vote),
    plainText: thread.plain_text,
    paperTitle: thread.paper_title,
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

export const comment = (comment) => {
  return transformComment(comment);
};

export function transformComments(comments) {
  return comments.map((comment) => {
    return transformComment(comment);
  });
}

export function transformComment(comment) {
  return {
    ...comment,
    id: comment.id,
    text: comment.text,
    thread: comment.parent,
    createdBy: transformUser(comment.created_by),
    createdDate: comment.created_date,
    score: comment.score,
    userVote: transformVote(comment.user_vote),
    replies: transformReplies(comment.replies),
    replyCount: comment.reply_count,
    thread: comment.thread,
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

export const reply = (reply) => {
  return transformReply(reply);
};

export function transformReplies(replies) {
  return (
    replies &&
    replies.map((reply) => {
      return transformReply(reply);
    })
  );
}

export function transformReply(reply) {
  return {
    ...reply,
    id: reply.id,
    text: reply.text,
    comment: reply.parent,
    createdBy: transformUser(reply.created_by),
    createdDate: reply.created_date,
    score: reply.score,
    userVote: transformVote(reply.user_vote),
    thread: reply.thread,
  };
}

export const vote = (vote) => {
  return transformVote(vote);
};
