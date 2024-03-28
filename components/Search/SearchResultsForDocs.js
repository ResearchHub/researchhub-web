import * as moment from "dayjs";
import { useState, useEffect, Fragment, useRef } from "react";
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
  const [selectedHubs, setSelectedHubs] = useState([]);
  const [selectedJournals, setSelectedJournals] = useState([]);
  const [selectedPublishYearRange, setSelectedPublishYearRange] = useState([]);
  const [selectedSortOrder, setSelectedSortOrder] = useState({});
  const publicationYearRef = useRef(null);

  useEffectHandleClick({
    ref: publicationYearRef,
    exclude: [".publication-year-dropdown"],
    onOutsideClick: () => setIsPublicationYearSelectionOpen(false),
  });

  useEffect(() => {
    setSelectedHubs(getSelectedFacetValues({ forKey: "hub" }));
    setSelectedJournals(getSelectedFacetValues({ forKey: "journal" }));
    setSelectedSortOrder(getSelectedDropdownValue({ forKey: "ordering" }));

    let publishYearMin, publishYearMax;
    if (router.query.paper_publish_year__gte) {
      publishYearMin = router.query.paper_publish_year__gte;
    }

    if (router.query.paper_publish_year__lte) {
      publishYearMax = router.query.paper_publish_year__lte;
    }

    if (publishYearMin && publishYearMax) {
      setSelectedPublishYearRange([publishYearMin, publishYearMax]);
    } else {
      setSelectedPublishYearRange([]);
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

  const getSelectedFacetValues = ({ forKey }) => {
    let selected = [];

    if (Array.isArray(router.query[forKey])) {
      selected = router.query[forKey];
    } else if (isString(router.query[forKey])) {
      selected = [router.query[forKey]];
    }

    return selected.map((v) => ({ label: v, value: v, valueForApi: v }));
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

  const handleFilterSelect = (filterId, selected) => {
    let query = {
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

  const handleRemoveSelected = ({ opt, dropdownKey }) => {
    let updatedQuery = { ...router.query };

    if (dropdownKey === "hub") {
      const newValue = selectedHubs
        .filter((h) => h.value !== opt.value)
        .map((h) => h.value);

      updatedQuery[dropdownKey] = newValue;
    } else if (dropdownKey === "journal") {
      const newValue = selectedJournals
        .filter((j) => j.value !== opt.value)
        .map((j) => j.value);

      updatedQuery[dropdownKey] = newValue;
    } else if (dropdownKey === "paper_publish_year") {
      delete updatedQuery["paper_publish_year__gte"];
      delete updatedQuery["paper_publish_year__lte"];
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

    delete updatedQuery["paper_publish_year__gte"];
    delete updatedQuery["paper_publish_year__lte"];
    delete updatedQuery["hub"];
    delete updatedQuery["journal"];
    delete updatedQuery["ordering"];

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

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

  const renderAppliedFilterBadge = ({ opt, dropdownKey }) => {
    return (
      <Badge
        id={`${dropdownKey}-${opt.value}`}
        key={`${dropdownKey}-${opt.value}`}
        label={`${dropdownKey}: ${opt.label}`}
        badgeClassName={styles.appliedFilterBadge}
        badgeLabelClassName={styles.appliedFilterBadgeLabel}
        onClick={() => handleRemoveSelected({ opt, dropdownKey })}
        onRemove={() => handleRemoveSelected({ opt, dropdownKey })}
      />
    );
  };

  const handlePublishYearRangeSelection = (yearRange) => {
    let query = {
      ...router.query,
    };

    query["paper_publish_year__gte"] = yearRange[0];
    query["paper_publish_year__lte"] = yearRange[1];

    router.push({
      pathname: "/search/[type]",
      query,
    });
  };

  const hasAppliedFilters =
    selectedHubs.length ||
    selectedJournals.length ||
    selectedPublishYearRange[0];

  const getFacetOptionsForDropdown = (facetKey) => {
    let facetValues = [];

    switch (facetKey) {
      case "hubs":
        facetValues = facetValuesForHub;
        break;
      case "journal":
        facetValues = facetValuesForJournal;
        break;
    }

    return facetValues.map((f) => ({
      label: `${f.key} (${f.doc_count})`,
      value: f.key,
      valueForApi: f.key,
    }));
  };

  const getLabelForPaperPublicationYear = () => {
    const min = selectedPublishYearRange[0];
    const max = selectedPublishYearRange[1];

    if (min && max && min !== max) {
      return `${min} - ${max}`;
    } else if (min && max && min === max) {
      return `${min}`;
    }

    return "Publication Year";
  };

  const facetValueOptsForHubs = getFacetOptionsForDropdown("hubs");
  const facetValueOptsForJournal = getFacetOptionsForDropdown("journal");

  const facetValueOptsForPublicationYear = facetValuesForPublicationYear.reduce(
    (acc, { key, doc_count }) => {
      acc[key] = doc_count;
      return acc;
    },
    {}
  );

  return (
    <div>
      {context !== "best-results" && (numOfHits > 0 || hasAppliedFilters) && (
        <Fragment>
          <div className={css(styles.resultCount)}>
            {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
          </div>
          <div className={css(styles.filters)}>
            <FormSelect
              id={"hub"}
              options={facetValueOptsForHubs}
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
              reactSelect={{
                styles: {
                  menu: {
                    width:
                      facetValueOptsForHubs.length > 0 ? "max-content" : "100%",
                  },
                },
              }}
              showCountInsteadOfLabels={true}
            />
            <div
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
            >
              <FormSelect
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
              />
              {isPublicationYearSelectionOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={css(styles.publicationYearDropdown)}
                >
                  <RangeSlider
                    // TODO: Make min and max dynamic
                    min={2000}
                    max={2024}
                    defaultValues={
                      selectedPublishYearRange[0]
                        ? selectedPublishYearRange
                        : null
                    }
                    onChange={handlePublishYearRangeSelection}
                    histogram={facetValueOptsForPublicationYear}
                  />
                </div>
              )}
            </div>

            <FormSelect
              id={"journal"}
              options={facetValueOptsForJournal}
              containerStyle={styles.dropdownContainer}
              inputStyle={styles.dropdownInput}
              onChange={handleFilterSelect}
              isSearchable={true}
              placeholder={"Journal"}
              reactSelect={{
                styles: {
                  menu: {
                    width:
                      facetValueOptsForJournal.length > 0
                        ? "max-content"
                        : "100%",
                  },
                },
              }}
              value={selectedJournals}
              isMulti={true}
              multiTagStyle={null}
              multiTagLabelStyle={null}
              isClearable={false}
              showCountInsteadOfLabels={true}
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

              <Badge
                id="clear-all"
                badgeClassName={styles.clearFiltersBadge}
                onClick={handleClearAll}
              >
                <span>CLEAR FILTERS</span>
                <FontAwesomeIcon style={{ fontSize: 10 }} icon={faX} />
              </Badge>
            </div>
          )}
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
                formattedDocType={"post"}
                key={post?.id || index}
                user_vote={post?.user_vote}
              />
            );
          })}
        {searchEntityType === "paper" &&
          results.map((paper, index) => {
            paper.promoted = false;
            paper.user_vote = userVotes[paper.id];

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

            return (
              <FeedCard
                {...paper}
                formattedDocType={"paper"}
                index={index}
                key={paper.id}
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
  publicationYearDropdown: {
    position: "absolute",
    paddingRight: 30,
    paddingTop: 30,
    background: "white",
    zIndex: 1,
    width: 200,
    top: 40,
    left: 0,
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 10px 0px",
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
    width: 200,
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
    backgroundColor: colors.ORANGE_LIGHT4(0.75),
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
