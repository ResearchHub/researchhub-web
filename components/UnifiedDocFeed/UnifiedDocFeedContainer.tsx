import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg, isEmpty } from "../../config/utils/nullchecks";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { formatMainHeader } from "./UnifiedDocFeedUtil";
import { getDocumentCard } from "./utils/getDocumentCard";
import UnifiedDocFeedMenu from "./UnifiedDocFeedMenu";
import {
  PaginationInfo,
  getFilterFromRouter,
  useEffectForceUpdate,
  useEffectPrefetchNext,
  getPaginationInfoFromServerLoaded,
  useEffectUpdateStatesOnServerChanges,
} from "./utils/UnifiedDocFeedUtil";
import { ReactElement, useMemo, useRef, useState } from "react";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";
import { useRouter } from "next/router";
import colors from "~/config/themes/colors";
import CreateFeedBanner from "../Home/CreateFeedBanner";
import EmptyFeedScreen from "../Home/EmptyFeedScreen";
import FeedBlurWithButton from "./FeedBlurWithButton";
import Loader from "../Loader/Loader";
import Ripples from "react-ripples";
import UnifiedDocFeedCardPlaceholder from "./UnifiedDocFeedCardPlaceholder";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { breakpoints } from "~/config/themes/screen";
import dynamic from "next/dynamic";
import { isServer } from "~/config/server/isServer";

const FeedInfoCard = dynamic(() => import("./FeedInfoCard"), {
  ssr: false,
});

function UnifiedDocFeedContainer({
  auth, // redux
  feed,
  home: isHomePage,
  hub, // selected hub
  hubName,
  hubState, // hub data of current user
  isLoggedIn,
  loggedIn,
  serverLoadedData, // Loaded on the server via getInitialProps on full page load
  subscribeButton,
}): ReactElement<"div"> {
  const router = useRouter();
  const routerPathName = router.pathname;
  const [docTypeFilter, setDocTypeFilter] = useState<string>(
    getFilterFromRouter(router)
  );
  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[1],
  });

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    getPaginationInfoFromServerLoaded(serverLoadedData)
  );
  const [unifiedDocuments, setUnifiedDocuments] = useState<any>(
    serverLoadedData?.results || []
  );
  const [docSetFetchedTime, setDocSetFetchedTime] = useState<number>(
    Date.now()
  );
  const [unifiedDocsLoading, setUnifiedDocsLoading] = useState(false);

  const { hasMore, isLoading, isLoadingMore, isServerLoaded, localPage, page } =
    paginationInfo;
  const isOnMyHubsTab = ["/my-hubs"].includes(routerPathName);
  const hubID = hub?.id ?? null;
  const fetchParamsWithoutCallbacks = {
    docTypeFilter: getBEUnifiedDocType(docTypeFilter),
    hubID,
    isLoggedIn,
    page,
    subFilters,
    subscribedHubs: isOnMyHubsTab,
    // V2 of hot score
    hotV2: router.query?.hot_v2 == 'true',
  };

  useEffectUpdateStatesOnServerChanges({
    setUnifiedDocuments,
    setPaginationInfo,
    routePath: routerPathName,
    serverLoadedData,
  });

  /* NOTE (100): paginationInfo (BE) increments by 20 items. localPage is used to increment by 10 items for UI optimization */
  const canShowLoadMoreButton = unifiedDocuments.length > localPage * 10;
  const shouldPrefetch = page * 2 - 1 === localPage && hasMore;
  useEffectPrefetchNext({
    fetchParams: {
      ...fetchParamsWithoutCallbacks,
      onError: (error: Error): void => {
        emptyFncWithMsg(error);
        setPaginationInfo({
          hasMore,
          isLoading: false,
          isLoadingMore: false,
          isServerLoaded: false,
          localPage,
          page,
        });
      },
      onSuccess: ({
        hasMore: nextPageHasMore,
        page: updatedPage,
        documents: nextDocs,
      }): void => {
        setUnifiedDocuments([...unifiedDocuments, ...nextDocs]);
        setPaginationInfo({
          hasMore: nextPageHasMore,
          isLoading: false,
          isLoadingMore: false,
          isServerLoaded: false,
          localPage,
          page: updatedPage,
        });
      },
      page: page + 1,
    },
    shouldPrefetch,
  });

  const firstLoad = useRef(!isServer() && !unifiedDocuments.length);

  /* Force update when hubs or docType changes. start from page 1 */
  useEffectForceUpdate({
    fetchParams: {
      ...fetchParamsWithoutCallbacks,
      onError: (error: Error): void => {
        emptyFncWithMsg(error);
        setPaginationInfo({
          hasMore,
          isLoading: false,
          isLoadingMore: false,
          isServerLoaded: false,
          localPage: 1,
          page,
        });
      },
      onSuccess: ({
        hasMore: nextPageHasMore,
        page: updatedPage,
        documents,
      }): void => {
        setUnifiedDocsLoading(false);
        setUnifiedDocuments(documents);
        setPaginationInfo({
          hasMore: nextPageHasMore,
          isLoading: false,
          isLoadingMore: false,
          isServerLoaded: false,
          localPage: 1,
          page: updatedPage,
        });
      },
      page: 1 /* when force updating, start from page 1 */,
    },
    firstLoad,
    setUnifiedDocsLoading,
    updateOn: [docTypeFilter, hubID, loggedIn, subFilters],
  });

  const onDocTypeFilterSelect = (selected) => {
    if (docTypeFilter !== selected) {
      setDocTypeFilter(selected);
      setPaginationInfo({
        hasMore: false,
        isLoading: true,
        isLoadingMore: false,
        isServerLoaded: false,
        localPage: 1,
        page: 1,
      });
      setDocSetFetchedTime(Date.now());

      const query = { ...router.query, type: selected };
      if (!query.type) {
        delete query.type;
      }

      router.push(
        {
          pathname: routerPathName,
          query,
        },
      );
    }
  }

  const hasSubscribed = useMemo(
    (): boolean => auth.authChecked && hubState.subscribedHubs.length > 0,
    [auth.authChecked, hubState.subscribedHubs]
  );

  const formattedMainHeader = useMemo(
    (): string =>
      formatMainHeader({
        feed,
        filterBy: subFilters.filterBy ?? null,
        hubName: hubName ?? "",
        isHomePage,
      }),
    [hubName, feed, subFilters, isHomePage]
  );

  const renderableUniDoc = unifiedDocuments.slice(0, localPage * 10);
  const [cards, docSetFetchedTimeCheck] = getDocumentCard({
    docSetFetchedTime,
    hasSubscribed,
    isLoggedIn,
    isOnMyHubsTab,
    setUnifiedDocuments,
    onBadgeClick: onDocTypeFilterSelect,
    unifiedDocumentData: renderableUniDoc,
  });

  /* we need time check here to ensure that payload formatting does not lead to 
  UI rendering timing issues since document objects & formmatting can be heavy */
  const areCardsReadyToBeRendered = !unifiedDocsLoading;

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      {!hasSubscribed ? (
        <div>
          {/* @ts-ignore */}
          <CreateFeedBanner loggedIn={loggedIn} />
        </div>
      ) : null}
      {isHomePage || isEmpty(hub)
        ? <h1 className={css(styles.title) + " clamp2"}>{formattedMainHeader}</h1>
        : <FeedInfoCard
            hub={hub}
            hubSubscribeButton={Boolean(hub) ? subscribeButton : null}
            isHomePage={isHomePage}
            mainHeaderText={formattedMainHeader}
          />
      }
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>
          <UnifiedDocFeedMenu
            subFilters={subFilters}
            onDocTypeFilterSelect={onDocTypeFilterSelect}
            onSubFilterSelect={(filterBy) => {
              setSubFilters({ filterBy, scope: subFilters.scope });
            }}
            onScopeSelect={(scope) => {
              setSubFilters({ filterBy: subFilters.filterBy, scope });
            }}
          />
        </div>
      </div>
      {!areCardsReadyToBeRendered ? (
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
      {!isLoggedIn && isOnMyHubsTab || unifiedDocsLoading ? null : (
        <div className={css(styles.loadMoreWrap)}>
          {isLoadingMore ? (
            <Loader
              key={"authored-loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          ) : canShowLoadMoreButton ? (
            <Ripples
              className={css(styles.loadMoreButton)}
              onClick={(): void =>
                setPaginationInfo({
                  ...paginationInfo,
                  localPage: localPage + 1,
                })
              }
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
    [`@media only screen and (min-width: ${breakpoints.large.str})`]: {
      paddingLeft: 28,
      paddingRight: 28,
    },
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall})`]: {
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column-reverse",
    },
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
      marginTop: 16,
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
    [`@media only screen and (max-width: ${breakpoints.xxsmall})`]: {
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
  title: {
    fontSize: 30,
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 0,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      fontSize: 30,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 24,
      marginTop: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.xxxsmall.str})`]: {
      fontSize: 20,
    },
  },
});