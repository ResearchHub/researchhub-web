import { useState, useEffect, useRef } from "react";
import { css, StyleSheet } from "aphrodite";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-dom";
import AlgoliaSearchResults from "~/components/Search/AlgoliaSearchResults";
import AlgoliaSearchBox from "~/components/Search/AlgoliaSearchBox";
import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from "~/config/constants";
import colors from "~/config/themes/colors";
import PropTypes from "prop-types";
import { get } from "lodash";
import { getCurrServerEnv } from "~/config/utils";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const AlgoliaSearch = ({ mobile }) => {
  const dropdownRef = useRef(null);
  const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
  const papersIndex = `papers_${getCurrServerEnv()}`;

  const handleBackgroundClick = (e) => {
    const dropdownEl = get(dropdownRef, "current");

    if (dropdownEl && !dropdownEl.contains(e.target)) {
      setShouldShowDropdown(false);
    }
  };

  const handleResultClick = (e) => {
    setShouldShowDropdown(false);
  };

  const handleSearch = (query) => {
    if (query && !shouldShowDropdown) {
      setShouldShowDropdown(true);
    } else if (!query && shouldShowDropdown) {
      setShouldShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleBackgroundClick);

    return () => {
      document.removeEventListener("click", handleBackgroundClick);
    };
  }, []);

  return (
    <div
      className={css(styles.search, mobile && styles.searchForMobile)}
      ref={dropdownRef}
    >
      <InstantSearch indexName={papersIndex} searchClient={searchClient}>
        <AlgoliaSearchBox
          onChange={handleSearch}
          mobile={mobile}
          onReset={() => setShouldShowDropdown(false)}
        />

        {shouldShowDropdown && (
          <div
            className={css(
              styles.searchDropdown,
              mobile && styles.searchDropdownForMobile
            )}
          >
            <AlgoliaSearchResults handleResultClick={handleResultClick} />
          </div>
        )}
      </InstantSearch>
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
    "@media only screen and (max-width: 760px)": {
      display: "flex",
      borderRadius: 10,
      maxWidth: "unset",
    },
  },
  searchDropdown: {
    width: "150%",
    minWidth: 800,
    position: "absolute",
    zIndex: 10,
    top: 55,
    maxHeight: 400,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    overflow: "scroll",
    padding: 16,
    boxSizing: "border-box",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    "@media only screen and (max-width: 760px)": {
      maxHeight: "80vh",
      top: 57,
    },
  },
  searchDropdownForMobile: {
    top: 40,
    width: "100%",
    minWidth: "unset",
  },
});

AlgoliaSearch.propTypes = {
  mobile: PropTypes.bool,
};

export default AlgoliaSearch;
