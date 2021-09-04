import Router from "next/router";
import { redirect } from "~/config/utils/routing";

const isServer = () => typeof window === "undefined";

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
    let redirectPath = "contributions";
    redirect(ctx, "authorId", redirectPath);
    return { redirectPath };
  }
};

export default AuthorPageRedirect;
