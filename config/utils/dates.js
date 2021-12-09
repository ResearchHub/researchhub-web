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

export function formatUploadedDate(momentDate, removeText) {
  if (removeText) {
    return formatDateStandard(momentDate);
  } else {
    return `Date Added: ${formatDateStandard(momentDate)}`;
  }
}

export function getInitialScope() {
  return {
    start: moment().startOf("day").unix(),
    end: moment().unix(),
  };
}

export function timeAgoStamp(date) {
  let formatDate = new Date(date);
  if (!isNaN(formatDate)) {
    return timeAgo.format(formatDate);
  }
}

export function calculateScopeFromSlug(scopeId) {
  let scope = {
    start: 0,
    end: 0,
  };

  let now = moment();
  let today = moment().startOf("day");
  let week = moment().startOf("day").subtract(7, "days");
  let month = moment().startOf("day").subtract(30, "days");
  let year = moment().startOf("day").subtract(365, "days");

  scope.end = now.unix();

  if (scopeId === "day") {
    scope.start = today.unix();
  } else if (scopeId === "week") {
    scope.start = week.unix();
  } else if (scopeId === "month") {
    scope.start = month.unix();
  } else if (scopeId === "year") {
    scope.start = year.unix();
  } else if (scopeId === "all-time") {
    let start = "2019-01-01";
    let diff = now.diff(start, "days") + 1;

    let alltime = now.startOf("day").subtract(diff, "days");
    scope.start = alltime.unix();
  }

  return scope;
}
