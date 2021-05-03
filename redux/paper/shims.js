import { transformDate, transformUser, transformVote } from "../utils";

export const paper = (paper) => {
  return {
    ...paper,
    publishedDate: transformDate(paper.paper_publish_date),
    tagline: paper.tagline,
    discussion: {
      count: paper.discussion ? paper.discussion.count : null,
      filter:
        paper.discussion && paper.discussion.filter
          ? paper.discussion.filter
          : null,
      next:
        paper.discussion && paper.discussion.next
          ? paper.discussion.next
          : null,
      source:
        paper.discussion && paper.discussion.source
          ? paper.discussion.source
          : "researchhub",
    },
    metatagImage: paper.metatag_image,
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
  abstract,
  paper_title,
  raw_authors,
  paper_type,
}) => {
  let formData = new FormData();
  authors &&
    authors.length &&
    authors.forEach((author) => {
      return formData.append("authors", JSON.stringify(author));
    });

  if (raw_authors) {
    if (raw_authors.length) {
      raw_authors.forEach((raw_author) => {
        return formData.append(`raw_authors`, JSON.stringify(raw_author));
      });
    }
  }

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
  abstract && formData.append("abstract", abstract);
  paper_title && formData.append("paper_title", paper_title);
  paper_type && formData.append("paper_type", paper_type);
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
  return threads.map((thread, index) => {
    return {
      ...thread,
      comments: transformComments(thread.comments),
      threadIndex: index,
      type: "thread",
    };
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
    score: edit.score,
    user_vote: edit.user_vote,
  };
}

export function transformComments(comments) {
  return comments.map((comment, index) => {
    return transformComment(comment, index);
  });
}

export function transformComment(comment, index) {
  return {
    ...comment,
    replies: transformReplies(comment.replies),
    commentIndex: index,
    type: "comment",
  };
}

function transformReplies(replies) {
  return (
    replies &&
    replies
      .map((reply, index) => {
        return transformReply(reply, index);
      })
      .sort((a, b) => {
        if (a.createdDate < b.createdDate) {
          return -1;
        } else if (a.createdDate > b.createdDate) {
          return 1;
        }
        return 0;
      })
  );
}

export function transformReply(reply, index) {
  return {
    ...reply,
    replyIndex: index,
    type: "reply",
  };
}

export function getTotalDiscussionCount(threads) {
  let count = 0;

  threads.forEach((thread) => {
    !thread["is_removed"] && count++;
    const comments = thread["comments"];
    if (comments && comments.length) {
      comments.forEach((comment) => {
        !comment["is_removed"] && count++;
        const replies = comment["replies"];
        if (replies && replies.length) {
          replies.forEach((reply) => {
            !reply["is_removed"] && count++;
          });
        }
      });
    }
  });

  return count;
}
