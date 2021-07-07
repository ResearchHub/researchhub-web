import { Fragment } from "react";
import API from "~/config/api";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import SearchResults from "~/components/Search/SearchResults";
import { searchTypes } from "~/config/utils/options";
import { pickFiltersForApi } from "~/config/utils";
import killswitch from "~/config/killswitch/killswitch";
import Head from "~/components/Head";

import PropTypes from "prop-types";
import Error from "next/error";
import { useRouter } from "next/router";
import { get } from "lodash";
import nookies from "nookies";

// Facets specified will have their values returned
// alongside counts in the search response.
const getFacetsToAggregate = (query = {}) => {
  let facet = [];
  if (query.type === "paper") {
    facet = ["hubs"];
  }

  return facet;
};

const Index = ({ serverResponse, hasError }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  if (hasError) {
    return <Error statusCode={500} />;
  }

  return (
    <Fragment>
      <Head
        title={`(${serverResponse.count}) ${get(
          router,
          "query.q"
        )} - Research Hub`}
        description={"Search Researchhub"}
      />
      <SearchResults initialResults={serverResponse} />
    </Fragment>
  );
};

Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const filters = pickFiltersForApi({
    searchType: ctx.query.type,
    query: ctx.query,
  });

  console.log("-----------");
  console.log(filters);
  console.log("-----------");

  const facets = getFacetsToAggregate(ctx.query);

  const config = {
    route: ctx.query.type,
  };

  if (!killswitch("searchResults")) {
    return { hasError: true };
  }

  return fetch(
    API.SEARCH({ filters, facets, config }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((serverResponse) => {
      return { serverResponse };
    })
    .catch((serverError) => {
      return { hasError: true };
    });
};

Index.propTypes = {
  serverResponse: PropTypes.object,
  hasError: PropTypes.bool,
};

export default Index;
