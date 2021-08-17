import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useState, useEffect, Fragment } from "react";
import Ripples from "react-ripples";

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
            {results.map((hub, index) =>
              context === "best-results" ? (
                <HubCard
                  key={hub.id}
                  hub={hub}
                  renderAsRow={true}
                  styleVariation="noBorderVariation"
                />
              ) : (
                <HubCard key={hub.id} hub={hub} renderAsRow={true} />
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
});

SearchResultsForHubs.propTypes = {
  apiResponse: PropTypes.object,
  context: PropTypes.oneOf(["best-results"]),
};

export default SearchResultsForHubs;
