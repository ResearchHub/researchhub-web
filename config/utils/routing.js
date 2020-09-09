import moment from "moment";

export function redirect(ctx, baseKey, path) {
  path = buildRedirectPath(ctx, baseKey, path);
  const { res } = ctx;
  if (res) {
    res.writeHead(301, { Location: path });
    res.end();
  }
}

export function buildRedirectPath({ asPath, query }, baseKey, path) {
  if (!endsWithSlash(asPath)) {
    const base = query[baseKey];
    path = base + "/" + path;
  }
  return path;
}

export function endsWithSlash(text) {
  if (!text) {
    return false;
  }
  if (typeof text !== "string") {
    throw TypeError("Requires argument of type string");
  }
  const lastChar = text.charAt(text.length - 1);
  return lastChar === "/";
}

export function absoluteUrl(req, setLocalhost) {
  /**
   * https://github.com/jekrb/next-absolute-url/blob/master/index.js
   * MIT Licensed
   */
  var protocol = "https:";
  var host = req
    ? req.headers["x-forwarded-host"] || req.headers["host"]
    : window.location.host;
  if (host.indexOf("localhost") > -1) {
    if (setLocalhost) host = setLocalhost;
    protocol = "http:";
  }

  return {
    protocol: protocol,
    host: host,
    origin: protocol + "//" + host,
  };
}

export function openExternalLink(url) {
  const tab = window.open(url);
  tab.focus();
}

export function slugToFilterQuery(slug) {
  switch (slug) {
    case "trending":
      return "hot";
    case "top-rated":
      return "top_rated";
    case "most-discussed":
      return "most_discussed";
    default:
      return slug;
  }
}

export function calculateScopeFromSlug(scopeId) {
  let scope = {
    start: 0,
    end: 0,
  };

  let now = moment();
  let today = moment().startOf("day");
  let week = moment()
    .startOf("day")
    .subtract(7, "days");
  let month = moment()
    .startOf("day")
    .subtract(30, "days");
  let year = moment()
    .startOf("day")
    .subtract(365, "days");

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
