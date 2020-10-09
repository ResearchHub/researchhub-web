import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import moment from "moment";

TimeAgo.addLocale(en);

export const timeAgo = new TimeAgo("en-US");

export function formatDateStandard(momentDate) {
  return momentDate.format("MMM YYYY");
}

export function formatTransactionDate(momentDate) {
  return momentDate.format("MMM Do YY, h:mm a");
}

export function formatDate(momentDate) {
  return momentDate.format("MMM Do");
}

export function formatDateYMD(momentDate) {
  return momentDate.format("MMM Do, YYYY");
}

export function formatPublishedDate(momentDate, removeText) {
  if (removeText) {
    return formatDateStandard(momentDate);
  } else {
    return `Published: ${formatDateStandard(momentDate)}`;
  }
}

export function getInitialScope() {
  return {
    start: moment()
      .startOf("day")
      .unix(),
    end: moment().unix(),
  };
}
