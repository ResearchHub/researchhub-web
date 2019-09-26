import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);

export const timeAgo = new TimeAgo("en-US");
