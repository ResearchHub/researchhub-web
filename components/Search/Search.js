import { useState, useEffect, useRef, Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { get } from "lodash";
import { breakpoints } from "~/config/themes/screen";

const Search = ({ navbarRef }) => {
  const SMALL_PLACEHOLDER_WIDTH = 200;
  const RETURN_KEY = 13;
  const SMALLEST_ALLOWED_INPUT = 180;
  const DEFAULT_EXPANDED_SEARCH_HEIGHT = 66;

  const router = useRouter();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [query, setQuery] = useState(get(router, "query.search") || "");
  const [isSmallScreenSearch, setIsSmallScreenSearch] = useState(false);
  const [isExpandedSearchOpen, setIsExpandedSearchOpen] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Search Research Hub");

  useEffect(() => {
    updateSearchLayout();

    const isUserOnSearchPage = router.pathname.indexOf("/search") === 0;

    if (shouldShowSmallScreenSearch()) {
      setIsSmallScreenSearch(true);

      if (isUserOnSearchPage) {
        setIsExpandedSearchOpen(true);
        focusInput();
      }
    }

    window.addEventListener("resize", updateSearchLayout, true);

    return () => {
      window.removeEventListener("resize", updateSearchLayout, true);
    };
  }, []);

  const focusInput = () => {
    const el = get(searchInputRef, "current");

    if (el) {
      const val = el.value;

      // Focus at end of input
      el.focus();
      el.value = "";
      el.value = val;
    }
  };

  const shouldShowSmallScreenSearch = () => {
    const inputWidth = searchInputRef.current.offsetWidth;

    if (window.innerWidth <= breakpoints.small.int) {
      return true;
    } else if (inputWidth <= SMALLEST_ALLOWED_INPUT) {
      return true;
    } else {
      return false;
    }
  };

  // IN non-mobile resolutions (over 760px) we allow
  // the input field to render naturally. If it is smaller than
  // SMALLEST_ALLOWED_INPUT, we also consider it to be "small screen"
  const updateSearchLayout = () => {
    const inputWidth = searchInputRef.current.offsetWidth;

    if (shouldShowSmallScreenSearch()) {
      setIsSmallScreenSearch(true);
    } else {
      setIsSmallScreenSearch(false);
    }

    setPlaceholderText(
      inputWidth <= SMALL_PLACEHOLDER_WIDTH ? "Search" : "Search Research Hub"
    );
  };

  const toggleExpandedSearch = (isOpen) => {
    if (isExpandedSearchOpen) {
      setIsExpandedSearchOpen(false);
    } else {
      setIsExpandedSearchOpen(true);
      focusInput();
    }
  };

  const handleSearchBtnClick = () => {
    if (isSmallScreenSearch) {
      if (isExpandedSearchOpen) {
        doSearch();
      } else {
        toggleExpandedSearch();
      }
    } else {
      doSearch();
    }
  };

  const doSearch = () => {
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
    if (e.keyCode === RETURN_KEY) {
      doSearch();
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

  const searchContainerProps = {
    ref: searchContainerRef,
    className: css(
      styles.search,
      isSmallScreenSearch && styles.searchSmallScreen,
      isExpandedSearchOpen && styles.searchExpanded
    ),
  };

  // Since expanded search is absolute, we want to dynamically
  // set the height to be based on Navbar element.
  if (isExpandedSearchOpen) {
    const navHeight = get(navbarRef, "current.offsetHeight");
    searchContainerProps.style = {
      height: navHeight || DEFAULT_EXPANDED_SEARCH_HEIGHT,
    };
  }

  return (
    <div {...searchContainerProps}>
      {isExpandedSearchOpen && (
        <Fragment>
          <span className={css(styles.backIcon)} onClick={toggleExpandedSearch}>
            {icons.longArrowLeft}
          </span>
        </Fragment>
      )}

      <input
        className={css(
          styles.searchInput,
          isSmallScreenSearch && styles.searchInputSmallScreen,
          isExpandedSearchOpen && styles.searchInputExpanded
        )}
        placeholder={placeholderText}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        value={query}
        ref={searchInputRef}
      />

      <span
        className={css(
          styles.searchIcon,
          isSmallScreenSearch && styles.searchIconSmallScreen,
          isExpandedSearchOpen && styles.searchIconExpanded
        )}
        onClick={handleSearchBtnClick}
      >
        {icons.search}
      </span>
    </div>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "100%",
    maxWidth: 600,
    boxSizing: "border-box",
    background: "white",
    border: `${colors.GREY()} 1px solid`,
    display: "flex",
    alignItems: "center",
    position: "relative",
    ":hover": {
      borderColor: colors.BLUE(),
    },
  },
  searchSmallScreen: {
    width: "auto",
    border: 0,
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "column",
    ":hover": {
      borderColor: 0,
    },
  },
  searchExpanded: {
    border: "unset",
    position: "absolute",
    width: "100%",
    zIndex: 10,
    maxWidth: "unset",
    paddingLeft: 20,
    left: 0,
    flexDirection: "row",
    boxShadow: `inset 0px 0px 0px 1px ${colors.BLUE()}`,
  },
  backIcon: {
    color: colors.BLUE(),
    fontSize: 28,
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    flexDirection: "column",
    height: "100%",
  },
  searchIcon: {
    position: "absolute",
    cursor: "pointer",
    opacity: 0.4,
    zIndex: 2,
    top: 5,
    right: 6,
    borderRadius: 6,
    padding: "4px 7px",
    ":hover": {
      background: "rgb(146 145 145 / 50%)",
    },
  },
  searchIconSmallScreen: {
    position: "static",
    fontSize: 18,
    opacity: 1,
    marginRight: 20,
    ":hover": {
      background: 0,
    },
    [`@media only screen and (min-width: ${breakpoints.small.int + 1}px)`]: {
      fontSize: 20,
      marginRight: 10,
      opacity: 0.4,
    },
  },
  searchIconExpanded: {
    fontSize: 24,
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom: 0,
    flexDirection: "column",
    height: "100%",
    position: "static",
    background: 0,
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
      boxShadow: `0px 0px 1px 1px ${colors.BLUE()}`,
    },
    ":focus": {
      boxShadow: `0px 0px 1px 1px ${colors.BLUE()}`,
      ":hover": {
        boxShadow: `0px 0px 1px 1px ${colors.BLUE()}`,
        cursor: "text",
      },
    },
  },
  searchInputSmallScreen: {
    padding: 0,
    height: 0,
    ":focus": {
      boxShadow: "none",
      ":hover": {
        boxShadow: "none",
      },
    },
  },
  searchInputExpanded: {
    padding: 10,
    height: "100%",
    fontSize: 18,
    paddingLeft: 20,
    ":focus": {
      boxShadow: "none",
      ":hover": {
        boxShadow: "none",
      },
    },
    ":hover": {
      boxShadow: "none",
    },
  },
});

export default Search;
