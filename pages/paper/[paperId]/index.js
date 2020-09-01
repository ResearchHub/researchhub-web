import Router from "next/router";
import Error from "next/error";
import { redirect, formatPaperSlug } from "~/config/utils";

// Redux
import { PaperActions } from "~/redux/paper";

function Paper(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  if (props.error || props.paper.status === 404) {
    return <Error statusCode={404} />;
  }
  Router.push(props.redirectPath);
}

Paper.getInitialProps = async (ctx) => {
  let { store, res, query } = ctx;
  await store.dispatch(PaperActions.getPaper(query.paperId));
  let paper = store.getState().paper;
  if (paper.status === 404) {
    res.statusCode = 404;
    return { error: true, paper: store.getState().paper };
  }
  let redirectPath = paper.slug
    ? paper.slug
    : formatPaperSlug(paper.paper_title ? paper.paper_title : paper.title);
  redirect(ctx, "paperId", redirectPath);
  return { redirectPath, paper };
};

export default Paper;
