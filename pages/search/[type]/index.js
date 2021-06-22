import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { AUTH_TOKEN } from "~/config/constants";
import FormSelect from "~/components/Form/FormSelect";
import colors from "~/config/themes/colors";
import Loader from "~/components/Loader/Loader";
import { fetchURL } from "~/config/fetch";

import Ripples from "react-ripples";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Error from "next/error";
import { pick, keys, isString, isArray } from "underscore";
import { useRouter } from "next/router";
import * as moment from "dayjs";

import { get, upperFirst } from "lodash";
import nookies from "nookies";
import parseUrl from "parse-url";

const SEARCH_TYPES = {
  paper: ["search", "hubs", "publish_date__gte", "post_type", "ordering"],
  hub: ["ordering"],
  author: ["ordering"],
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

const SORT_OPTS = [
  {
    value: null,
    label: "Relevance",
  },
  {
    value: "-hot",
    label: "Trending",
  },
  {
    value: "-popularity",
    label: "Top Rated",
  },
  {
    value: "-publish_date",
    label: "Newest",
  },
  {
    value: "-discussion_count",
    label: "Most Discussed",
  },
];

const isAllowedSearchEntityType = (type) => SEARCH_TYPES.hasOwnProperty(type);

const getAllowedSearchFilters = ({ searchType, queryParams }) => {
  const allowedFilters = get(SEARCH_TYPES, `${searchType}`, []);
  return pick(queryParams, ...allowedFilters);
};

const Index = ({ currentSearchResponse }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(
    get(currentSearchResponse, "next")
  );
  const [results, setResults] = useState(
    get(currentSearchResponse, "results", [])
  );

  const loadMoreResults = () => {
    fetchURL(nextResultsUrl).then((res) => {
      setResults([...results, ...res.results]);
    });
  };

  const getSelectedDropdownValue = ({ forKey }) => {
    const urlParam = get(router, `query.${forKey}`, null);

    if (forKey === "publish_date__gte") {
      return TIME_FILTER_OPTS.find((opt) => opt.value === urlParam);
    } else if (forKey === "ordering") {
      return SORT_OPTS.find((opt) => opt.value === urlParam);
    }

    return null;
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

  const renderEntityTabs = () => {
    return keys(SEARCH_TYPES).map((type) => (
      <Link href={`/search/${type}`} key={type}>
        {type === currentSearchType ? (
          <a>
            {type + "s"} [{get(currentSearchResponse, "count", "")}]
          </a>
        ) : (
          <a>{type + "s"}</a>
        )}
      </Link>
    ));
  };

  const renderLoadMoreButton = () => {
    if (nextResultsUrl !== null) {
      return (
        <div className={css(styles.buttonContainer)}>
          {!isLoadingMore ? (
            <Ripples
              className={css(styles.loadMoreButton)}
              onClick={loadMoreResults}
            >
              Load More Papers
            </Ripples>
          ) : (
            <Loader
              key={"paperLoader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          )}
        </div>
      );
    }
  };

  const availFacetOpts = get(
    currentSearchResponse,
    "facets._filter_hubs.hubs.buckets",
    []
  ).map((b) => ({
    label: `${b.key} (${b.doc_count})`,
    value: b.key,
  }));

  let selectedHubs = [];
  if (isArray(router.query.hubs)) {
    selectedHubs = router.query.hubs;
  } else if (isString(router.query.hubs)) {
    selectedHubs = [router.query.hubs];
  }
  const selectedValues = selectedHubs.map((v) => ({ label: v, value: v }));

  if (!isAllowedSearchEntityType(currentSearchType)) {
    return <Error statusCode={404} />;
  }

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
        id={"publish_date__gte"}
        options={TIME_FILTER_OPTS}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Date Published"}
        value={getSelectedDropdownValue({ forKey: "publish_date__gte" })}
        isMulti={false}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
      />
      <FormSelect
        id={"ordering"}
        options={SORT_OPTS}
        value={getSelectedDropdownValue({ forKey: "ordering" })}
        containerStyle={null}
        inputStyle={{
          fontWeight: 500,
          minHeight: "unset",
          backgroundColor: "#FFF",
          display: "flex",
          justifyContent: "space-between",
        }}
        onChange={handleFilterSelect}
        isSearchable={false}
      />
      {renderEntityTabs()}
      {renderLoadMoreButton()}
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
    .then((currentSearchResponse) => {
      return { currentSearchResponse };
    });
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
});

export default Index;
