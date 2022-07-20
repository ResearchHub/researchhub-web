import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg, isEmpty } from "../../config/utils/nullchecks";
import { filterOptions, scopeOptions } from "~/config/utils/options";
import { formatMainHeader } from "./UnifiedDocFeedUtil";
import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { getDocumentCard } from "./utils/getDocumentCard";
import { isServer } from "~/config/server/isServer";
import {
  getFilterFromRouter,
  getPaginationInfoFromServerLoaded,
  PaginationInfo,
  useEffectForceUpdate,
  useEffectUpdateStatesOnServerChanges,
} from "./utils/UnifiedDocFeedUtil";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import colors from "~/config/themes/colors";
import CreateFeedBanner from "../Home/CreateFeedBanner";
import dynamic from "next/dynamic";
import EmptyFeedScreen from "../Home/EmptyFeedScreen";
import FeedBlurWithButton from "./FeedBlurWithButton";
import Loader from "../Loader/Loader";
import Ripples from "react-ripples";
import UnifiedDocFeedCardPlaceholder from "./UnifiedDocFeedCardPlaceholder";
import UnifiedDocFeedMenu from "./UnifiedDocFeedMenu";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import ExitableBanner from "../Banner/ExitableBanner";
import DesktopOnly from "../DesktopOnly";

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
    scope: scopeOptions[0],
  });

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    getPaginationInfoFromServerLoaded(serverLoadedData)
  );
  const [unifiedDocuments, setUnifiedDocuments] = useState<any>(
    serverLoadedData?.results || []
  );
  const [unifiedDocsLoading, setUnifiedDocsLoading] = useState(true);

  const { hasMore, isLoadingMore, localPage, page } = paginationInfo;
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
    hotV2: router.query?.hot_v2 == "true",
  };

  useEffect(() => {
    setUnifiedDocsLoading(false);
  }, []);

  useEffectUpdateStatesOnServerChanges({
    routePath: routerPathName,
    serverLoadedData,
    setPaginationInfo,
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

  const loadMore = () => {
    const nextLocalPage = localPage + 1;
    setPaginationInfo({ ...paginationInfo, localPage: nextLocalPage });
    if (nextLocalPage === page * 2 && hasMore) {
      fetchUnifiedDocs({
        ...fetchParamsWithoutCallbacks,
        onError: (error: Error): void => {
          emptyFncWithMsg(error);
          setPaginationInfo({
            hasMore,
            isLoading: false,
            isLoadingMore: false,
            isServerLoaded: false,
            localPage: nextLocalPage,
            page,
          });
        },
        onSuccess: ({
          hasMore: nextPageHasMore,
          page: updatedPage,
          documents: nextDocs,
        }): void => {
          setUnifiedDocsLoading(false);
          setUnifiedDocuments([...unifiedDocuments, ...nextDocs]);
          setPaginationInfo({
            hasMore: nextPageHasMore,
            isLoading: false,
            isLoadingMore: false,
            isServerLoaded: false,
            localPage: nextLocalPage,
            page: updatedPage,
          });
        },
        page: page + 1,
      });
    }
  };

  const canShowLoadMoreButton = unifiedDocuments.length > localPage * 10;

  const onDocTypeFilterSelect = (selected) => {
    if (docTypeFilter !== selected) {
      // logical ordering
      setUnifiedDocuments([]);
      setDocTypeFilter(selected);
      setUnifiedDocsLoading(true);
      setPaginationInfo({
        hasMore: false,
        isLoading: true,
        isLoadingMore: false,
        isServerLoaded: false,
        localPage: 1,
        page: 1,
      });

      const query = { ...router.query, type: selected };
      if (!query.type) {
        delete query.type;
      }

      router.push({
        pathname: routerPathName,
        query,
      });
    }
  };

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
  const cards = getDocumentCard({
    setUnifiedDocuments,
    onBadgeClick: onDocTypeFilterSelect,
    unifiedDocumentData: renderableUniDoc,
  });

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      <DesktopOnly>
        <ExitableBanner
          bannerKey="SciCon2022"
          content={
            <a
              className={css(styles.bannerContainer)}
              href="https://researchhub.com/scicon2022?utm_campaign=scicon2022&utm_medium=banner"
              target="__blank"
            >
              <img
                style={{
                  maxHeight: "100%",
                  maxWidth: "1500px",
                  objectFit: "contain",
                  width: "100%",
                }}
                src="/static/banner/sci-con-banner-small-screen.png"
                srcSet={`
                /static/banner/scicon-banner.webp ${breakpoints.mobile.int}w, /static/banner/sci-con-banner-small-screen.png ${breakpoints.small.int}w
                `}
              />
            </a>
          }
          contentStyleOverride={{ maxWidth: 1500 }}
        />
      </DesktopOnly>

      {isHomePage || isEmpty(hub) ? (
        <div className={css(styles.title) + " clamp2"}>
          {formattedMainHeader}
        </div>
      ) : (
        <FeedInfoCard
          hub={hub}
          hubSubscribeButton={Boolean(hub) ? subscribeButton : null}
          isHomePage={isHomePage}
          mainHeaderText={formattedMainHeader}
        />
      )}

      <UnifiedDocFeedMenu
        subFilters={subFilters}
        onDocTypeFilterSelect={onDocTypeFilterSelect}
        onSubFilterSelect={(filterBy) =>
          setSubFilters({ filterBy, scope: subFilters.scope })
        }
        onScopeSelect={(scope) =>
          setSubFilters({ filterBy: subFilters.filterBy, scope })
        }
      />
      {unifiedDocsLoading || isServer() ? (
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
      {(!isLoggedIn && isOnMyHubsTab) || unifiedDocsLoading ? null : (
        <div className={css(styles.loadMoreWrap)}>
          {isLoadingMore ? (
            <Loader
              key={"authored-loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          ) : canShowLoadMoreButton ? (
            <Ripples className={css(styles.loadMoreButton)} onClick={loadMore}>
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
  bannerContainer: {
    minWidth: "100%",
    overflow: "hidden",
    [`@media only screen and (min-width: ${breakpoints.mobile.str})`]: {
      minWidth: "100%",
      maxHeight: "300px",
      marginBottom: 16,
    },
  },
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
    margin: "20px 0px",
    width: "100%",
  },
  initPlaceholder: {
    alignContent: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
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
    marginBottom: 5,
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
