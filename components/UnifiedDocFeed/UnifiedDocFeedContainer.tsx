import { css, StyleSheet } from "aphrodite";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
  silentEmptyFnc,
} from "../../config/utils/nullchecks";
import { formatMainHeader } from "./UnifiedDocFeedUtil";
import { NextRouter, useRouter } from "next/router";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";
import { connect } from "react-redux";
import { getDocumentCard } from "./utils/getDocumentCard";
import { ReactElement, useEffect, useMemo, useState, useRef } from "react";
import colors from "../../config/themes/colors";
import CreateFeedBanner from "../Home/CreateFeedBanner";
import EmptyFeedScreen from "../Home/EmptyFeedScreen";
import FeedBlurWithButton from "./FeedBlurWithButton";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import Loader from "../Loader/Loader";
import Ripples from "react-ripples";
import UnifiedDocFeedCardPlaceholder from "./UnifiedDocFeedCardPlaceholder";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import { id } from "ethers/lib/utils";

type PaginationInfo = {
  hasMore: Boolean;
  isLoading: Boolean;
  isLoadingMore: Boolean;
  page: number;
};

const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.type;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

const getFetchParams = ({
  // see: NOTE (100)
  bePage,
  hubID,
  isLoggedIn,
  isOnMyHubsTab,
  localPage,
  setPaginationInfo,
  setUnifiedDocuments,
}): any => ({
  hubID,
  isLoggedIn,
  onSuccess: ({ page: updatedPage, documents }): void => {
    setUnifiedDocuments(documents);
    setPaginationInfo({
      isLoading: false,
      isLoadingMore: false,
      page: updatedPage,
    });
  },
  onError: (error: Error): void => {
    emptyFncWithMsg(error);
    setPaginationInfo({
      isLoading: false,
      isLoadingMore: false,
      page: bePage,
    });
  },
  subscribedHubs: isOnMyHubsTab,
  page: localPage,
});

function UnifiedDocFeedContainer({
  auth, // redux
  feed,
  home: isHomePage,
  hub, // selected hub
  hubName,
  hubState, // hub data of current user
  preloadedDocData, // Loaded on the server via getInitialProps on full page load
  isLoggedIn,
  loggedIn,
  subscribeButton,
}): ReactElement<"div"> {
  const { results: preloadResults } = preloadedDocData || {};
  const router = useRouter();
  const routerFilterType = getFilterFromRouter(router);
  const isOnMyHubsTab = useMemo<Boolean>(
    (): Boolean => ["/my-hubs"].includes(router.pathname),
    [router.pathname]
  );

  const [docTypeFilter, setDocTypeFilter] = useState<string>(routerFilterType);

  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });
  const { filterBy } = subFilters;

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasMore: isNullOrUndefined(preloadResults?.next),
    isLoading: isNullOrUndefined(preloadResults),
    isLoadingMore: false,
    page: 1,
  });
  /* NOTE (100): paginationInfo (BE) increments by 20 items. 
  localPage is used to increment by 10 items for UI optimization */
  const { page, isLoading, isLoadingMore } = paginationInfo;
  const [localPage, setLocalPage] = useState<number>(1);
  const [unifiedDocuments, setUnifiedDocuments] = useState<any>(
    preloadResults || []
  );
  const shouldPrefetch = page * 2 === localPage;
  const fetchParams = getFetchParams({
    bePage: page,
    hubID: hub?.id ?? null,
    isLoggedIn,
    isOnMyHubsTab,
    localPage,
    setPaginationInfo,
    setUnifiedDocuments,
  });

  useEffect((): void => {
    setLocalPage(1);
    fetchUnifiedDocs({
      ...fetchParams,
      docTypeFilter,
      page: 1 /* when hubs or docType changes, start from page 1 */,
    });
  }, [docTypeFilter, hub]);

  const hasSubscribed = useMemo(
    (): Boolean => auth.authChecked && hubState.subscribedHubs.length > 0,
    [auth.authChecked, hubState.subscribedHubs]
  );

  const formattedMainHeader = useMemo(
    (): string =>
      formatMainHeader({
        feed,
        filterBy,
        hubName,
        isHomePage,
      }),
    [hubName, feed, filterBy, isHomePage]
  );

  const handleLoadMore = (): void => {
    const newLocalPage = page;
    if (shouldPrefetch) {
    }
  };

  const handleDocTypeChange = (docTypeValue: string): void => {
    setDocTypeFilter(docTypeValue);

    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, type: docTypeValue },
      },
      router.pathname + `?type=${docTypeValue}`
    );
  };

  const handleFilterSelect = (_type: string, filterBy: any): void => {
    const updatedSubFilters = { filterBy, scope: subFilters.scope };
    setSubFilters(updatedSubFilters);
  };

  const handleScopeSelect = (_type: string, scope: any): void => {
    const updatedSubFilters = { filterBy: subFilters.filterBy, scope };
    setSubFilters(updatedSubFilters);
  };

  const docTypeFilterButtons = useMemo(() => {
    return Object.keys(UnifiedDocFilters).map(
      (filterKey: string): ReactElement<typeof UnifiedDocFeedFilterButton> => {
        const filterValue = UnifiedDocFilters[filterKey];
        return (
          <div className={css(styles.feedButtonContainer)}>
            <UnifiedDocFeedFilterButton
              isActive={docTypeFilter === filterValue}
              key={filterKey}
              label={UnifiedDocFilterLabels[filterKey]}
              onClick={() => handleDocTypeChange(filterValue)}
            />
          </div>
        );
      }
    );
  }, [docTypeFilter, router]);

  const renderableUniDoc = unifiedDocuments.slice(0, localPage * 10);
  const cards = getDocumentCard({
    hasSubscribed,
    isLoggedIn,
    isOnMyHubsTab,
    setUnifiedDocuments,
    unifiedDocumentData: renderableUniDoc,
  });

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title) + " clamp2"}>{formattedMainHeader}</h1>
        {isHomePage ? null : (
          <div className={css(styles.subscribeContainer)}>
            {hub && subscribeButton}
          </div>
        )}
        <div className={css(styles.subFilters)}>
          <UnifiedDocFeedSubFilters
            onSubFilterSelect={handleFilterSelect}
            onScopeSelect={handleScopeSelect}
            subFilters={subFilters}
          />
        </div>
      </div>
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>{docTypeFilterButtons}</div>
      </div>
      {!hasSubscribed ? (
        <div>
          <div className={css(styles.bannerContainer)} id="create-feed-banner">
            {/* @ts-ignore */}
            <CreateFeedBanner loggedIn={loggedIn} />
          </div>
        </div>
      ) : null}
      {isLoading ? (
        <div className={css(styles.initPlaceholder)}>
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
        </div>
      ) : (
        <div className={css(styles.feedPosts)}>
          <FeedBlurWithButton />
          {cards.length > 0 ? cards : <EmptyFeedScreen />}
        </div>
      )}
      {/* if not Loggedin & trying to view "My Hubs", redirect them to "All" */}
      {!isLoggedIn && isOnMyHubsTab ? null : (
        <div className={css(styles.loadMoreWrap)}>
          {isLoadingMore ? (
            <Loader
              key={"authored-loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          ) : nextResultSet.length > 0 ? (
            <Ripples
              className={css(styles.loadMoreButton)}
              onClick={handleLoadMore}
            >
              {"Load More"}
            </Ripples>
          ) : null}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  hubState: state.hubs,
  allHubs: state.hubs.hubs,
  isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(UnifiedDocFeedContainer);

const styles = StyleSheet.create({
  unifiedDocFeedContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    "@media only screen and (min-width: 1200px)": {
      paddingLeft: 28,
      paddingRight: 28,
    },
    "@media only screen and (max-width: 990px)": {
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  buttonGroup: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    marginBottom: 16,
    overflow: "auto",
  },
  mainFilters: {
    alignItems: "center",
    display: "flex",
    height: "inherit",
    width: "100%",
  },
  feedButtonContainer: {
    marginRight: 24,
  },
  subFilters: {
    alignItems: "center",
    display: "flex",
    height: "inherit",
    marginLeft: "auto",

    "@media only screen and (max-width: 767px)": {
      width: "100%",
      marginTop: 16,
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
  title: {
    color: "#241F3A",
    // width: "100%",
    fontWeight: 400,
    fontSize: 30,
    padding: 0,
    margin: 0,
    textOverflow: "ellipsis",

    "@media only screen and (max-width: 1149px)": {
      fontSize: 30,
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 25,
      textAlign: "center",
      justifyContent: "center",
      whiteSpace: "pre-wrap",
      wordBreak: "normal",
      display: "flex",
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  subscribeContainer: {
    marginLeft: 16,
    minWidth: 100,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  loadMoreButton: {
    fontSize: 14,
    border: `1px solid ${colors.BLUE()}`,
    boxSizing: "border-box",
    borderRadius: 4,
    height: 45,
    width: 155,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.BLUE(),
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      color: "#FFF",
      backgroundColor: colors.BLUE(),
    },
  },
  loadMoreWrap: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    margin: "8px 0 16px",
  },
  initPlaceholder: {
    alignContent: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  bannerContainer: {
    marginBottom: 16,
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
    "@media only screen and (max-width: 415px)": {
      padding: 0,
      width: "100%",
    },
  },
  feedPosts: {
    position: "relative",
    minHeight: 200,
  },
  tabFeature: {
    marginLeft: 8,
    width: 38,
  },
  hypoFeedButton: {
    alignItems: "center",
    display: "flex",
    marginRight: 24,
  },
});
