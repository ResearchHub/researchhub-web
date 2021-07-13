import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useState, useEffect, Fragment } from "react";
import Ripples from "react-ripples";

import { fetchURL } from "~/config/fetch";
import HubCard from "~/components/Hubs/HubCard";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import colors from "~/config/themes/colors";
import SearchEmpty from "~/components/Search/SearchEmpty";
import LoadMoreButton from "~/components/LoadMoreButton";
import { breakpoints } from "~/config/themes/screen";

const SearchResultsForHubs = ({ apiResponse }) => {
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
    <div>
      {numOfHits > 0 && (
        <Fragment>
          <div className={css(styles.resultCount)}>
            {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
          </div>
          <div className={css(styles.grid)}>
            {results.map((hub, index) => {
              return <HubCard key={hub.id} hub={hub} />;
            })}
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
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "left",
    marginBottom: 30,
    gap: 0,
    "::after": {
      content: "",
      flex: "auto",
    },
    [`@media only screen and (max-width: ${breakpoints.small.medium})`]: {
      gap: 10,
    },
  },
});

SearchResultsForHubs.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResultsForHubs;
