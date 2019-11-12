import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);

export const timeAgo = new TimeAgo("en-US");

export function formatDateStandard(momentDate) {
  console.log("the moment", momentDate);
  return momentDate.format("MMM Do, YYYY");
}

export function formatPublishedDate(momentDate) {
  return `Published: ${formatDateStandard(momentDate)}`;
}
