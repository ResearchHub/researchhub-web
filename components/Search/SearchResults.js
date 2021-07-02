import * as moment from "dayjs";
import Ripples from "react-ripples";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { keys, isString, isArray } from "underscore";
import { get } from "lodash";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Select, { components } from "react-select";

import { searchTypes } from "~/config/utils/options";
import colors from "~/config/themes/colors";
import { fetchURL } from "~/config/fetch";
import FormSelect from "~/components/Form/FormSelect";
import Badge from "~/components/Badge";
import Loader from "~/components/Loader/Loader";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import { CloseIcon } from "~/config/themes/icons";
import ComponentWrapper from "~/components/ComponentWrapper";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import { breakpoints } from "~/config/themes/screen";

const timeFilterOpts = [
  {
    valueForApi: moment()
      .startOf("day")
      .format("YYYY-MM-DD"),
    value: "today",
    label: "Today",
  },
  {
    valueForApi: moment()
      .startOf("week")
      .format("YYYY-MM-DD"),
    value: "this-week",
    label: "This Week",
  },
  {
    valueForApi: moment()
      .startOf("month")
      .format("YYYY-MM-DD"),
    value: "this-month",
    label: "This Month",
  },
  {
    valueForApi: moment()
      .startOf("year")
      .format("YYYY-MM-DD"),
    value: "this-year",
    label: "This Year",
  },
  {
    valueForApi: null,
    value: null,
    label: "All Time",
  },
];

const sortOpts = [
  {
    valueForApi: null,
    value: null,
    label: "Relevance",
  },
  {
    valueForApi: "-hot_score",
    value: "-hot_score",
    label: "Trending",
  },
  {
    valueForApi: "-score",
    value: "-score",
    label: "Top Rated",
  },
  {
    valueForApi: "-publish_date",
    value: "-publish_date",
    label: "Newest",
  },
  {
    valueForApi: "-discussion_count",
    value: "-discussion_count",
    label: "Most Discussed",
  },
];

const SearchResults = ({ initialResults }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(0);
  const [results, setResults] = useState([]);
  const [facetValuesForHub, setFacetValuesForHub] = useState([]);
  const [pageWidth, setPageWidth] = useState(
    process.browser ? window.innerWidth : 0
  );

  const [selectedHubs, setSelectedHubs] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState({});
  const [selectedSortOrder, setSelectedSortOrder] = useState({});

  useEffect(() => {
    setSelectedHubs(getSelectedFacetValues({ forKey: "hubs" }));
    setSelectedTimeRange(
      getSelectedDropdownValue({ forKey: "publish_date__gte" })
    );
    setSelectedSortOrder(getSelectedDropdownValue({ forKey: "ordering" }));
  }, [router.query]);

  useEffect(() => {
    setResults(get(initialResults, "results", []));
    setNextResultsUrl(get(initialResults, "next", null));
    setNumOfHits(get(initialResults, "count", 0));
    setFacetValuesForHub(
      get(initialResults, "facets._filter_hubs.hubs.buckets", [])
    );
  }, [initialResults]);

  useEffect(() => {
    const _setPageWidth = () => setPageWidth(window.innerWidth);

    window.addEventListener("resize", _setPageWidth, true);

    return () => {
      window.removeEventListener("resize", _setPageWidth, true);
    };
  }, []);

  const loadMoreResults = () => {
    setIsLoadingMore(true);

    fetchURL(nextResultsUrl)
      .then((res) => {
        setResults([...results, ...res.results]);
        setNextResultsUrl(res.next);
        setNumOfHits(res.count);
        setFacetValuesForHub(get(res, "facets._filter_hubs.hubs.buckets", []));
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  };

  const getSelectedDropdownValue = ({ forKey }) => {
    const urlParam = get(router, `query.${forKey}`, null);

    if (forKey === "publish_date__gte") {
      return timeFilterOpts.find((opt) => opt.valueForApi === urlParam);
    } else if (forKey === "ordering") {
      return sortOpts.find((opt) => opt.value === urlParam);
    }

    return null;
  };

  const parseIfHighlighted = ({ searchResult, attribute }) => {
    const highlight = get(searchResult, `highlight.${attribute}`, [])[0];

    if (!highlight) {
      return searchResult[attribute];
    }

    const parts = highlight.split(/(<mark>[^<]+<\/mark>)/);
    const parsedString = parts.map((part) => {
      if (part.includes("<mark>")) {
        let replaced = part.replace("<mark>", "");
        replaced = replaced.replace("</mark>", "");
        return <span className={css(styles.highlight)}>{replaced}</span>;
      }
      return <span>{part}</span>;
    });

    return parsedString;
  };

  const getSelectedFacetValues = ({ forKey }) => {
    let selected = [];
    if (isArray(router.query[forKey])) {
      selected = router.query[forKey];
    } else if (isString(router.query[forKey])) {
      selected = [router.query[forKey]];
    }

    return selected.map((v) => ({ label: v, value: v, valueForApi: v }));
  };

  const handleFilterSelect = (filterId, selected) => {
    let query = {
      ...router.query,
    };

    if (isArray(selected)) {
      query[filterId] = selected.map((v) => v.valueForApi);
    } else if (!selected || !selected.valueForApi) {
      delete query[filterId];
    } else {
      query[filterId] = selected.valueForApi;
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const handleRemoveSelected = ({ opt, dropdownKey }) => {
    let updatedQuery = { ...router.query };

    if (dropdownKey === "hubs") {
      const newValue = selectedHubs
        .filter((h) => h.value !== opt.value)
        .map((h) => h.value);

      updatedQuery[dropdownKey] = newValue;
    } else if (dropdownKey === "publish_date__gte") {
      delete updatedQuery[dropdownKey];
    }

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

  const handleClearAll = () => {
    const updatedQuery = {
      ...router.query,
    };

    delete updatedQuery["publish_date__gte"];
    delete updatedQuery["hubs"];
    delete updatedQuery["ordering"];

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

  const renderEntityTabs = () => {
    return keys(searchTypes).map((type) => (
      <Link href={`/search/${type}`} key={type}>
        {type === currentSearchType ? (
          <a>
            {type + "s"} [{numOfHits}]
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
        <div className={css(styles.loadMore)}>
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

  const renderAppliedFilterBadge = ({ opt, dropdownKey }) => {
    return (
      <Badge
        key={`${dropdownKey}-${opt.value}`}
        label={opt.label}
        onClick={() => handleRemoveSelected({ opt, dropdownKey })}
      />
    );
  };

  const facetValueOpts = facetValuesForHub.map((f) => ({
    label: `${f.key} (${f.doc_count})`,
    value: f.key,
    valueForApi: f.key,
  }));

  const entityTabsHtml = renderEntityTabs();
  const loadMoreBtn = renderLoadMoreButton();
  const hasAppliedFilters = selectedHubs.length || selectedTimeRange.value;

  return (
    <ComponentWrapper overrideStyle={styles.componentWrapper}>
      {/* OFF for v1 entityTabsHtml */}
      {(numOfHits > 0 || hasAppliedFilters) && (
        <Fragment>
          <div className={css(styles.resultCount)}>
            {numOfHits} results found.
          </div>
          <div className={css(styles.filters)}>
            <FormSelect
              id={"hubs"}
              options={facetValueOpts}
              containerStyle={styles.dropdownContainer}
              inputStyle={styles.dropdownInput}
              onChange={handleFilterSelect}
              isSearchable={true}
              placeholder={"Hubs"}
              value={selectedHubs}
              isMulti={true}
              multiTagStyle={null}
              multiTagLabelStyle={null}
              isClearable={false}
              showCountInsteadOfLabels={true}
            />
            <FormSelect
              id={"publish_date__gte"}
              options={timeFilterOpts}
              containerStyle={styles.dropdownContainer}
              inputStyle={styles.dropdownInput}
              onChange={handleFilterSelect}
              isSearchable={true}
              placeholder={"Date Published"}
              value={selectedTimeRange}
              isMulti={false}
              multiTagStyle={null}
              multiTagLabelStyle={null}
              isClearable={false}
              showLabelAlongSelection={
                pageWidth <= breakpoints.small.int ? true : false
              }
            />
            <FormSelect
              id={"ordering"}
              placeholder={"Sort"}
              options={sortOpts}
              value={selectedSortOrder}
              containerStyle={[
                styles.dropdownContainer,
                styles.dropdownContainerForSort,
              ]}
              inputStyle={styles.dropdownInput}
              onChange={handleFilterSelect}
              isSearchable={false}
              showLabelAlongSelection={
                pageWidth <= breakpoints.small.int ? true : false
              }
            />
          </div>

          {hasAppliedFilters && (
            <div className={css(styles.appliedFilters)}>
              {selectedHubs.map((opt) =>
                renderAppliedFilterBadge({ opt, dropdownKey: "hubs" })
              )}
              {selectedTimeRange.value &&
                renderAppliedFilterBadge({
                  opt: selectedTimeRange,
                  dropdownKey: "publish_date__gte",
                })}

              <Badge
                label="CLEAR ALL"
                badgeClassName={styles.clearFiltersBtn}
                onClick={handleClearAll}
              />
            </div>
          )}
        </Fragment>
      )}

      {numOfHits === 0 && (
        <ComponentWrapper overrideStyle={styles.componentWrapper}>
          <EmptyFeedScreen title="There are no results found for this criteria" />
        </ComponentWrapper>
      )}

      {results.map((paper, index) => {
        paper.abstract = parseIfHighlighted({
          searchResult: paper,
          attribute: "abstract",
        });
        paper.title = parseIfHighlighted({
          searchResult: paper,
          attribute: "title",
        });
        paper.promoted = false;

        return (
          <PaperEntryCard
            paper={paper}
            index={index}
            key={paper.id}
            voteCallback={() => null}
          />
        );
      })}
      {loadMoreBtn}
    </ComponentWrapper>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginTop: 40,
    marginBottom: 20,
  },
  resultCount: {
    color: colors.GREY(),
    marginBottom: 20,
  },
  filters: {
    display: "flex",
    marginBottom: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexWrap: "wrap",
      marginBottom: 0,
    },
  },
  dropdownContainer: {
    width: 250,
    minHeight: "unset",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginRight: 0,
      marginBottom: 10,
      width: "100%",
    },
  },
  dropdownContainerForSort: {
    width: 200,
    marginRight: 0,
    marginLeft: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  dropdownInput: {
    width: 200,
    minHeight: "unset",
    width: "100%",
  },
  appliedFilters: {
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    padding: "2px 2px",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  highlight: {
    backgroundColor: "yellow",
  },
  loadMore: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
    height: 45,
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
      marginBottom: 15,
    },
  },
  clearFiltersBtn: {
    backgroundColor: "none",
    color: colors.RED(),
    fontSize: 12,
    ":hover": {
      boxShadow: `inset 0px 0px 0px 1px ${colors.RED()}`,
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

SearchResults.propTypes = {
  initialResults: PropTypes.object,
};

export default SearchResults;
