import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useState, useEffect } from "react";

import HubCard from "~/components/Hubs/HubCard";
import EmptyFeedScreen from "~/components/Home/EmptyFeedScreen";
import colors from "~/config/themes/colors";

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

  return (
    <div>
      <div className={css(styles.resultCount)}>
        {`${numOfHits} ${numOfHits === 1 ? "result" : "results"} found.`}
      </div>
      <div className={css(styles.grid)}>
        {results.map((hub, index) => {
          return <HubCard key={hub.id} hub={hub} />;
        })}
      </div>
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
    gap: 30,
    "::after": {
      content: "",
      flex: "auto",
    },
    "@media only screen and (max-width: 767px)": {
      gap: 10,
    },
  },
});

SearchResultsForHubs.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResultsForHubs;
