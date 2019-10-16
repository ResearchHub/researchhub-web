import { transformDate, transformUser, transformVote } from "../utils";

export const paper = (paper) => {
  return {
    ...paper,
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
}) => {
  let formData = new FormData();
  authors.forEach((author) => {
    return formData.append("authors", author);
  });
  hubs.forEach((hub) => {
    return formData.append("hubs", hub);
  });
  formData.append("doi", doi);
  formData.append("title", title);
  file && formData.append("file", file);
  formData.append("paper_publish_date", publishDate);
  formData.append("url", url);
  formData.append("publication_type", type);
  return formData;
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

function transformThreads(threads) {
  return threads.map((thread) => ({
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
  }));
}
