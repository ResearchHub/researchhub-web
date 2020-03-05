import Router from "next/router";
import { redirect } from "~/config/utils";

const redirectPath = "summary";

function Paper() {
  // TODO: Does this need to be a dynamic route or hard refresh?
  Router.push(redirectPath);
}

Paper.getInitialProps = async (ctx) => {
  redirect(ctx, "paperId", redirectPath);
  return {};
};

export default Paper;
