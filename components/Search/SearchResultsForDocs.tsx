import React, { useState, useEffect, Fragment, useRef } from "react";
import { useRouter } from "next/router";
import get from "lodash/get";
import { StyleSheet, css } from "aphrodite";
import sanitizeHtml from "sanitize-html";
import colors from "~/config/themes/colors";
import { fetchURL } from "~/config/fetch";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import FeedCard from "~/components/Author/Tabs/FeedCard";
import LoadMoreButton from "~/components/LoadMoreButton";
import { fetchUserVote } from "~/components/UnifiedDocFeed/api/unifiedDocFetch";
import { breakpoints } from "~/config/themes/screen";
import SearchFilters, { FilterType } from "./SearchFiltersForDocs";
import { SearchFiltersContextProvider } from "./lib/SearchFiltersContext";
import AppliedFilters from "./lib/AppliedFilters";
import { NullableString } from "~/config/types/root_types";

interface Props {
  apiResponse: any;
  entityType: "paper" | "post";
  context?: "best-results";
}

const SearchResultsForDocs = ({ apiResponse, entityType, context }: Props) => {
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState<NullableString>(null);
  const [numOfHits, setNumOfHits] = useState<number | null>(null);
  const [results, setResults] = useState<Array<any>>([]);
  const [userVotes, setUserVotes] = useState<any>({});

  useEffect(() => {
    const results = get(apiResponse, "results", []);

    setResults(results);
    setNextResultsUrl(get(apiResponse, "next", null));
    setNumOfHits(get(apiResponse, "count", 0));

    if (results && results.length) {
      fetchAndSetUserVotes(results);
    }
  }, [apiResponse]);

  const _fetchCurrentUserVotesForPosts = async (results) => {
    const formattedReq = results.map((r) => ({
      documents: [r],
      document_type: "POST",
    }));

    const documentsWithVotes: Array<any> = (await fetchUserVote(
      formattedReq
    )) as Array<any>;

    const userVoteMap = documentsWithVotes.reduce((map, uniDoc) => {
      const docs = get(uniDoc, "documents", []);
      const post: any = docs[0];

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

    const documentsWithVotes: Array<any> = (await fetchUserVote(
      formattedReq
    )) as Array<any>;

    const userVoteMap = documentsWithVotes.reduce((map, doc) => {
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

  const loadMoreResults = () => {
    setIsLoadingMore(true);

    fetchURL(nextResultsUrl)
      .then((res: any) => {
        setResults([...results, ...res.results]);
        setNextResultsUrl(res.next);
        setNumOfHits(res.count);

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

  const handleSearchFilterChange = (filterType: FilterType, value: any) => {
    const query = {
      ...router.query,
    };

    if (filterType === "citation_percentile") {
      query["citation_percentile__gte"] = value;
    } else if (filterType === "publication_year") {
      query["paper_publish_year__gte"] = value[0];
      query["paper_publish_year__lte"] = value[1];
    } else if (
      filterType === "hub" ||
      filterType === "journal" ||
      filterType === "ordering" ||
      filterType === "license"
    ) {
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

  return (
    <SearchFiltersContextProvider>
      <div>
        {context !== "best-results" && (
          <Fragment>
            <div className={css(styles.resultCount)}>
              {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
            </div>
            <div className={css(styles.filters)}>
              <SearchFilters
                searchFacets={apiResponse?.facets}
                onChange={handleSearchFilterChange}
                forEntityType={entityType}
              />
            </div>
            <AppliedFilters />
          </Fragment>
        )}

        {numOfHits === 0 && (
          <EmptyFeedScreen title="There are no results found for this criteria" />
        )}

        <div>
          {entityType === "post" &&
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
          {entityType === "paper" &&
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
  resultCount: {
    color: colors.GREY(),
    marginBottom: 20,
  },
  filters: {
    display: "flex",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 10,
    },
  },
  highlight: {
    color: colors.ORANGE_DARK(1.0),
  },
});

export default SearchResultsForDocs;
