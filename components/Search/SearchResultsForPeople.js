import { useState, useEffect, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useRouter } from "next/router";
import { isArray, isString, isEmpty } from "underscore";

import { fetchURL } from "~/config/fetch";
import FormSelect from "~/components/Form/FormSelect";
import colors from "~/config/themes/colors";
import LeaderboardUser from "~/components/Leaderboard/LeaderboardUser";
import SearchEmpty from "~/components/Search/SearchEmpty";
import { breakpoints } from "~/config/themes/screen";
import LoadMoreButton from "~/components/LoadMoreButton";
import UserCard from "~/components/UserCard";

const sortOpts = [
  {
    isDefault: true,
    value: null,
    label: "Relevance",
    valueForApi: null,
  },
  {
    value: "-score",
    label: "Reputation",
    valueForApi: "-author_score",
  },
];

const SearchResultsForPeople = ({ apiResponse, context }) => {
  const router = useRouter();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(null);
  const [results, setResults] = useState([]);

  const [
    selectedSortOrderDropdownValue,
    setSelectedSortOrderDropdownValue,
  ] = useState({});

  const [pageWidth, setPageWidth] = useState(
    process.browser ? window.innerWidth : 0
  );

  useEffect(() => {
    const results = get(apiResponse, "results", []);

    setResults(results);
    setNextResultsUrl(get(apiResponse, "next", null));
    setNumOfHits(get(apiResponse, "count", 0));
    setSelectedSortOrderDropdownValue(getDropdownValueForSort());
  }, [apiResponse]);

  useEffect(() => {
    const _setPageWidth = () => setPageWidth(window.innerWidth);

    window.addEventListener("resize", _setPageWidth, true);

    return () => {
      window.removeEventListener("resize", _setPageWidth, true);
    };
  }, []);

  const getDropdownValueForSort = () => {
    const orderingParam = get(router, "query.ordering", null);
    const currentPersonType = get(router, "query.person_types", null);

    const dropdownValue = sortOpts.find(
      (opt) => opt.valueForApi === orderingParam
    );

    return dropdownValue || sortOpts.find((opt) => opt.isDefault === true);
  };

  const handleSortSelect = (sortId, selected) => {
    let query = {
      ...router.query,
    };

    if (selected.value === null) {
      delete query[sortId];
    } else {
      query[sortId] = sortOpts[sortId];
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const handleFilterSelect = (filterId, selected) => {
    const selectedSort = getDropdownValueForSort();

    let query = {
      ...router.query,
      [filterId]: selected.valueForApi,
    };

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

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

  const getPersonReputation = (person) => {
    return get(person, "author_profile.reputation", 0);
  };

  return (
    <div>
      {numOfHits === 0 && <SearchEmpty />}
      {numOfHits > 0 && (
        <Fragment>
          {context !== "best-results" && (
            <Fragment>
              <div className={css(styles.resultCount)}>
                {`${numOfHits} ${
                  numOfHits === 1 ? "result" : "results"
                } found.`}
              </div>
              <div className={css(styles.filters)}>
                <FormSelect
                  id={"ordering"}
                  placeholder={"Sort"}
                  options={sortOpts}
                  value={selectedSortOrderDropdownValue}
                  containerStyle={[
                    styles.dropdownContainer,
                    styles.dropdownContainerForSort,
                  ]}
                  inputStyle={styles.dropdownInput}
                  onChange={handleSortSelect}
                  isSearchable={false}
                  showLabelAlongSelection={
                    pageWidth <= breakpoints.small.int ? true : false
                  }
                />
              </div>
            </Fragment>
          )}
          <div className={css(styles.results)}>
            {results.map((person, index) => {
              return (
                <UserCard
                  key={`person-${person.id}-${index}`}
                  className={css(styles.person)}
                  authorProfile={person.author_profile}
                  reputation={getPersonReputation(person)}
                  styleVariation={
                    context === "best-results" ? "noBorderVariation" : null
                  }
                />
              );
            })}
          </div>
          {nextResultsUrl && (
            <LoadMoreButton
              onClick={loadMoreResults}
              isLoading={isLoadingMore}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
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
  results: {
    marginTop: 0,
  },
  person: {
    width: "100%",
    marginBottom: 10,
  },
});

SearchResultsForPeople.propTypes = {
  apiResponse: PropTypes.object,
  context: PropTypes.oneOf(["best-results"]),
};

export default SearchResultsForPeople;
