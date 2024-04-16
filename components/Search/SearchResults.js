import { useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import SearchResultsForDocs from "~/components/Search/SearchResultsForDocs";
import SearchResultsForHubs from "~/components/Search/SearchResultsForHubs";
import SearchResultsForPeople from "~/components/Search/SearchResultsForPeople";
import SearchBestResults from "~/components/Search/SearchBestResults";
import ComponentWrapper from "~/components/ComponentWrapper";
import { breakpoints } from "~/config/themes/screen";
import { hasNoSearchResults, QUERY_PARAM } from "~/config/utils/search";
import { trackEvent } from "~/config/utils/analytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrid2,
  faSquarePen,
  faStar,
  faUser,
} from "@fortawesome/pro-solid-svg-icons";
import { PostIcon, PaperIcon } from "~/config/themes/icons";

const SearchResults = ({ apiResponse }) => {
  const router = useRouter();
  const searchType = get(router, "query.type");
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    trackEvent({
      eventType: "search_results_viewed",
      vendor: "amp",
      user: get(auth, "isLoggedIn") ? auth.user : null,
      data: {
        searchType,
        query: router.query[QUERY_PARAM],
      },
    });

    if (apiResponse && hasNoSearchResults({ searchType, apiResponse })) {
      trackEvent({
        eventType: "search_no_results",
        vendor: "amp",
        user: get(auth, "isLoggedIn") ? auth.user : null,
        data: {
          searchType,
          query: router.query[QUERY_PARAM],
        },
      });
    }
  }, [apiResponse]);

  const handleTabClick = (tab) => {
    const updatedQuery = {
      ...router.query,
      type: tab.type,
    };

    router.push({
      pathname: "/search/[type]",
      query: updatedQuery,
    });
  };

  const renderEntityTabs = () => {
    let tabs = [
      {
        type: "all",
        label: "Best Results",
        icon: <FontAwesomeIcon icon={faStar} />,
      },
      {
        type: "paper",
        label: "Papers",
        icon: <PaperIcon withAnimation={false} onClick={undefined} />,
      },
      {
        type: "post",
        label: "Posts",
        icon: <FontAwesomeIcon icon={faSquarePen} />,
      },
      { type: "hub", label: "Hubs", icon: <FontAwesomeIcon icon={faGrid2} /> },
      {
        type: "person",
        label: "People",
        icon: <FontAwesomeIcon icon={faUser} />,
      },
    ];

    tabs = tabs.map((t) => {
      t.isSelected = t.type === router.query.type ? true : false;
      return t;
    });

    return (
      <HorizontalTabBar
        id="tabBarForSearch"
        tabs={tabs}
        onClick={handleTabClick}
        dragging={true}
        showArrowsOnWidth={breakpoints.xsmall.int}
      />
    );
  };

  return (
    <ComponentWrapper overrideStyle={styles.componentWrapper}>
      <div className={css(styles.tabsWrapper)}>{renderEntityTabs()}</div>

      {searchType === "paper" || searchType === "post" ? (
        <SearchResultsForDocs
          apiResponse={apiResponse}
          entityType={searchType}
        />
      ) : searchType === "hub" ? (
        <SearchResultsForHubs apiResponse={apiResponse} />
      ) : searchType === "person" ? (
        <SearchResultsForPeople apiResponse={apiResponse} />
      ) : searchType === "all" ? (
        <SearchBestResults apiResponse={apiResponse} />
      ) : null}
    </ComponentWrapper>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    marginTop: 40,
    marginBottom: 20,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 10,
    },
  },
  tabsWrapper: {
    marginBottom: 50,
    width: "95%",
  },
});

SearchResults.propTypes = {
  apiResponse: PropTypes.object,
};

export default SearchResults;
