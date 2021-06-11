import { useState, useCallback } from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import { debounce } from "underscore";
import { css, StyleSheet } from "aphrodite";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";

const AlgoliaSearchBox = ({
  refine,
  onChange,
  delay = 500,
  mobile = false,
}) => {
  const [currentQuery, setCurrentQuery] = useState("");

  // README: Optimization to ensure Algolia isn't called too often.
  // Removing this may result in Algolia being hit on every key stroke which
  // may put us over quota.
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
        className={css(
          styles.searchInput,
          mobile && styles.searchInputForMobile
        )}
        value={currentQuery}
        onChange={handleChange}
        placeholder="Search..."
      />
      <span
        className={css(styles.searchIcon, mobile && styles.searchIconForMobile)}
      >
        {icons.search}
      </span>
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
  searchInputForMobile: {
    padding: 16,
    marginBottom: 0,
    outline: "none",
    boxShadow: "none",
    ":focus": {
      border: 0,
      ":hover": {
        boxShadow: "none",
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
  searchIconForMobile: {
    right: 14,
    top: 14,
    opacity: 0.8,
  },
});

AlgoliaSearchBox.propTypes = {
  refine: PropTypes.func.isRequired,
  delay: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
};

export default connectSearchBox(AlgoliaSearchBox);
