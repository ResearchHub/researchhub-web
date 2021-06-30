import { useState, useEffect, useRef } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { get } from "lodash";

const MAX = 130;

const Search = ({}) => {
  const router = useRouter();
  const searchInputRef = useRef(null);

  const [query, setQuery] = useState(get(router, "query.search") || "");
  const [isSmallScreenSearch, setIsSmallScreenSearch] = useState(false);
  const [isExpandedSearchOn, setIsExpandedSearchOn] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", calcForSmallScreen, true);

    return () => {
      window.removeEventListener("resize", calcForSmallScreen, true);
    };
  }, []);

  const calcForSmallScreen = () => {
    if (get(searchInputRef, "current.offsetWidth") <= MAX) {
      setIsSmallScreenSearch(true);
    }
  };

  const toggleExpandedSearch = () => {
    setIsExpandedSearchOn(!isExpandedSearchOn);
  };

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
      // Reset the query if user navigates to non-search page.
      if (!url.includes("/search")) {
        setQuery("");
      }
    });
  }, []);

  if (isSmallScreenSearch) {
    return (
      <div
        className={css(
          styles.search,
          styles.searchSmallScreen,
          isExpandedSearchOn && styles.searchExpanded
        )}
      >
        <span className={css(styles.backIcon)} onClick={toggleExpandedSearch}>
          {icons.longArrowLeft}
        </span>
        <span
          className={css(styles.searchIcon, styles.searchIconSmallScreen)}
          onClick={toggleExpandedSearch}
        >
          {icons.search}
        </span>

        {isExpandedSearchOn && (
          <input
            className={css(styles.searchInput, styles.searchInputExpanded)}
            placeholder={"Search Research Hub"}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            value={query}
            ref={searchInputRef}
          />
        )}
      </div>
    );
  }

  return (
    <div className={css(styles.search)}>
      <span className={css(styles.searchIcon)} onClick={handleSearch}>
        {icons.search}
      </span>
      <input
        className={css(styles.searchInput)}
        placeholder={"Search Research Hub"}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        value={query}
        ref={searchInputRef}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "100%",
    maxWidth: 600,
    boxSizing: "border-box",
    background: "white",
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
  searchExpanded: {
    border: "unset",
    background: "#ffd8d8",
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 10,
    maxWidth: "unset",
    paddingLeft: 20,
  },
  backIcon: {
    color: colors.BLUE(),
    fontSize: 28,
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
  searchIconSmallScreen: {},
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
  searchInputExpanded: {
    fontSize: 18,
  },
});

Search.propTypes = {};

export default Search;
