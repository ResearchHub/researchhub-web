import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AUTH_TOKEN } from "~/config/constants";

import Link from "next/link";
import Error from "next/error";
import { pick, keys } from "underscore";
import { useRouter } from "next/router";

import { get } from "lodash";
import nookies from "nookies";

const SEARCH_TYPES = {
  paper: ["hub", "start_date", "end_date", "post_type", "query"],
  hub: [],
  author: [],
};

const isAllowedSearchEntityType = (type) => SEARCH_TYPES.hasOwnProperty(type);

const getAllowedSearchFilters = ({ searchType, queryParams }) => {
  const allowedFilters = get(SEARCH_TYPES, `${searchType}`, []);
  return pick(queryParams, ...allowedFilters);
};

const Index = ({ resp }) => {
  console.log(resp);

  // console.log(JSON.stringify(resp, null, 2));

  const router = useRouter();
  const searchType = get(router, "query.type");

  if (!isAllowedSearchEntityType(searchType)) {
    return <Error statusCode={404} />;
  }

  const htmlLinks = keys(SEARCH_TYPES).map((type) => (
    <Link href={`/search/${type}`} key={type}>
      <a>
        {type + "s"} [{get(resp, `${type}_count`, "")}]
      </a>
    </Link>
  ));

  return <div>{htmlLinks}</div>;
};

Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const filters = getAllowedSearchFilters({
    searchType: ctx.query.type,
    queryParams: ctx.query,
  });

  const config = {
    route: "all",
  };

  return fetch(API.SEARCH({ filters, config }), API.GET_CONFIG(authToken))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      //       const initial = keys(SEARCH_TYPES).reduce((map, k) => { map[k] = []; return map } , {})
      //
      //       const hitsByIdxMap = resp.results.reduce((map, hit) => {
      //         const idx = get(hit,"meta.index", "undefined");
      //         if (!map[idx]) {
      //           map[idx] = []
      //         }
      //
      //         map[idx].push(hit);
      //         return map
      //       }, initial);

      return { resp };
    });
};

export default Index;
