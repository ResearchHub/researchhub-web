import React, { useState, useEffect, Fragment, useRef } from "react";
import { useRouter } from "next/router";
import get from "lodash/get";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import sanitizeHtml from "sanitize-html";
import colors from "~/config/themes/colors";
import { fetchURL } from "~/config/fetch";
import Badge from "~/components/Badge";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import FeedCard from "~/components/Author/Tabs/FeedCard";
import LoadMoreButton from "~/components/LoadMoreButton";
import { fetchUserVote } from "~/components/UnifiedDocFeed/api/unifiedDocFetch";
import { breakpoints } from "~/config/themes/screen";
import { isString } from "~/config/utils/string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/pro-solid-svg-icons";
import RangeSlider from "../Form/RangeSlider";
import FormSelect, {
  CustomSelectControlWithoutClickEvents,
} from "~/components/Form/FormSelect";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import SimpleSlider from "../Form/SimpleSlider";

import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { faFilter } from "@fortawesome/pro-regular-svg-icons";
import SearchFilters from "./SearchFiltersForDocs";
import { SearchFiltersContextProvider } from "./lib/SearchFiltersContext";
import AppliedFilters from "./lib/AppliedFilters";

const getSelectedFacetValues = ({ router, forKey }) => {
  let selected: any = [];

  if (Array.isArray(router.query[forKey])) {
    selected = router.query[forKey];
  } else if (isString(router.query[forKey])) {
    selected = [router.query[forKey]];
  }

  return selected.map((v) => ({ label: v, value: v, valueForApi: v }));
};

const sortOpts = [
  {
    isDefault: true,
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

const SearchResultsForDocs = ({ apiResponse, entityType, context }) => {
  const router = useRouter();

  const [facetValuesForHub, setFacetValuesForHub] = useState([]);
  const [facetValuesForJournal, setFacetValuesForJournal] = useState([]);
  const [facetValuesForPublicationYear, setFacetValuesForPublicationYear] =
    useState([]);
  const [isPublicationYearSelectionOpen, setIsPublicationYearSelectionOpen] =
    useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(null);
  const [results, setResults] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [searchEntityType, setSearchEntityType] = useState(
    entityType || router.query.type
  );

  const [pageWidth, setPageWidth] = useState(0);
  // const [selectedHubs, setSelectedHubs] = useState([]);
  const [selectedJournals, setSelectedJournals] = useState([]);
  const [selectedPublishYearRange, setSelectedPublishYearRange] = useState([]);
  const [selectedCitationPercentile, setSelectedCitationPercentile] =
    useState(0);
  const [selectedSortOrder, setSelectedSortOrder] = useState({});
  const publicationYearRef = useRef(null);

  useEffectHandleClick({
    ref: publicationYearRef,
    exclude: [".publication-year-dropdown"],
    onOutsideClick: () => setIsPublicationYearSelectionOpen(false),
  });

  useEffect(() => {
    // setSelectedHubs(getSelectedFacetValues({ forKey: "hub" }));
    setSelectedJournals(getSelectedFacetValues({ router, forKey: "journal" }));
    setSelectedSortOrder(getSelectedDropdownValue({ forKey: "ordering" }));

    let publishYearMin, publishYearMax;
    let citationPercentile;
    if (router.query.paper_publish_year__gte) {
      publishYearMin = router.query.paper_publish_year__gte;
    }

    if (router.query.paper_publish_year__lte) {
      publishYearMax = router.query.paper_publish_year__lte;
    }

    if (router.query.citation_percentile__gte) {
      citationPercentile = router.query.citation_percentile__gte;
    }

    if (publishYearMin && publishYearMax) {
      setSelectedPublishYearRange([publishYearMin, publishYearMax]);
    } else {
      setSelectedPublishYearRange([]);
    }

    if (citationPercentile) {
      setSelectedCitationPercentile(citationPercentile);
    } else {
      setSelectedCitationPercentile(0);
    }
  }, [router.query]);

  useEffect(() => {
    const results = get(apiResponse, "results", []);

    setResults(results);
    setNextResultsUrl(get(apiResponse, "next", null));
    setNumOfHits(get(apiResponse, "count", 0));
    setFacetValuesForHub(
      get(apiResponse, "facets._filter_hubs.hubs.buckets", [])
    );
    setFacetValuesForJournal(
      get(
        apiResponse,
        "facets._filter_external_source.external_source.buckets",
        []
      )
    );
    setFacetValuesForPublicationYear(
      get(
        apiResponse,
        "facets._filter_paper_publish_year.paper_publish_year.buckets",
        []
      )
    );

    if (results && results.length) {
      fetchAndSetUserVotes(results);
    }
  }, [apiResponse]);

  useEffect(() => {
    const _setPageWidth = () => setPageWidth(window.innerWidth);

    window.addEventListener("resize", _setPageWidth, true);

    return () => {
      window.removeEventListener("resize", _setPageWidth, true);
    };
  }, []);

  const _fetchCurrentUserVotesForPosts = async (results) => {
    const formattedReq = results.map((r) => ({
      documents: [r],
      document_type: "POST",
    }));

    const documents = await fetchUserVote(formattedReq);

    const userVoteMap = documents.reduce((map, uniDoc) => {
      const docs = get(uniDoc, "documents", []);
      const post = docs[0];

      map[post.id] = post.user_vote;
      return map;
    }, {});

    // Don't override previous votes set, append to them.
    setUserVotes({ ...userVotes, ...userVoteMap });
  };

  const _fetchCurrentUserVotesForPapers = async (results) => {
    const formattedReq = results.map((r) => ({
      documents: r,
      document_type: "PAPER",
    }));

    const documents = await fetchUserVote(formattedReq);

    const userVoteMap = documents.reduce((map, doc) => {
      const paper = get(doc, "documents", {});
      map[paper.id] = paper.user_vote;
      return map;
    }, {});

    // Don't override previous votes set, append to them.
    setUserVotes({ ...userVotes, ...userVoteMap });
  };

  const fetchAndSetUserVotes = async (results) => {
    if (entityType === "post") {
      return _fetchCurrentUserVotesForPosts(results);
    } else if (entityType === "paper") {
      return _fetchCurrentUserVotesForPapers(results);
    }
  };

  const getSelectedDropdownValue = ({ forKey }) => {
    const urlParam = get(router, `query.${forKey}`, null);
    let dropdownValue = null;

    if (forKey === "ordering") {
      dropdownValue = sortOpts.find((opt) => opt.value === urlParam);
      dropdownValue =
        dropdownValue || sortOpts.find((opt) => opt.isDefault === true);
    }

    return dropdownValue;
  };

  const handleDropdownFilterSelect = (filterId, selected) => {
    const query = {
      ...router.query,
    };

    if (Array.isArray(selected)) {
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

  // const handleRemoveSelected = ({ opt, dropdownKey }) => {
  //   const updatedQuery = { ...router.query };

  //   if (dropdownKey === "hub") {
  //     const newValue = selectedHubs
  //       .filter((h) => h.value !== opt.value)
  //       .map((h) => h.value);

  //     updatedQuery[dropdownKey] = newValue;
  //   } else if (dropdownKey === "journal") {
  //     const newValue = selectedJournals
  //       .filter((j) => j.value !== opt.value)
  //       .map((j) => j.value);

  //     updatedQuery[dropdownKey] = newValue;
  //   } else if (dropdownKey === "paper_publish_year") {
  //     delete updatedQuery["paper_publish_year__gte"];
  //     delete updatedQuery["paper_publish_year__lte"];
  //   } else if (dropdownKey === "citation_percentile") {
  //     delete updatedQuery["citation_percentile__gte"];
  //   }

  //   router.push({
  //     pathname: "/search/[type]",
  //     query: updatedQuery,
  //   });
  // };

  // const handleClearAll = () => {
  //   const updatedQuery = {
  //     ...router.query,
  //   };

  //   delete updatedQuery["paper_publish_year__gte"];
  //   delete updatedQuery["paper_publish_year__lte"];
  //   delete updatedQuery["citation_percentile__gte"];
  //   delete updatedQuery["hub"];
  //   delete updatedQuery["journal"];
  //   delete updatedQuery["ordering"];

  //   router.push({
  //     pathname: "/search/[type]",
  //     query: updatedQuery,
  //   });
  // };

  const loadMoreResults = () => {
    setIsLoadingMore(true);

    fetchURL(nextResultsUrl)
      .then((res) => {
        setResults([...results, ...res.results]);
        setNextResultsUrl(res.next);
        setNumOfHits(res.count);
        setFacetValuesForHub(get(res, "facets._filter_hubs.hubs.buckets", []));
        setFacetValuesForJournal(
          get(res, "facets._filter_external_source.external_source.buckets", [])
        );

        fetchAndSetUserVotes(res.results);
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
  };

  const parseIfHighlighted = ({ searchResult, attribute }) => {
    const highlight = get(searchResult, `highlight.${attribute}`, [])[0];

    if (!highlight) {
      return searchResult[attribute];
    }

    const highlightWithoutHtml = sanitizeHtml(highlight, {
      allowedTags: ["mark"], // No tags are allowed, so all will be stripped
      allowedAttributes: {}, // No attributes are allowed
    });

    const parts = highlightWithoutHtml.split(/(<mark>[^<]+<\/mark>)/);
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

  // const renderAppliedFilterBadge = ({ opt, dropdownKey }) => {
  //   return (
  //     <Badge
  //       id={`${dropdownKey}-${opt.value}`}
  //       key={`${dropdownKey}-${opt.value}`}
  //       label={`${dropdownKey}: ${opt.label}`}
  //       badgeClassName={styles.appliedFilterBadge}
  //       badgeLabelClassName={styles.appliedFilterBadgeLabel}
  //       onClick={() => handleRemoveSelected({ opt, dropdownKey })}
  //       onRemove={() => handleRemoveSelected({ opt, dropdownKey })}
  //     />
  //   );
  // };

  const handleSearchFilterChange = (filterType: FilterType, value: any) => {
    const query = {
      ...router.query,
    };

    if (filterType === "citation_percentile") {
      query["citation_percentile__gte"] = value;
    } else if (filterType === "publication_year") {
      query["paper_publish_year__gte"] = value[0];
      query["paper_publish_year__lte"] = value[1];
    } else if (filterType === "hub" || filterType === "journal") {
      if (Array.isArray(value)) {
        query[filterType] = value.map((v) => v.valueForApi);
      } else if (!value || !value.valueForApi) {
        delete query[filterType];
      } else {
        query[filterType] = value.valueForApi;
      }
    }

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const selectedHubs = getSelectedFacetValues({ router, forKey: "hub" });
  // const hasAppliedFilters =
  //   selectedHubs.length ||
  //   selectedJournals.length ||
  //   selectedCitationPercentile > 0 ||
  //   selectedPublishYearRange[0];

  // const getFacetOptionsForDropdown = (facetKey) => {
  //   let facetValues = [];

  //   switch (facetKey) {
  //     case "hubs":
  //       facetValues = facetValuesForHub;
  //       break;
  //     case "journal":
  //       facetValues = facetValuesForJournal;
  //       break;
  //   }

  //   return facetValues.map((f) => ({
  //     label: `${f.key} (${f.doc_count})`,
  //     value: f.key,
  //     valueForApi: f.key,
  //   }));
  // };

  // const getLabelForPaperPublicationYear = () => {
  //   const min = selectedPublishYearRange[0];
  //   const max = selectedPublishYearRange[1];

  //   if (min && max && min !== max) {
  //     return `${min} - ${max}`;
  //   } else if (min && max && min === max) {
  //     return `${min}`;
  //   }

  //   return "Publication Year";
  // };

  return (
    <SearchFiltersContextProvider>
      <div>
        {context !== "best-results" && numOfHits > 0 && (
          <Fragment>
            <div className={css(styles.resultCount)}>
              {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
            </div>
            <div className={css(styles.filters)}>
              <SearchFilters
                searchFacets={apiResponse?.facets}
                onChange={handleSearchFilterChange}
              />
              {/* <div
              ref={publicationYearRef}
              className={
                css(styles.publicationYearDropdownWrapper) +
                " publication-year-dropdown"
              }
              onClick={(e) =>
                setIsPublicationYearSelectionOpen(
                  !isPublicationYearSelectionOpen
                )
              }
            > */}
              {/* <FormSelect
                selectComponents={{
                  Control: CustomSelectControlWithoutClickEvents,
                }}
                containerStyle={styles.dropdownContainer}
                inputStyle={styles.dropdownInput}
                options={[]}
                value={{
                  value: "paper_publish_year",
                  label: selectedPublishYearRange ? (
                    <div
                      style={{
                        display: "flex",
                        columnGap: "5px",
                        alignItems: "center",
                      }}
                    >
                      {getLabelForPaperPublicationYear()}
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        columnGap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <span>{"Year Published"}</span>
                    </div>
                  ),
                }}
              /> */}
              {/* </div> */}

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
                onChange={handleDropdownFilterSelect}
                isSearchable={false}
                showLabelAlongSelection={
                  pageWidth <= breakpoints.small.int ? true : false
                }
              />
            </div>
            <AppliedFilters />

            {/* {hasAppliedFilters && (
            <div className={css(styles.appliedFilters)}>
              {selectedHubs.map((opt) =>
                renderAppliedFilterBadge({ opt, dropdownKey: "hub" })
              )}
              {selectedJournals.map((opt) =>
                renderAppliedFilterBadge({ opt, dropdownKey: "journal" })
              )}
              {selectedPublishYearRange[0] && (
                <Badge
                  id={`paper_publish_year-badge`}
                  label={`Published: ${getLabelForPaperPublicationYear()}`}
                  badgeClassName={styles.appliedFilterBadge}
                  badgeLabelClassName={styles.appliedFilterBadgeLabel}
                  onClick={() =>
                    handleRemoveSelected({ dropdownKey: "paper_publish_year" })
                  }
                  onRemove={() =>
                    handleRemoveSelected({ dropdownKey: "paper_publish_year" })
                  }
                />
              )}
              {selectedCitationPercentile > 0 && (
                <Badge
                  id={`citation_percentile-badge`}
                  label={`Percentile: ${selectedCitationPercentile + "th"}`}
                  badgeClassName={styles.appliedFilterBadge}
                  badgeLabelClassName={styles.appliedFilterBadgeLabel}
                  onClick={() =>
                    handleRemoveSelected({ dropdownKey: "citation_percentile" })
                  }
                  onRemove={() =>
                    handleRemoveSelected({ dropdownKey: "citation_percentile" })
                  }
                />
              )}

              <Badge
                id="clear-all"
                badgeClassName={styles.clearFiltersBadge}
                onClick={handleClearAll}
              >
                <span>CLEAR FILTERS</span>
                <FontAwesomeIcon style={{ fontSize: 10 }} icon={faX} />
              </Badge>
            </div>
          )} */}
          </Fragment>
        )}

        {numOfHits === 0 && (
          <EmptyFeedScreen title="There are no results found for this criteria" />
        )}

        <div>
          {searchEntityType === "post" &&
            results.map((post, index) => {
              post.user_vote = userVotes[post.id];

              return (
                <FeedCard
                  {...post}
                  unifiedDocumentId={post.unified_document_id}
                  formattedDocType={"post"}
                  key={`post-${post.id}`}
                  user_vote={post?.user_vote}
                />
              );
            })}
          {searchEntityType === "paper" &&
            results.map((paper, index) => {
              paper.promoted = false;
              paper.user_vote = userVotes[paper.id];
              paper.created_date = paper.paper_publish_date;

              if (context !== "best-results") {
                // There is a small but non-trivial chance that this will fail
                // In such a case, we want to avoid the entire page from breaking.
                try {
                  paper.abstract = parseIfHighlighted({
                    searchResult: paper,
                    attribute: "abstract",
                  });
                } catch {}
                try {
                  paper.titleAsHtml = parseIfHighlighted({
                    searchResult: paper,
                    attribute: "title",
                  });
                } catch {}
              }

              return (
                <FeedCard
                  {...paper}
                  unifiedDocumentId={paper.unified_document_id}
                  created_date={paper.paper_publish_date}
                  discussion_count={paper.discussion_count}
                  document={paper}
                  formattedDocType={"paper"}
                  index={index}
                  key={`paper-${paper.id}`}
                  paper={paper}
                  voteCallback={(arrIndex, currPaper) => {
                    const idx = results.findIndex((p) => p.id === currPaper.id);

                    results[idx] = currPaper;
                    userVotes[currPaper.id] = currPaper.user_vote;

                    setResults(results);
                    setUserVotes(userVotes);
                  }}
                />
              );
            })}
        </div>

        {nextResultsUrl && (
          <LoadMoreButton onClick={loadMoreResults} isLoading={isLoadingMore} />
        )}
      </div>
    </SearchFiltersContextProvider>
  );
};

const styles = StyleSheet.create({
  publicationYearDropdownWrapper: {
    position: "relative",
    zIndex: 9,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  // publicationYearDropdown: {
  //   position: "absolute",
  //   paddingRight: 30,
  //   paddingTop: 30,
  //   background: "white",
  //   zIndex: 1,
  //   width: 150,
  //   top: 40,
  //   left: 0,
  //   boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 10px 0px",
  // },
  resultCount: {
    color: colors.GREY(),
    marginBottom: 20,
  },
  filters: {
    display: "flex",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
    // boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      // flexWrap: "wrap",
      marginBottom: 0,
    },
  },
  fullWidthInput: {
    width: "100%",
  },
  dropdownContainer: {
    width: 150,
    minHeight: "unset",
    marginTop: 0,
    marginBottom: 0,
    marginRight: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginRight: 0,
      marginBottom: 10,
      // width: "100%",
    },
  },
  dropdownContainerForSort: {
    // marginRight: 0,
    // marginLeft: "auto",
    width: 150,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "auto",
      // width: "100%",
    },
  },
  dropdownInput: {
    width: 150,
    minHeight: "unset",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 200,
    },
  },
  // appliedFilters: {
  //   alignItems: "center",
  //   flex: 1,
  //   flexWrap: "wrap",
  //   padding: "2px 2px",
  //   position: "relative",
  //   overflow: "hidden",
  //   boxSizing: "border-box",
  //   display: "flex",
  //   textTransform: "capitalize",
  //   marginBottom: 20,
  // },
  highlight: {
    color: colors.ORANGE_DARK(1.0),
  },
  appliedFilterBadge: {
    borderRadius: 4,
    color: colors.BLACK(0.6),
    background: colors.LIGHTER_GREY(1.0),
    padding: "2px 8px",
    letterSpacing: 0,
    ":hover": {
      color: colors.NEW_BLUE(),
      background: colors.LIGHTER_GREY(1.0),
      cursor: "pointer",
    },
  },
  appliedFilterBadgeLabel: {
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
    padding: 0,
  },
  clearFiltersBadge: {
    cursor: "pointer",
    letterSpacing: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
    backgroundColor: "none",
    fontWeight: 500,
    color: colors.RED(),
    padding: "7px 8px",
    fontSize: 11,
    letterSpacing: "1px",
    ":hover": {
      background: colors.RED(0.1),
      color: colors.RED(),
      boxShadow: `inset 0px 0px 0px 1px ${colors.RED()}`,
    },
  },
});

SearchResultsForDocs.propTypes = {
  apiResponse: PropTypes.object,
  entityType: PropTypes.string,
  context: PropTypes.oneOf(["best-results"]),
};

export default SearchResultsForDocs;
