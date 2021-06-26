import { searchTypes } from "~/config/utils/options";
import colors from "~/config/themes/colors";
import { fetchURL } from "~/config/fetch";
import FormSelect from "~/components/Form/FormSelect";
import Loader from "~/components/Loader/Loader";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";

import * as moment from "dayjs";
import Ripples from "react-ripples";
import { useState, useEffect } from "react";
import Link from "next/link";
import { keys, isString, isArray } from "underscore";
import { useRouter } from "next/router";
import { get } from "lodash";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Select, { components } from "react-select";

const timeFilterOpts = [
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
  {
    value: "-hot_score",
    label: "Trending",
  },
  {
    value: "-score",
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

const SearchResults = ({ initialResults }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(0);
  const [results, setResults] = useState([]);
  const [facetValuesForHub, setFacetValuesForHub] = useState([]);

  const [selectedHubs, setSelectedHubs] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedSortOrder, setSelectedSortOrder] = useState(null);

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
      return timeFilterOpts.find((opt) => opt.value === urlParam);
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

    return selected.map((v) => ({ label: v, value: v }));
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

  const handleRemoveSelected = ({ optToRemove, dropdownKey }) => {
    let updatedQuery = { ...router.query };
    if (dropdownKey === "hubs") {
      const newValue = selectedHubs
        .filter((h) => h.value !== optToRemove.value)
        .map((h) => h.value);

      updatedQuery[dropdownKey] = newValue;
    }

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

  const facetValueOpts = facetValuesForHub.map((f) => ({
    label: `${f.key} (${f.doc_count})`,
    value: f.key,
  }));
  const entityTabsHtml = renderEntityTabs();
  const loadMoreBtn = renderLoadMoreButton();

  return (
    <div>
      <FormSelect
        id={"hubs"}
        options={facetValueOpts}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Hubs"}
        value={selectedHubs}
        isMulti={true}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
        showCountInsteadOfLabels={true}
      />
      <FormSelect
        id={"publish_date__gte"}
        options={timeFilterOpts}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={true}
        placeholder={"Date Published"}
        value={selectedTimeRange}
        isMulti={false}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
      />
      <FormSelect
        id={"ordering"}
        options={sortOpts}
        value={selectedSortOrder}
        containerStyle={null}
        inputStyle={null}
        onChange={handleFilterSelect}
        isSearchable={false}
      />
      <div className={css(styles.badgeList)}>
        {selectedHubs.map((opt) => {
          return (
            <div className={css(styles.badge)}>
              <div className={css(styles.badgeLabel)}>{opt.label}</div>
              <div
                className={css(styles.badgeRemove)}
                onClick={() =>
                  handleRemoveSelected({
                    optToRemove: opt,
                    dropdownKey: "hubs",
                  })
                }
              >
                <svg
                  height="14"
                  width="14"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  focusable="false"
                  class="css-6q0nyr-Svg"
                >
                  <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      {entityTabsHtml}
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

        // WIP MESS
        //         console.log('paper.raw_authors.length', paper.raw_authors.length);
        //
        //
        //         const highlight = get(paper, `highlight["raw_authors.full_name"]`, [])[0] || '';
        //         let highlighWithoutMarks = highlight.replace('<mark>', '').replace('</mark>', '');
        //         let final = [];
        //
        //
        //         if (!highlight) {
        //           final = paper.raw_authors
        //         }
        //         else {
        //           for (let i = 0; i < paper.raw_authors.length; i++) {
        //             console.log('highlighWithoutMarks', highlighWithoutMarks);
        //             console.log('paper.raw_authors[i].full_name', paper.raw_authors[i].full_name);
        //             if (paper.raw_authors[i].full_name.indexOf(highlighWithoutMarks) > -1) {
        //               console.log('YES');
        //             }
        //           }
        //         }

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
    </div>
  );
};

const styles = StyleSheet.create({
  badgeList: {
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    padding: "2px 8px",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    textTransform: "capitalize",
  },
  badge: {
    display: "flex",
    margin: "2px",
    minWidth: "0",
    boxSizing: "border-box",
    backgroundColor: "#edeefe",
    borderRadius: "2px",
  },
  badgeLabel: {
    borderRadius: "2px",
    color: colors.BLUE(),
    fontSize: "85%",
    overflow: "hidden",
    padding: "3px",
    paddingLeft: "6px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  badgeRemove: {
    display: "flex",
    paddingLeft: "4px",
    paddingRight: "4px",
    boxSizing: "border-box",
    alignItems: "center",
    borderRadius: "2px",
    cursor: "pointer",
  },
  highlight: {
    backgroundColor: "yellow",
  },
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

SearchResults.propTypes = {
  initialResults: PropTypes.object,
};

export default SearchResults;
