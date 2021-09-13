import { AUTH_TOKEN } from "~/config/constants";
import { Fragment } from "react";
import { Helpers } from "@quantfive/js-web-config";
import { pickFiltersForApi, QUERY_PARAM } from "~/config/utils/search";
import { useRouter } from "next/router";
import API from "~/config/api";
import Error from "next/error";
import get from "lodash/get";
import Head from "~/components/Head";
import nookies from "nookies";
import PropTypes from "prop-types";
import SearchResults from "~/components/Search/SearchResults";

// Facets specified will have their values returned
// alongside counts in the search response.
const getFacetsToAggregate = (query = {}) => {
  const facet = [];
  if (query.type === "paper" || query.type === "post") {
    facet.push("hubs");
  }
  return facet;
};

const Index = ({ apiResponse, hasError }) => {
  const router = useRouter();

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
  console.warn("{ filters, facets, config }: ", { filters, facets, config });
  return fetch(
    API.SEARCH({ filters, facets, config }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((apiResponse) => {
      return { apiResponse };
    })
    .catch((_error) => {
      return { hasError: true };
    });
};

Index.propTypes = {
  apiResponse: PropTypes.object,
  hasError: PropTypes.bool,
};

export default Index;
