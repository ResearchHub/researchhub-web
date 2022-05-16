export function formatURL(url) {
  let http = "http://";
  let https = "https://";
  if (!url) {
    return;
  }
  if (url.startsWith(http)) {
    return url;
  }

  if (!url.startsWith(https)) {
    url = https + url;
  }
  return url;
}

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

export function convertHttpToHttps(url = "") {
  return url ? url.replace(/^http:\/\//i, "https://") : "";
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

export function getUrlToUniDoc(uniDoc) {
  let doc;
  if (uniDoc.document) {
    doc = uniDoc.document;
  } else if (Array.isArray(uniDoc.documents)) {
    doc = uniDoc.documents[0];
  } else {
    doc = uniDoc.documents;
  }

  const docType = uniDoc.document_type ?? uniDoc.documentType;
  let url = "";

  switch (docType) {
    case "paper":
    case "PAPER":
      url = `/paper/${doc.id}/${doc.slug}`;
      break;
    case "hypothesis":
    case "HYPOTHESIS":
      url = `/hypothesis/${doc.id}/${doc.slug}`;
      break;
    case "discussion":
    case "post":
    case "researchhubpost":
    case "DISCUSSION":
      url = `/post/${doc.id}/${doc.slug}`;
      break;
  }

  return url;
}
