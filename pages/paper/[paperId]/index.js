import { Fragment } from "react";
import Router from "next/router";
import Error from "next/error";
import Loader from "~/components/Loader/Loader";
import { formatPaperSlug } from "~/config/utils";

// Redux
import { PaperActions } from "~/redux/paper";

function Paper(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  if (props.error || props.paper.status === 404) {
    return <Error statusCode={404} />;
  }

  if (props.redirectPath && typeof window !== "undefined") {
    Router.push(props.redirectPath);
  }

  return (
    <Error title={<Fragment>Redirecting to page</Fragment>} statusCode={301} />
  );
}

Paper.getInitialProps = async (ctx) => {
  const { store, res, query } = ctx;
  await store.dispatch(PaperActions.getPaper(query.paperId));
  const paper = store.getState().paper;
  if (paper.status === 404) {
    res.statusCode = 404;
    return { error: true, paper: store.getState().paper };
  }
  const paperName = paper.slug
    ? paper.slug
    : formatPaperSlug(paper.paper_title ? paper.paper_title : paper.title);

  const redirectPath = `/paper/${paper.id}/${paperName}`;

  return { redirectPath, paper };
};

export default Paper;
