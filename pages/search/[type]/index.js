import HubPage from "~/components/Hubs/HubPage";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import parseUrl from "parse-url";
import { useRouter } from "next/router";
import { keys, has } from "underscore";
import Link from "next/link";
import Error from "next/error";

const Index = (props) => {
  const router = useRouter();

  const FILTERS = {
    papers: ["hub", "start_date", "end_date", "post_type", "query"],
    hubs: [],
    users: [],
  };

  const getParamsForSearch = ({ entityType, url }) => {
    const parsedUrl = parseUrl(url);
    const params = {};

    for (let i = 0; i < FILTERS[entityType].length; i++) {
      const whiteListedFilter = FILTERS[entityType][i];

      if (has(parsedUrl.query, whiteListedFilter)) {
        params[whiteListedFilter] = parsedUrl.query[whiteListedFilter];
      }
    }

    return params;
  };

  let queryParams = {};
  if (typeof window !== "undefined") {
    queryParams = getParamsForSearch({
      entityType: router.query.type,
      url: window.location.href,
    });
  }

  const config = {
    route: "",
  };

  fetch(API.SEARCH({ queryParams, config }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      console.log(resp);
    });

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

export async function getServerSideProps(context) {
  return { props: {} };
}

export default Index;
