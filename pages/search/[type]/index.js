import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AUTH_TOKEN } from "~/config/constants";

import Link from "next/link";
import Error from "next/error";
import { pick } from "underscore";
import { useRouter } from "next/router";

import { get } from "lodash";
import nookies from "nookies";

const FILTERS = {
  papers: ["hub", "start_date", "end_date", "post_type", "query"],
  hubs: [],
  authors: [],
};

const isAllowedSearchEntityType = (type) => FILTERS.hasOwnProperty(type);

const getAllowedSearchFilters = ({ searchEntityType, queryParams }) => {
  const allowedFilters = get(FILTERS, `${searchEntityType}`, []);
  return pick(queryParams, ...allowedFilters);
};

const Index = (props) => {
  const router = useRouter();
  const searchEntityType = get(router, "query.type");

  if (!isAllowedSearchEntityType(searchEntityType)) {
    return <Error statusCode={404} />;
  }

  return (
    <div>
      <Link href="/search/papers">
        <a>Papers</a>
      </Link>
      <Link href="/search/authors">
        <a>Authors</a>
      </Link>
      <Link href="/search/hubs">
        <a>Hubs</a>
      </Link>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const filters = getAllowedSearchFilters({
    searchEntityType: ctx.query.type,
    queryParams: ctx.query,
  });

  const config = {
    route: "",
  };

  return fetch(API.SEARCH({ filters, config }), API.GET_CONFIG(authToken))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      console.log(resp);
      return { props: {} };
    });
};

export default Index;
