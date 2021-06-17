import { useState, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { get } from "lodash";

const Search = ({}) => {
  const router = useRouter();
  const [query, setQuery] = useState(get(router, "query.query") || "");

  const handleSearch = () => {
    router.push({
      pathname: "/search/papers",
      query: { query },
    });
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {}, []);

  return (
    <div className={css(styles.search)}>
      <input
        className={css(styles.searchbar, styles.searchInput)}
        placeholder={"Search Research Hub"}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        value={query}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "100%",
    maxWidth: 600,
    boxSizing: "border-box",
    background: "#FBFBFD",
    border: "#E8E8F2 1px solid",
    display: "flex",
    alignItems: "center",
    position: "relative",
    ":hover": {
      borderColor: colors.BLUE(),
    },
    "@media only screen and (max-width: 1024px)": {
      display: "none",
    },
  },
  searchForMobile: {
    margin: "0 auto",
    marginBottom: 15,
    "@media only screen and (max-width: 1024px)": {
      display: "flex",
    },
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      borderRadius: 10,
      maxWidth: "unset",
    },
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
});

Search.propTypes = {};

export default Search;
