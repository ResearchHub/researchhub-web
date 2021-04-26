import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import * as moment from "dayjs";

TimeAgo.addLocale(en);

export const timeAgo = new TimeAgo("en-US");

export function formatDateStandard(momentDate) {
  return momentDate.format("MMM D, YYYY");
}

export function formatTransactionDate(momentDate) {
  return momentDate.format("MMM D, YY, h:mm a");
}

export function formatDate(momentDate) {
  return momentDate.format("MMM D");
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

export function timeAgoStamp(date) {
  date = new Date(date);
  return timeAgo.format(date);
}
