import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import * as moment from "dayjs";

TimeAgo.addLocale(en);

const THIRTEEN_HOURS_IN_MINUTES = 60 * 13;
const MINUTES_IN_A_DAY = 1440;

export const timeAgo = new TimeAgo("en-US");

export function formatDateStandard(inputDate, overrideFormat) {
  if (!inputDate) {
    return null;
  }

  let date = inputDate;
  if (typeof inputDate === "string") {
    date = moment(inputDate);
  }
  if (overrideFormat) {
    return date.format(overrideFormat);
  }

  return date.format("MMM D, YYYY h:mma");
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

export function timeSince(date) {
  const inputDate = moment(date);
  const now = moment();

  const MINUTES_IN_A_DAY = 1440;

  const deltaInMins = now.diff(inputDate, "minutes");
  let timeSince = "";

  if (deltaInMins <= 1) {
    timeSince = "just now";
  } else if (deltaInMins < 60) {
    timeSince = Math.floor(deltaInMins);
    timeSince += timeSince == 1 ? " minute ago" : " minutes ago";
  } else if (deltaInMins < MINUTES_IN_A_DAY) {
    timeSince = Math.floor(deltaInMins / 60);
    timeSince += timeSince === 1 ? " hour ago" : " hours ago";
  } else if (deltaInMins < MINUTES_IN_A_DAY * 30) {
    timeSince = Math.floor(deltaInMins / 60 / 24);
    timeSince += timeSince === 1 ? " day ago" : " days ago";
  } else if (deltaInMins < MINUTES_IN_A_DAY * 365) {
    timeSince = Math.floor(deltaInMins / 30 / 60 / 24);
    timeSince += timeSince === 1 ? " month ago" : " months ago";
  } else {
    timeSince = Math.floor(deltaInMins / 30 / 60 / 24 / 12);
    timeSince += timeSince === 1 ? " year ago" : " years ago";
  }

  return timeSince;
}

export function timeTo(date) {
  const inputDate = moment(date);
  const now = moment();

  const deltaInMins = inputDate.diff(now, "minutes");
  let timeSince = "";

  if (deltaInMins <= 1) {
    timeSince = "one minute";
  } else if (deltaInMins < 60) {
    timeSince = Math.floor(deltaInMins);
    timeSince += timeSince == 1 ? " minute" : " minutes";
  } else if (deltaInMins < MINUTES_IN_A_DAY) {
    timeSince = Math.floor(deltaInMins / 60);
    timeSince += timeSince === 1 ? " hour" : " hours";
  } else {
    const days = Math.floor(deltaInMins / 60 / 24);
    const minutes = Math.ceil(deltaInMins % (60 / 24));
    timeSince = days + (days === 1 ? " day" : " days");
  }

  return timeSince;
}

export function timeToInUnits({ date, unit }) {
  let timeTo = 0;
  const inputDate = moment(date);
  const now = moment();
  timeTo = inputDate.diff(now, unit);
  return timeTo;
}

export function timeToRoundUp(date) {
  const now = moment();
  const inputDate = moment(date);
  const deltaInMins = inputDate.diff(now, "minutes");

  if (deltaInMins <= 1) {
    return "one minute";
  } else if (deltaInMins < 60) {
    const flooredMinutes = Math.floor(deltaInMins);
    return flooredMinutes + ` minute${flooredMinutes > 1 ? "s" : ""}`;
  } else if (deltaInMins < MINUTES_IN_A_DAY) {
    const flooredHours = Math.floor(deltaInMins / 60);
    return flooredHours + ` hour${flooredHours > 1 ? "s" : ""}`;
  } else {
    const flooredDays = Math.floor(deltaInMins / 60 / 24);
    const remainingMinutes = deltaInMins - flooredDays * 24 * 60;
    const finalDays =
      flooredDays +
      // if the remaining hours is more than 13 hrs. we round up day integer
      (remainingMinutes / THIRTEEN_HOURS_IN_MINUTES >= 1 ? 1 : 0);
    return `${finalDays} day${finalDays > 1 ? "s" : ""}`;
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

export function isNewerThanFiveYearsAgo(date) {
  const now = moment();
  const fiveYearsAgo = now.subtract(5, "year");
  const dateObj = moment(date);

  return dateObj.isAfter(fiveYearsAgo) || dateObj.isSame(fiveYearsAgo);
}

export function specificTimeSince(date) {
  const now = moment();
  const joined = moment(date);

  const years = now.diff(joined, "year");
  const afterYears = joined.clone().add(years, "years");

  const months = now.diff(afterYears, "month");
  const afterMonths = afterYears.clone().add(months, "months");

  const days = now.diff(afterMonths, "day");

  let result = [];

  if (years > 0) {
    result.push(`${years} year${years > 1 ? "s" : ""}`);
  }

  if (months > 0) {
    result.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  if (days > 0) {
    result.push(`${days} day${days > 1 ? "s" : ""}`);
  }

  if (result.length === 0) {
    return "just joined";
  } else if (result.length === 1) {
    return result[0];
  } else if (result.length === 2) {
    return `${result[0]} and ${result[1]}`;
  } else {
    return `${result[0]}, ${result[1]} and ${result[2]}`;
  }
}
