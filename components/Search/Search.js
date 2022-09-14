import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { pickFiltersForApp, QUERY_PARAM } from "~/config/utils/search";
import { trackEvent } from "~/config/utils/analytics";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, Fragment } from "react";
import colors from "~/config/themes/colors";
import get from "lodash/get";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";

const Search = ({ navbarRef, id, overrideStyle }) => {
  const RETURN_KEY = 13;

  const router = useRouter();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const auth = useSelector((state) => state.auth);

  const [query, setQuery] = useState(get(router, `query.${QUERY_PARAM}`) || "");
  const [placeholderText, setPlaceholderText] = useState("Search");
  const [currentPath, setCurrentPath] = useState(router.pathname);

  useEffect(() => {
    router.events.on("routeChangeComplete", (url) => {
      setCurrentPath(window.location.pathname);
    });
  }, []);

  useEffect(() => {
    const isUserOnSearchPage = currentPath.includes("/search");
    if (isUserOnSearchPage) {
      setQuery(router.query[QUERY_PARAM]);
    } else {
      setQuery("");
    }
  }, [currentPath]);

  const doSearch = () => {
    const isUserOnSearchPage = currentPath.includes("/search");
    const currentSearchType = isUserOnSearchPage ? router.query.type : "all";

    const filterParams = pickFiltersForApp({
      searchType: currentSearchType,
      query: router.query,
    });

    const queryParams = {
      ...filterParams,
      [QUERY_PARAM]: query,
      type: currentSearchType,
    };

    router.push({
      pathname: "/search/[type]",
      query: queryParams,
    });

    blurAndCloseDeviceKeyboard();
    trackEvent({
      eventType: "search_query_submitted",
      vendor: "amp",
      user: get(auth, "isLoggedIn") ? auth.user : null,
      data: {
        query,
      },
    });
  };

  const blurAndCloseDeviceKeyboard = () => {
    document.activeElement.blur();
    const el = get(searchInputRef, "current");

    if (el) {
      el.blur();
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === RETURN_KEY) {
      doSearch();
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const searchContainerProps = {
    ref: searchContainerRef,
    className: css(styles.search, overrideStyle && overrideStyle),
  };

  return (
    <div {...searchContainerProps} id={id}>
      <input
        className={css(styles.searchInput)}
        placeholder={placeholderText}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        value={query || ""}
        ref={searchInputRef}
        type="text"
      />
      <div className={css(styles.searchIcon)} onClick={doSearch}>
        {icons.search}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "100%",
    borderRadius: 4,
    boxSizing: "border-box",
    background: "white",
    border: `1px solid rgba(151, 151, 151, 0.2)`,
    display: "flex",
    alignItems: "center",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      width: "auto",
    },
  },
  searchIcon: {
    boxSizing: "border-box",
    cursor: "pointer",
    opacity: 0.4,
    position: "absolute",
    right: 6,
    top: 8,
    fontSize: 16,
    zIndex: 2,
  },
  searchInput: {
    background: colors.GREY_ICY_BLUE_HUE,
    border: "none",
    boxSizing: "border-box",
    cursor: "pointer",
    fontSize: 16,
    height: "100%",
    height: 32,
    outline: "none",
    padding: 10,
    position: "relative",
    width: "100%",
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
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
    "::placeholder": {
      opacity: 0.6,
    },
  },
});

Search.propTypes = {
  navbarRef: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default Search;
