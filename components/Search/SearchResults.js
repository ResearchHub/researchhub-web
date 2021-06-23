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

const SearchResults = ({ initialResults }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(0);
  const [results, setResults] = useState([]);

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
    setResults(get(initialResults, "results"));
    setNextResultsUrl(get(initialResults, "next"));
    setNumOfHits(get(initialResults, "count"));
  }, [initialResults]);

  const loadMoreResults = () => {
    setIsLoadingMore(true);

    fetchURL(nextResultsUrl)
      .then((res) => {
        setResults([...results, ...res.results]);
        setNextResultsUrl(res.next);
        setNumOfHits(res.count);
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

  const availFacetOpts = get(
    initialResults,
    "facets._filter_hubs.hubs.buckets",
    []
  ).map((b) => ({
    label: `${b.key} (${b.doc_count})`,
    value: b.key,
  }));

  const entityTabsHtml = renderEntityTabs();
  const loadMoreBtn = renderLoadMoreButton();

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
        value={selectedHubs}
        isMulti={true}
        multiTagStyle={null}
        multiTagLabelStyle={null}
        isClearable={true}
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
      {entityTabsHtml}
      {results.map((paper, index) => {
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
