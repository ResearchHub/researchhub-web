import Router from "next/router";
import { redirect } from "~/config/utils";
import { formatPaperSlug } from "~/config/utils";

// Redux
import { PaperActions } from "~/redux/paper";

function Paper(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  Router.push(props.redirectPath);
}

Paper.getInitialProps = async (ctx) => {
  let { store, query } = ctx;
  let redirectPath = "summary"; // default slug

  await store.dispatch(PaperActions.getPaper(query.paperId));
  let paper = store.getState().paper;
  if (paper && (paper.title || paper.paper_title)) {
    redirectPath = formatPaperSlug(
      paper.paper_title ? paper.paper_title : paper.title
    );
  }

  redirect(ctx, "paperId", redirectPath);
  return { redirectPath };
};

export default Paper;
