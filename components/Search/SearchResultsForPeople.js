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
    isDefault: true,
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

  const [
    selectedPersonTypeDropdownValue,
    setSelectedPersonTypeDropdownValue,
  ] = useState({});
  const [
    selectedSortOrderDropdownValue,
    setSelectedSortOrderDropdownValue,
  ] = useState({});

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
    setSelectedSortOrderDropdownValue(getDropdownValueForSort());
  }, [selectedPersonTypeDropdownValue]);

  const updateDropdowns = () => {
    setSelectedPersonTypeDropdownValue(getDropdownValueForPerson());
    setSelectedSortOrderDropdownValue(getDropdownValueForSort());
  };

  const getDropdownValueForPerson = () => {
    const personTypeParam = get(router, "query.person_types", null);
    const defaultValue = "user";
    let dropdownValue = null;

    const found = facetValuesForPersonType.find(
      (opt) => opt.key === personTypeParam
    );

    dropdownValue =
      found || facetValuesForPersonType.find((opt) => opt.key === defaultValue);

    return {
      label: get(dropdownValue, "key"),
      value: get(dropdownValue, "key"),
    };
  };

  const getDropdownValueForSort = () => {
    const orderingParam = get(router, "query.ordering", null);
    const currentPersonType = get(router, "query.person_types", null);
    let dropdownValue = null;

    if (currentPersonType === "user") {
      dropdownValue = sortOpts.find(
        (opt) => opt.valueForApi.ifPersonTypeUser === orderingParam
      );
    } else if (currentPersonType === "author") {
      dropdownValue = sortOpts.find(
        (opt) => opt.valueForApi.ifPersonTypeAuthor === orderingParam
      );
    }

    return dropdownValue || sortOpts.find((opt) => opt.isDefault === true);
  };

  const handleSortSelect = (sortId, selected, redirect = true) => {
    const currentPersonType = get(router, `query.person_types`, null);
    let query = {
      ...router.query,
    };

    if (selected.value === null) {
      delete query[sortId];
    } else {
      query[sortId] =
        currentPersonType === "author"
          ? selected.valueForApi.ifPersonTypeAuthor
          : selected.valueForApi.ifPersonTypeUser;
    }

    if (redirect === true) {
      router.push({
        pathname: "/search/[type]",
        query,
      });
    }

    return query;
  };

  const handleFilterSelect = (filterId, selected) => {
    const selectedSort = getDropdownValueForSort();
    const sortQuery = handleSortSelect("ordering", selectedSort, false);

    let query = {
      ...router.query,
      ...sortQuery,
      [filterId]: selected.valueForApi,
    };

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const getPersonReputation = (person) => {
    const currentPersonType = get(router, `query.person_types`, null);

    if (currentPersonType === "user") {
      return get(person, "user.reputation", "");
    } else if (currentPersonType === "author") {
      return get(person, "author_profile.author_score", "");
    }
    return null;
  };

  // const loadMoreBtn = renderLoadMoreButton();
  const facetValueOpts = facetValuesForPersonType.map((f) => ({
    label: `${f.key} (${f.doc_count})`,
    value: f.key,
    valueForApi: f.key,
  }));

  return (
    <div>
      {numOfHits === 0 && <SearchEmpty />}
      {numOfHits > 0 && (
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
              value={selectedPersonTypeDropdownValue}
              isMulti={false}
              multiTagStyle={null}
              multiTagLabelStyle={null}
              isClearable={false}
            />
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
