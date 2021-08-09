import { Fragment } from "react";
import Router from "next/router";
import Error from "next/error";
import Loader from "~/components/Loader/Loader";
import API from "~/config/api";

// Redux
import helpers from "@quantfive/js-web-config/helpers";

function Hypothesis(props) {
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

Hypothesis.getInitialProps = async (ctx) => {
  const { store, res, query } = ctx;
  let hypothesis = await fetch(
    API.HYPOTHESIS({ hypothesis_id: query.documentId }),
    API.GET_CONFIG()
  ).then(helpers.parseJSON);
  const slug = hypothesis.slug;
  const redirectPath = `/hypothesis/${hypothesis.id}/${slug}`;

  return { redirectPath, hypothesis };
};

export default Hypothesis;
