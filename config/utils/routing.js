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
  const lastChar = text.charAt(text.length - 1);
  return lastChar === "/";
}
