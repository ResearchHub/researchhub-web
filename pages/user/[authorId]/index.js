import { isServer } from "~/config/server/isServer";
import { redirect } from "~/config/utils/routing";
import Router from "next/router";

function AuthorPageRedirect(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  Router.push(props.redirectPath);
  return null;
}

AuthorPageRedirect.getInitialProps = async (ctx) => {
  let { query, store } = ctx;
  if (!isServer()) {
    let authorProfile = store.getState().auth.user.author_profile;
    return { redirectPath: `${authorProfile.id}/posts` };
  } else {
    let redirectPath = "overview";
    redirect(ctx, "authorId", redirectPath);
    return { redirectPath };
  }
};

export default AuthorPageRedirect;
