import { Router, useRouter } from "next/router";
import { endsWithSlash } from "~/config/utils";

function Paper() {}

Paper.getInitialProps = async ({ query, res }) => {
  const redirectPath = "summary";
  const baseUrl = query.paperId;

  redirect(redirectPath, baseUrl, res);
  return {};
};

function redirect(path, base, res, query) {
  if (res) {
    if (endsWithSlash(query)) {
      redirectUrl = path;
    } else {
      redirectUrl = base + "/" + path;
    }

    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } else {
    Router.push(path);
  }
}

export default Paper;
