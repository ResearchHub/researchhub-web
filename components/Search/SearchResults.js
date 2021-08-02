import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useRouter } from "next/router";

import colors from "~/config/themes/colors";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import SearchResultsForDocs from "~/components/Search/SearchResultsForDocs";
import SearchResultsForHubs from "~/components/Search/SearchResultsForHubs";
import SearchResultsForPeople from "~/components/Search/SearchResultsForPeople";
import SearchBestResults from "~/components/Search/SearchBestResults";
import { breakpoints } from "~/config/themes/screen";

const SearchResults = ({ apiResponse }) => {
  const router = useRouter();
  const currentSearchType = get(router, "query.type");

  const handleTabClick = (tab) => {
    const updatedQuery = {
      ...router.query,
      type: tab.type,
    };

    // User initiates a person search. Default to "user" person.
    if (tab.type === "person") {
      updatedQuery["person_types"] = "author";
    }

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

  const renderEntityTabs = () => {
    let tabs = [
      { type: "best", label: "Best Results" },
      { type: "paper", label: "Papers" },
      { type: "post", label: "Posts" },
      { type: "hub", label: "Hubs" },
      { type: "person", label: "People" },
    ];

    tabs = tabs.map((t) => {
      t.isSelected = t.type === router.query.type ? true : false;
      return t;
    });

    return (
      <HorizontalTabBar
        tabs={tabs}
        onClick={handleTabClick}
        containerStyle={styles.tabContainer}
      />
    );
  };

  return (
    <div className={css(styles.componentWrapper)}>
      {renderEntityTabs()}

      {currentSearchType === "paper" || currentSearchType === "post" ? (
        <SearchResultsForDocs apiResponse={apiResponse} />
      ) : currentSearchType === "hub" ? (
        <SearchResultsForHubs apiResponse={apiResponse} />
      ) : currentSearchType === "person" ? (
        <SearchResultsForPeople apiResponse={apiResponse} />
      ) : currentSearchType === "best" ? (
        <SearchBestResults apiResponse={apiResponse} />
      ) : null}
    </div>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginTop: 40,
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
    width: "95vw",
    maxWidth: `${breakpoints.large.str}`,
  },
  tabContainer: {
    marginBottom: 40,
  },
});

SearchResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResults;
