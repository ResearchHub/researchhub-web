import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useState, useEffect, Fragment } from "react";

import { fetchURL } from "~/config/fetch";
import HubCard from "~/components/Hubs/HubCard";
import colors from "~/config/themes/colors";
import SearchEmpty from "~/components/Search/SearchEmpty";
import LoadMoreButton from "~/components/LoadMoreButton";
import { breakpoints } from "~/config/themes/screen";

const SearchResultsForHubs = ({ apiResponse, context }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextResultsUrl, setNextResultsUrl] = useState(null);
  const [numOfHits, setNumOfHits] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(get(apiResponse, "results", []));
    setNextResultsUrl(get(apiResponse, "next", null));
    setNumOfHits(get(apiResponse, "count", 0));
  }, [apiResponse]);

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

  return (
    <div id="SearchResultsForHubs">
      {numOfHits > 0 && (
        <Fragment>
          {context !== "best-results" && (
            <div className={css(styles.resultCount)}>
              {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
            </div>
          )}
          <div>
            {results.map((hub) =>
              context === "best-results" ? (
                <div className={css(styles.hubCardWrapper)} key={hub.id}>
                  <HubCard
                    hub={hub}
                    cardStyle={styles.hubCard}
                    descriptionStyle={styles.hubDescription}
                    metadataStyle={styles.metadataStyle}
                  />
                </div>
              ) : (
                <div className={css(styles.hubCardWrapper)} key={hub.id}>
                  <HubCard key={hub.id} hub={hub} renderAsRow={true} />
                </div>
              )
            )}
          </div>
        </Fragment>
      )}
      {numOfHits === 0 && <SearchEmpty />}

      {nextResultsUrl && (
        <LoadMoreButton onClick={loadMoreResults} isLoading={isLoadingMore} />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  resultCount: {
    color: colors.GREY(),
    marginBottom: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: "3vmin",
    },
  },
  hubCardWrapper: {
    // marginBottom: 15,
  },
  hubCard: {
    border: 0,
    height: "auto",
    minHeight: 50,
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
  },
  hubDescription: {
    height: "auto",
    marginTop: 10,
    fontSize: 14,
  },
  metadataStyle: {
    marginTop: 20,
    borderTop: "none",
  },
});

SearchResultsForHubs.propTypes = {
  apiResponse: PropTypes.object,
  context: PropTypes.oneOf(["best-results"]),
};

export default SearchResultsForHubs;
