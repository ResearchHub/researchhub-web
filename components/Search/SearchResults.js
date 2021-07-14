import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useRouter } from "next/router";

import colors from "~/config/themes/colors";
import ComponentWrapper from "~/components/ComponentWrapper";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import SearchResultsForDocs from "~/components/Search/SearchResultsForDocs";
import SearchResultsForHubs from "~/components/Search/SearchResultsForHubs";
import SearchResultsForPeople from "~/components/Search/SearchResultsForPeople";
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

  const componentWrapperStyles = [styles.componentWrapper];
  if (currentSearchType === "hub") {
    componentWrapperStyles.push(styles.componentWrapperForHubsResults);
  }

  return (
    <ComponentWrapper overrideStyle={componentWrapperStyles}>
      {renderEntityTabs()}
      {currentSearchType === "paper" || currentSearchType === "post" ? (
        <SearchResultsForDocs apiResponse={apiResponse} />
      ) : currentSearchType === "hub" ? (
        <SearchResultsForHubs apiResponse={apiResponse} />
      ) : currentSearchType === "person" ? (
        <SearchResultsForPeople apiResponse={apiResponse} />
      ) : null}
    </ComponentWrapper>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginTop: 40,
    marginBottom: 20,
  },
  componentWrapperForHubsResults: {
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      paddingLeft: 5,
      paddingRight: 5,
    },
  },
  tabContainer: {
    marginBottom: 40,
  },
});

SearchResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResults;
