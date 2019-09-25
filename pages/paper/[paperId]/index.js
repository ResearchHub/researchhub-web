import { redirect } from "~/config/utils";

function Paper() {}

Paper.getInitialProps = async (ctx) => {
  const redirectPath = "summary";

  redirect(ctx, "paperId", redirectPath);
  return {};
};

export default Paper;
