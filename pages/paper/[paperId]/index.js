import { Router, useRouter } from "next/router";
import { endsWithSlash } from "~/config/utils";

function Paper() {}

Paper.getInitialProps = async (ctx) => {
  const redirectPath = "summary";

  redirect(ctx, "paperId", redirectPath);
  return {};
};

function redirect(ctx, baseKey, path) {
  path = buildRedirectPath(ctx, baseKey, path);
  const { res } = ctx;
  if (res) {
    res.writeHead(302, { Location: path });
    res.end();
  } else {
    Router.push(path);
  }
}

function buildRedirectPath({ asPath, query }, baseKey, path) {
  if (!endsWithSlash(asPath)) {
    const base = query[baseKey];
    path = base + "/" + path;
  }
  return path;
}

export default Paper;
