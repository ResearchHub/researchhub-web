import API from "~/config/api";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import SearchResults from "~/components/Search/SearchResults";
import { searchTypes } from "~/config/utils/options";

import PropTypes from "prop-types";
import Error from "next/error";
import { pick } from "underscore";
import { useRouter } from "next/router";
import { get } from "lodash";
import nookies from "nookies";

const isAllowedSearchEntityType = (type) => searchTypes.hasOwnProperty(type);

const getAllowedSearchFilters = ({ searchType, queryParams }) => {
  const allowedFilters = get(searchTypes, `${searchType}`, []);
  return pick(queryParams, ...allowedFilters);
};

// Facets specified will have their values returned
// alongside counts in the search response.
const getFacetsToAggregate = (query = {}) => {
  let facet = [];
  if (query.type.indexOf("paper") >= 0) {
    facet = ["hubs"];
  }

  return facet;
};

const Index = ({ searchResultsResponse }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  if (!isAllowedSearchEntityType(currentSearchType)) {
    return <Error statusCode={404} />;
  }

  return <SearchResults initialResults={searchResultsResponse} />;
};

Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const filters = getAllowedSearchFilters({
    searchType: ctx.query.type,
    queryParams: ctx.query,
  });

  const facet = getFacetsToAggregate(ctx.query);

  const config = {
    route: ctx.query.type,
  };

  return fetch(
    API.SEARCH({ filters, facet, config }),
    API.GET_CONFIG(authToken)
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((searchResultsResponse) => {
      return { searchResultsResponse };
    });
};

Index.propTypes = {
  searchResultsResponse: PropTypes.object,
};

export default Index;
