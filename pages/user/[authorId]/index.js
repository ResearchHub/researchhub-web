import Router from "next/router";
import { redirect } from "~/config/utils";

const redirectPath = "contributions";

function AuthorPageRedirect() {
  // TODO: Does this need to be a dynamic route or hard refresh?
  Router.push(redirectPath);
}

AuthorPageRedirect.getInitialProps = async (ctx) => {
  let { query } = ctx;

  redirect(ctx, "authorId", redirectPath);
  return {};
};

export default AuthorPageRedirect;
