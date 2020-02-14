import { transformDate, transformUser, transformVote } from "../utils";

export const paper = (paper) => {
  return {
    ...paper,
    publishedDate: transformDate(paper.paper_publish_date),
    tagline: paper.tagline,
    discussion: {
      ...paper.discussion,
      count: paper.discussion.count,
      threads: transformThreads(paper.discussion.threads),
    },
    userVote: transformVote(paper.user_vote),
  };
};

export const paperPost = ({
  authors,
  doi,
  file,
  hubs,
  publishDate,
  title,
  url,
  type,
  tagline,
}) => {
  let formData = new FormData();
  authors &&
    authors.forEach((author) => {
      return formData.append("authors", author);
    });
  hubs &&
    hubs.forEach((hub) => {
      return formData.append("hubs", hub);
    });
  doi && formData.append("doi", doi);
  title && formData.append("title", title);
  file && formData.append("file", file);
  publishDate && formData.append("paper_publish_date", publishDate);
  url && formData.append("url", url);
  type && formData.append("publication_type", type);
  tagline && formData.append("tagline", tagline);
  return formData;
};

export const editHistory = (editHistory) => {
  return editHistory.map((edit) => {
    return transformEdit(edit);
  });
};

export const paperSummaryPost = ({ paperId, text }) => {
  return {
    paper: paperId,
    summary: text,
  };
};

export const vote = (vote) => {
  return transformVote(vote);
};

export function transformThreads(threads) {
  return threads.map((thread) => {
    if (thread.created_by) {
      return {
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
        comments: transformComments(thread.comments),
        isRemoved: thread.is_removed,
        userFlag: thread.user_flag,
      };
    } else {
      return thread;
    }
  });
}

function transformEdit(edit) {
  return {
    id: edit.id,
    proposedBy: transformUser(edit.proposed_by),
    summary: edit.summary,
    previousSummary: edit.previous__summary,
    approved: edit.approved,
    approvedBy: transformUser(edit.approved_by),
    approvedDate: edit.approved_date,
    createdDate: edit.created_date,
    updatedDate: edit.updated_date,
    paper: edit.paper,
  };
}

export function transformComments(comments) {
  return comments.map((comment) => {
    return transformComment(comment);
  });
}

export function transformComment(comment) {
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
    thread: comment.thread,
    isRemoved: comment.is_removed,
    userFlag: comment.user_flag,
  };
}

function transformReplies(replies) {
  return (
    replies &&
    replies.map((reply) => {
      return transformReply(reply);
    })
  );
}

export function transformReply(reply) {
  return {
    id: reply.id,
    text: reply.text,
    comment: reply.parent,
    createdBy: transformUser(reply.created_by),
    createdDate: reply.created_date,
    score: reply.score,
    userVote: transformVote(reply.user_vote),
    thread: reply.thread,
    isRemoved: reply.is_removed,
    userFlag: reply.user_flag,
  };
}

// export function
