import { Fragment } from "react";
import API from "~/config/api";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import SearchResults from "~/components/Search/SearchResults";
import { searchTypes } from "~/config/utils/options";
import { pickFiltersForApi } from "~/config/utils";
import killswitch from "~/config/killswitch/killswitch";
import Head from "~/components/Head";
import { QUERY_PARAM } from "~/config/utils";

import PropTypes from "prop-types";
import Error from "next/error";
import { useRouter } from "next/router";
import { get } from "lodash";
import nookies from "nookies";

// Facets specified will have their values returned
// alongside counts in the search response.
const getFacetsToAggregate = (query = {}) => {
  let facet = [];
  if (query.type === "paper" || query.type === "post") {
    facet = ["hubs"];
  }

  return facet;
};

const Index = ({ apiResponse, hasError }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  if (hasError || !apiResponse) {
    return <Error statusCode={500} />;
  }

  const buildPageTitle = () => {
    if (get(router, "query.type") === "all") {
      return `${get(router, `query[${QUERY_PARAM}]`)} - Research Hub`;
    } else {
      return `(${apiResponse.count}) ${get(
        router,
        `query[${QUERY_PARAM}]`
      )} - Research Hub`;
    }
  };

  return (
    <Fragment>
      <Head title={buildPageTitle()} description={"Search Researchhub"} />
      <SearchResults apiResponse={apiResponse} />
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

  const facets = getFacetsToAggregate(ctx.query);

  const config = {
    route: ctx.query.type,
  };

  return fetch(
    API.SEARCH({ filters, facets, config }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((apiResponse) => {
      return { apiResponse };
    })
    .catch((error) => {
      return { hasError: true };
    });
};

Index.propTypes = {
  apiResponse: PropTypes.object,
  hasError: PropTypes.bool,
};

export default Index;
