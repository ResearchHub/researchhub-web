import moment from "moment";

import { getNestedValue } from "~/config/utils";

export const paperShim = (paper) => {
  return {
    ...paper,
    discussion: {
      ...paper.discussion,
      count: paper.discussion.count,
      threads: transformThreads(paper.discussion.threads),
    },
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
