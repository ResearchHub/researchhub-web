import { Fragment } from "react";
import API from "~/config/api";
import Error from "next/error";
import helpers from "@quantfive/js-web-config/helpers";
import killswitch from "~/config/killswitch/killswitch";
import Router from "next/router";

const isServer = () => typeof window === "undefined";

function Hypothesis(props) {
  // TODO: Does this need to be a dynamic route or hard refresh?
  if (props.error) {
    return <Error statusCode={404} />;
  }

  if (!killswitch("hypothesis") && !isServer()) {
    Router.push("/");
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

  const hypothesis = await fetch(
    API.HYPOTHESIS({ hypothesis_id: query.documentId }),
    API.GET_CONFIG()
  ).then(helpers.parseJSON);
  const redirectPath = `/hypothesis/${hypothesis.id}/${hypothesis.slug}`;

  return { hypothesis, redirectPath };
};

export default Hypothesis;
