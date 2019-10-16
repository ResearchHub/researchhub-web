import { Router } from "next/router";

export function redirect(ctx, baseKey, path) {
  path = buildRedirectPath(ctx, baseKey, path);
  const { res } = ctx;
  if (res) {
    res.writeHead(302, { Location: path });
    res.end();
  } else {
    Router.push(path);
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
