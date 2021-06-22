import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AUTH_TOKEN } from "~/config/constants";
import FormSelect from "~/components/Form/FormSelect";
import { filterOptions } from "~/config/utils/options";

import Link from "next/link";
import Error from "next/error";
import { pick, keys, isString, isArray } from "underscore";
import { useRouter } from "next/router";
import * as moment from "dayjs";

import { get, upperFirst } from "lodash";
import nookies from "nookies";
import parseUrl from "parse-url";

const SEARCH_TYPES = {
  paper: ["search", "hubs", "publish_date__gte", "post_type"],
  hub: [],
  author: [],
};

const TIME_FILTER_OPTS = [
  {
    value: moment()
      .startOf("day")
      .format("YYYY-MM-DD"),
    label: "Today",
  },
  {
    value: moment()
      .startOf("week")
      .format("YYYY-MM-DD"),
    label: "This Week",
  },
  {
    value: moment()
      .startOf("month")
      .format("YYYY-MM-DD"),
    label: "This Month",
  },
  {
    value: moment()
      .startOf("year")
      .format("YYYY-MM-DD"),
    label: "This Year",
  },
  {
    value: null,
    label: "All Time",
  },
];

const sortOpts = [
  {
    value: null,
    label: "Relevance",
  },
  ...filterOptions,
];

const isAllowedSearchEntityType = (type) => SEARCH_TYPES.hasOwnProperty(type);

const getAllowedSearchFilters = ({ searchType, queryParams }) => {
  const allowedFilters = get(SEARCH_TYPES, `${searchType}`, []);
  return pick(queryParams, ...allowedFilters);
};

const Index = ({ resp }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  if (!isAllowedSearchEntityType(currentSearchType)) {
    return <Error statusCode={404} />;
  }

  const htmlLinks = keys(SEARCH_TYPES).map((type) => (
    <Link href={`/search/${type}`} key={type}>
      {type === currentSearchType ? (
        <a>
          {type + "s"} [{get(resp, "count", "")}]
        </a>
      ) : (
        <a>{type + "s"}</a>
      )}
    </Link>
  ));

  const getSelectedTimeOpt = () => {
    const urlParam = get(router, "query.publish_date__gte", null);
    return TIME_FILTER_OPTS.find((opt) => opt.value === urlParam);
  };

  const handleFilterSelect = (filterId, selected) => {
    let query = {
      ...router.query,
    };

    if (isArray(selected)) {
      query[filterId] = selected.map((v) => v.value);
    } else if (!selected || !selected.value) {
      delete query[filterId];
    } else {
      query[filterId] = selected.value;
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const handleSortSelect = (sortId, selectedOpt) => {
    let query = {
      ...router.query,
    };

    delete query["sort_by"];

    if (selectedOpt.value !== "relevance") {
      query["sort_by"] = selectedOpt.value;
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const availFacetOpts = get(resp, "facets._filter_hubs.hubs.buckets", []).map(
    (b) => ({
      label: `${b.key} (${b.doc_count})`,
      value: b.key,
    })
  );

  let selectedHubs = [];
  if (isArray(router.query.hubs)) {
    selectedHubs = router.query.hubs;
  } else if (isString(router.query.hubs)) {
    selectedHubs = [router.query.hubs];
  }
  const selectedValues = selectedHubs.map((v) => ({ label: v, value: v }));

  return (
    <div>
      <FormSelect
        id={"hubs"}
        options={availFacetOpts}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Hubs"}
        value={selectedValues}
        isMulti={true}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
      />

      <FormSelect
        id={"sortBy"}
        options={sortOpts}
        value={null}
        containerStyle={null}
        inputStyle={{
          fontWeight: 500,
          minHeight: "unset",
          backgroundColor: "#FFF",
          display: "flex",
          justifyContent: "space-between",
        }}
        onChange={handleSortSelect}
        isSearchable={false}
      />
      <FormSelect
        id={"publish_date__gte"}
        options={TIME_FILTER_OPTS}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Date Published"}
        value={getSelectedTimeOpt()}
        isMulti={false}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
      />

      {htmlLinks}
    </div>
  );
};

Index.getInitialProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  const filters = getAllowedSearchFilters({
    searchType: ctx.query.type,
    queryParams: ctx.query,
  });

  let facet = [];
  if (ctx.query.type.indexOf("paper") >= 0) {
    facet = ["hubs"];
  }

  const config = {
    route: ctx.query.type,
  };

  return fetch(
    API.SEARCH({ filters, facet, config }),
    API.GET_CONFIG(authToken)
  )
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
