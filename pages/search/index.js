import HubPage from "~/components/Hubs/HubPage";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import parseUrl from "parse-url";
import { keys, has } from "underscore";

const Index = (props) => {
  const FILTERS = {
    papers: ["hub", "start_date", "end_date", "post_type"],
    hubs: [],
    users: [],
  };

  const getParamsForSearch = ({ entity, url }) => {
    const parsedUrl = parseUrl(url);
    const params = {};

    for (let i = 0; i < FILTERS[entity].length; i++) {
      const whiteListedFilter = FILTERS[entity][i];

      if (has(parsedUrl.query, whiteListedFilter)) {
        params[whiteListedFilter] = parsedUrl.query[whiteListedFilter];
      }
    }

    return params;
  };

  let queryParams = {};
  if (typeof window !== "undefined") {
    const queryParams = getParamsForSearch({
      entity: "papers",
      url: window.location.href,
    });
  }

  const config = {
    route: "all",
  };

  fetch(API.SEARCH({ queryParams, config }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      console.log(resp);
    });

  return null;
};

export async function getServerSideProps(context) {
  return { props: {} };
}

export default Index;
