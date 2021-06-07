import React, { useState, useCallback } from "react";
import { InstantSearch, Hits, connectSearchBox } from "react-instantsearch-dom";
import { debounce } from "underscore";
import { css, StyleSheet } from "aphrodite";
import icons from "~/config/themes/icons";

const AlgoliaSearchBox = ({ refine, delay, onChange }) => {
  const [currentQuery, setCurrentQuery] = useState("");

  const doSearch = useCallback(debounce((value) => refine(value), delay), []);

  const handleChange = (event) => {
    const newQuery = event.currentTarget.value;

    setCurrentQuery(newQuery);
    doSearch(newQuery);
    onChange(newQuery);
  };

  return (
    <div className={css(styles.searchBox)}>
      <input
        className={css(styles.searchInput)}
        value={currentQuery}
        onChange={handleChange}
        placeholder="Search..."
      />
      <span className={css(styles.searchIcon)}>{icons.search}</span>
    </div>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    width: "100%",
  },
  searchInput: {
    padding: 10,
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 16,
    position: "relative",
    cursor: "pointer",
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        boxShadow: "0px 0px 1px 1px #3f85f7",
        cursor: "text",
      },
    },
  },
  searchIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    cursor: "text",
    opacity: 0.4,
  },
});

export default connectSearchBox(AlgoliaSearchBox);
