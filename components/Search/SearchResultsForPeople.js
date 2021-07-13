import { useState, useEffect, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import Ripples from "react-ripples";
import { useRouter } from "next/router";
import { isArray, isString, isEmpty } from "underscore";

import FormSelect from "~/components/Form/FormSelect";
import colors from "~/config/themes/colors";
import LeaderboardUser from "~/components/Leaderboard/LeaderboardUser";
import SearchEmpty from "~/components/Search/SearchEmpty";
import { breakpoints } from "~/config/themes/screen";

const sortOpts = [
  {
    value: null,
    label: "Relevance",
    valueForApi: {
      ifPersonTypeUser: null,
      ifPersonTypeAuthor: null,
    },
  },
  {
    value: "-score",
    label: "Reputation",
    valueForApi: {
      ifPersonTypeUser: "-user_reputation",
      ifPersonTypeAuthor: "-author_score",
    },
  },
];

const SearchResultsForPeople = ({ apiResponse }) => {
  const router = useRouter();

  const [facetValuesForPersonType, setFacetValuesForPersonType] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(null);
  const [results, setResults] = useState([]);

  const [selectedPersonType, setSelectedPersonType] = useState({});
  const [selectedSortOrder, setSelectedSortOrder] = useState({});

  const [pageWidth, setPageWidth] = useState(
    process.browser ? window.innerWidth : 0
  );

  useEffect(() => {
    updateDropdowns();
  }, [router.query, facetValuesForPersonType]);

  useEffect(() => {
    const results = get(apiResponse, "results", []);

    setResults(results);
    setNextResultsUrl(get(apiResponse, "next", null));
    setNumOfHits(get(apiResponse, "count", 0));
    setFacetValuesForPersonType(
      get(apiResponse, "facets._filter_person_types.person_types.buckets", [])
    );
  }, [apiResponse]);

  useEffect(() => {
    setSelectedSortOrder(getSelectedDropdownValue({ forKey: "ordering" }));
  }, [selectedPersonType]);

  const updateDropdowns = () => {
    setSelectedPersonType(getSelectedDropdownValue({ forKey: "person_types" }));
    setSelectedSortOrder(getSelectedDropdownValue({ forKey: "ordering" }));
  };

  const getSelectedDropdownValue = ({ forKey }) => {
    const urlParam = get(router, `query.${forKey}`, null);

    if (forKey === "ordering") {
      return sortOpts.find((opt) => opt.value === urlParam);
    } else if (forKey === "person_types") {
      const found = facetValuesForPersonType.find(
        (opt) => opt.key === urlParam
      );
      return found ? { label: found.key, value: found.key } : null;
    }

    return null;
  };

  const handleSortSelect = (sortId, selected) => {
    let query = {
      ...router.query,
    };

    if (selected.value === null) {
      delete query[sortId];
    } else {
      query[sortId] =
        selectedPersonType === "author"
          ? selected.valueForApi.ifPersonTypeAuthor
          : selected.valueForApi.ifPersonTypeUser;
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const handleFilterSelect = (filterId, selected) => {
    let query = {
      ...router.query,
      [filterId]: selected.valueForApi,
    };

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const getPersonReputation = (person) => {
    if (get(selectedPersonType, "value") === "user") {
      return get(person, "user.reputation", "");
    } else if (get(selectedPersonType, "value") === "author") {
      return get(person, "author_profile.author_score", "");
    }
    return null;
  };

  // const loadMoreBtn = renderLoadMoreButton();
  const hasAppliedFilters = !isEmpty(selectedPersonType);
  const facetValueOpts = facetValuesForPersonType.map((f) => ({
    label: `${f.key} (${f.doc_count})`,
    value: f.key,
    valueForApi: f.key,
  }));

  return (
    <div>
      {(numOfHits > 0 || hasAppliedFilters) && (
        <Fragment>
          <div className={css(styles.resultCount)}>
            {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
          </div>
          <div className={css(styles.filters)}>
            <FormSelect
              id={"person_types"}
              options={facetValueOpts}
              containerStyle={styles.dropdownContainer}
              inputStyle={styles.dropdownInput}
              onChange={handleFilterSelect}
              isSearchable={false}
              placeholder={"Person Type"}
              value={selectedPersonType}
              isMulti={false}
              multiTagStyle={null}
              multiTagLabelStyle={null}
              isClearable={false}
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
              onChange={handleSortSelect}
              isSearchable={false}
              showLabelAlongSelection={
                pageWidth <= breakpoints.small.int ? true : false
              }
            />
          </div>
        </Fragment>
      )}

      {numOfHits === 0 && <SearchEmpty />}

      {results.map((person, index) => {
        return (
          <Ripples
            className={css(styles.person)}
            key={`person-${index}-${person.id}`}
          >
            <LeaderboardUser
              user={person.user}
              name={person.full_name}
              reputation={getPersonReputation(person)}
              authorProfile={person.author_profile}
              authorId={get(person, "author_profile.id")}
            />
          </Ripples>
        );
      })}
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
  person: {
    display: "flex",
    width: "100%",
    boxSizing: "border-box",
    padding: "7px 20px",
    borderLeft: "3px solid #FFF",
    transition: "all ease-out 0.1s",
    ":hover": {
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
      backgroundColor: "#FAFAFA",
    },
  },
});

SearchResultsForPeople.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResultsForPeople;
