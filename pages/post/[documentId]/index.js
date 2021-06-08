import { Fragment } from "react";
import Router from "next/router";
import Error from "next/error";
import Loader from "~/components/Loader/Loader";
import { formatPaperSlug } from "~/config/utils";
import API from "~/config/api";

// Redux
import helpers from "@quantfive/js-web-config/helpers";

function Paper(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  if (props.error) {
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
  let posts = await fetch(
    API.RESEARCHHUB_POSTS({ documentId: query.documentId })
  ).then(helpers.parseJSON);
  const post = posts[0];
  const title = formatPaperSlug(post.title);

  const redirectPath = `/post/${query.documentId}/${title}`;

  return { redirectPath, post };
};

export default Paper;
