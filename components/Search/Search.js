import { useState, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { get } from "lodash";

const Search = ({}) => {
  const router = useRouter();
  const [query, setQuery] = useState(get(router, "query.search") || "");

  const handleSearch = () => {
    const queryParams = {
      ...router.query,
      search: query,
    };

    const isUserOnSearchPage = router.pathname.indexOf("/search") === 0;

    if (!isUserOnSearchPage) {
      queryParams.type = "paper";
    }

    router.push({
      pathname: "/search/[type]",
      query: queryParams,
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

  useEffect(() => {
    router.events.on("routeChangeComplete", (url) => {
      if (!url.includes("/search")) {
        setQuery("");
      }
    });
  }, []);

  return (
    <div className={css(styles.search)}>
      <span className={css(styles.searchIcon)} onClick={handleSearch}>
        {icons.search}
      </span>
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
  searchIcon: {
    position: "absolute",
    cursor: "text",
    opacity: 0.4,
    cursor: "pointer",
    zIndex: 2,
    top: 5,
    right: 6,
    borderRadius: 6,
    padding: "4px 7px",
    ":hover": {
      background: "rgb(146 145 145 / 50%)",
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
    fontSize: 14,
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
