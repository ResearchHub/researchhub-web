import { redirect } from "~/config/utils";

function AuthorPageRedirect() {}

AuthorPageRedirect.getInitialProps = async (ctx) => {
  const redirectPath = "contributions";

  redirect(ctx, "authorId", redirectPath);
  return {};
};

export default AuthorPageRedirect;
