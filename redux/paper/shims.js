import moment from "moment";

import { getNestedValue } from "~/config/utils";

export const paper = (paper) => {
  return {
    ...paper,
    discussion: {
      ...paper.discussion,
      count: paper.discussion.count,
      threads: transformThreads(paper.discussion.threads),
    },
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
  }));
}

function transformDate(date) {
  return moment(date);
}

function transformUser(user) {
  return {
    firstName: getNestedValue(user, ["first_name"], ""),
    lastName: getNestedValue(user, ["last_name"], ""),
  };
}
