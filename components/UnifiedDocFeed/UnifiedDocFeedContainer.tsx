import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg, isEmpty } from "../../config/utils/nullchecks";
import { formatMainHeader } from "./UnifiedDocFeedUtil";
import { getDocumentCard } from "./utils/getDocumentCard";
import { isServer } from "~/config/server/isServer";
import {
  getPaginationInfoFromServerLoaded,
  PaginationInfo,
  useEffectFetchDocs,
  useEffectUpdateStatesOnServerChanges,
} from "./utils/UnifiedDocFeedUtil";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import EmptyFeedScreen from "../Home/EmptyFeedScreen";
import FeedBlurWithButton from "./FeedBlurWithButton";
import Loader from "../Loader/Loader";
import Ripples from "react-ripples";
import UnifiedDocFeedCardPlaceholder from "./UnifiedDocFeedCardPlaceholder";
import FeedMenu from "./FeedMenu/FeedMenu";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import { getSelectedUrlFilters } from "./utils/getSelectedUrlFilters";
import ResearchHubBanner from "~/components/ResearchHubBanner";
const FeedInfoCard = dynamic(() => import("./FeedInfoCard"), {
  ssr: false,
});

function UnifiedDocFeedContainer({
  home: isHomePage,
  hub, // selected hub
  hubName,
  isLoggedIn,
  loggedIn,
  serverLoadedData, // Loaded on the server via getInitialProps on full page load
  subscribeButton,
  auth,
}): ReactElement<"div"> {
  const router = useRouter();
  const routerPathName = router.pathname;
  const selectedFilters = useMemo(() => {
    return getSelectedUrlFilters({
      query: router.query,
      pathname: router.pathname,
    });
  }, [router.pathname, router.query]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>(
    getPaginationInfoFromServerLoaded(serverLoadedData)
  );
  const [unifiedDocuments, setUnifiedDocuments] = useState<any>(
    serverLoadedData?.results || []
  );
  const [unifiedDocsLoading, setUnifiedDocsLoading] = useState(true);
  const { hasMore, isLoadingMore, localPage, page } = paginationInfo;
  const hubID = hub?.id ?? null;
  const fetchParams = {
    selectedFilters,
    hubID,
    isLoggedIn,
    page,
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
  useEffectFetchDocs({
    fetchParams: {
      ...fetchParams,
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
    updateOn: [selectedFilters, hubID, loggedIn],
  });

  const loadMore = () => {
    const nextLocalPage = localPage + 1;
    setPaginationInfo({ ...paginationInfo, localPage: nextLocalPage });
    if (nextLocalPage === page * 2 && hasMore) {
      fetchUnifiedDocs({
        ...fetchParams,
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

  const showLoadMoreButton = unifiedDocuments.length > localPage * 10;
  const renderableUniDoc = unifiedDocuments.slice(0, localPage * 10);
  const cards = getDocumentCard({
    setUnifiedDocuments,
    unifiedDocumentData: renderableUniDoc,
  });
  const onMyHubsLoggedOut =
    selectedFilters.topLevel === "/my-hubs" &&
    auth?.authChecked &&
    !auth?.user?.id;

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      {isHomePage || isEmpty(hub) ? null : (
        <FeedInfoCard
          hub={hub}
          hubSubscribeButton={Boolean(hub) ? subscribeButton : null}
          isHomePage={isHomePage}
          mainHeaderText={formatMainHeader({
            hubName: hubName ?? "",
            isHomePage,
          })}
        />
      )}
      <FeedMenu />
      {unifiedDocsLoading || isServer() ? (
        <div className={css(styles.initPlaceholder)}>
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
        </div>
      ) : (
        <div className={css(styles.feedPosts)}>
          {onMyHubsLoggedOut && (
            <ResearchHubBanner hub={{ name: "Research Hub" }} />
          )}
          <FeedBlurWithButton />
          {cards.length > 0 ? cards : <EmptyFeedScreen />}
        </div>
      )}
      {unifiedDocsLoading || onMyHubsLoggedOut ? null : (
        <div className={css(styles.loadMoreWrap)}>
          {isLoadingMore ? (
            <Loader
              key={"authored-loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          ) : showLoadMoreButton ? (
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
    padding: "0 28px",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "0",
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
