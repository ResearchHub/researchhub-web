import { css, StyleSheet } from "aphrodite";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import {
  emptyFncWithMsg,
  filterNull,
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
import colors from "../../config/themes/colors";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import CreateFeedBanner from "../Home/CreateFeedBanner";
import EmptyFeedScreen from "../Home/EmptyFeedScreen";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import Loader from "../Loader/Loader";
import PaperEntryCard from "../../components/Hubs/PaperEntryCard";
import Ripples from "react-ripples";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import UserPostCard from "../Author/Tabs/UserPostCard";
import { connect } from "react-redux";
import FeedBlurWithButton from "./FeedBlurWithButton";
import LazyLoad from "react-lazyload";
import UnifiedDocFeedCardPlaceholder from "./UnifiedDocFeedCardPlaceholder";

type PaginationInfo = {
  count: number;
  hasMore: Boolean;
  isLoading: Boolean;
  isLoadingMore: Boolean;
  page: number;
};

type UseEffectFetchFeedArgs = {
  docTypeFilter: string;
  hub: any;
  isLoggedIn: Boolean;
  paginationInfo: PaginationInfo;
  router: NextRouter;
  setPaginationInfo: Function;
  setUnifiedDocuments: Function;
  subFilters: any;
  unifiedDocuments: any;
};

type UnifiedCard = ReactElement<typeof PaperEntryCard | typeof UserPostCard>;

const useEffectFetchFeed = ({
  docTypeFilter,
  hub: selectedHub,
  isLoggedIn,
  paginationInfo,
  router,
  setPaginationInfo,
  setUnifiedDocuments,
  subFilters,
  unifiedDocuments: currDocuments,
}: UseEffectFetchFeedArgs): void => {
  const currPathname = router.pathname;
  const shouldGetSubscribed = useMemo<Boolean>(
    (): Boolean => ["", "/"].includes(currPathname),
    [currPathname]
  );
  const { page } = paginationInfo;
  // first pages should have been preloaded
  const isFetchExecutable =
    (page === 1 && currDocuments.length === 0) || page !== 1;

  const onSuccess = ({ count, hasMore, documents }) => {
    paginationInfo.isLoadingMore
      ? setUnifiedDocuments([...currDocuments, ...documents])
      : setUnifiedDocuments(documents);
    setPaginationInfo({
      ...paginationInfo,
      count,
      hasMore,
      isLoading: false,
      isLoadingMore: false,
    });
  };
  const onError = (error: Error): void => {
    emptyFncWithMsg(error);
    setPaginationInfo({
      ...paginationInfo,
      hasMore: false,
      isLoading: false,
    });
  };

  useEffect((): void => {
    if (!isFetchExecutable) {
      return;
    }
    // @ts-ignore legacy fetch code
    fetchUnifiedDocs({
      docTypeFilter,
      hubID:
        !shouldGetSubscribed && !isNullOrUndefined(selectedHub)
          ? selectedHub.id
          : null,
      isLoggedIn,
      onError,
      onSuccess,
      page,
      subscribedHubs: shouldGetSubscribed,
      subFilters,
    });
  }, [
    currPathname,
    docTypeFilter,
    isFetchExecutable,
    page,
    selectedHub,
    subFilters,
  ]);
};

const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.type;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

function UnifiedDocFeedContainer({
  auth, // redux
  feed,
  home: isHomePage,
  hub, // selected hub
  hubName,
  hubState, // hub data of current user
  preloadedDocData,
  isLoggedIn,
  loggedIn,
  subscribeButton,
}): ReactElement<"div"> {
  const { count: preloadCount, next: preloadNext, results: preloadResults } =
    preloadedDocData || {};
  const router = useRouter();
  const isOnAllHubsTab = useMemo<Boolean>(
    (): Boolean => ["", "/"].includes(router.pathname),
    [router.pathname]
  );
  const [docTypeFilter, setDocTypeFilter] = useState<string>(
    getFilterFromRouter(router)
  );
  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: preloadCount || 0,
    hasMore: Boolean(preloadNext),
    isLoading: isNullOrUndefined(preloadResults),
    isLoadingMore: false,
    page: 1,
  });
  const [unifiedDocuments, setUnifiedDocuments] = useState<any>(
    preloadResults || []
  );

  const { page, isLoading, hasMore, isLoadingMore } = paginationInfo;
  const hasSubscribed = useMemo(
    (): Boolean => auth.authChecked && hubState.subscribedHubs.length > 0,
    [auth.authChecked, hubState.subscribedHubs]
  );
  const { filterBy } = subFilters;
  const needsInitialFetch = useMemo((): Boolean => page === 1 && isLoading, [
    page,
    isLoading,
  ]);

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

  useEffectFetchFeed({
    docTypeFilter,
    hub,
    isLoggedIn: auth.isLoggedIn,
    paginationInfo,
    router,
    setPaginationInfo,
    setUnifiedDocuments,
    subFilters,
    unifiedDocuments,
  });

  const docTypeFilterButtons = useMemo(() => {
    return Object.keys(UnifiedDocFilters).map(
      (filterKey: string): ReactElement<typeof UnifiedDocFeedFilterButton> => {
        const filterValue = UnifiedDocFilters[filterKey];
        return (
          <UnifiedDocFeedFilterButton
            isActive={docTypeFilter === filterValue}
            key={filterKey}
            label={UnifiedDocFilterLabels[filterKey]}
            onClick={(): void => {
              setUnifiedDocuments([]);
              setDocTypeFilter(filterValue);
              setPaginationInfo({
                ...paginationInfo,
                hasMore: false,
                isLoading: true,
                isLoadingMore: false,
                page: 1,
              });
              router.push(
                {
                  pathname: router.pathname,
                  query: { ...router.query, type: filterValue },
                },
                router.pathname + `?type=${filterValue}`
              );
            }}
          />
        );
      }
    );
  }, [docTypeFilter, router]);

  const documentCards = useMemo(
    (): Array<UnifiedCard> =>
      filterNull(unifiedDocuments).map(
        (uniDoc: any, arrIndex: number): UnifiedCard => {
          const isPaperCard = uniDoc.document_type === "PAPER";
          const docID = uniDoc.id;

          const shouldBlurMobile =
            arrIndex > 1 && !isLoggedIn && router.pathname !== "/all";
          const shouldBlurDesktop =
            arrIndex > 1 && !isLoggedIn && router.pathname !== "/all";
          if (isPaperCard) {
            return (
              <LazyLoad
                key={`Paper-${docID}-${arrIndex}-lazy`}
                placeholder={<UnifiedDocFeedCardPlaceholder color="#efefef" />}
              >
                <PaperEntryCard
                  index={arrIndex}
                  key={`Paper-${docID}-${arrIndex}`}
                  paper={uniDoc.documents}
                  style={[
                    shouldBlurMobile && styles.mobileBlurCard,
                    shouldBlurDesktop && styles.desktopBlurCard,
                  ]}
                  vote={uniDoc.user_vote}
                  voteCallback={(arrIndex: number, currPaper: any): void => {
                    const [currUniDoc, newUniDocs] = [
                      { ...uniDoc },
                      [...unifiedDocuments],
                    ];
                    currUniDoc.documents.user_vote = currPaper.user_vote;
                    currUniDoc.documents.score = currPaper.score;
                    newUniDocs[arrIndex] = currUniDoc;
                    setUnifiedDocuments(newUniDocs);
                  }}
                />
              </LazyLoad>
            );
          } else {
            return (
              <LazyLoad
                key={`Post-${docID}-${arrIndex}-lazy`}
                placeholder={<UnifiedDocFeedCardPlaceholder color="#efefef" />}
              >
                <UserPostCard
                  {...uniDoc.documents[0]}
                  key={`Post-${docID}-${arrIndex}`}
                  style={[
                    styles.customUserPostCard,
                    shouldBlurMobile && styles.mobileBlurCard,
                    shouldBlurDesktop && styles.desktopBlurCard,
                  ]}
                />
              </LazyLoad>
            );
          }
        }
      ),
    [docTypeFilter, paginationInfo, subFilters, unifiedDocuments, isLoggedIn]
  );

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
            onSubFilterSelect={(_type: string, filterBy: any): void => {
              setUnifiedDocuments([]);
              setPaginationInfo({
                ...paginationInfo,
                hasMore: false,
                isLoading: true,
                isLoadingMore: false,
                page: 1,
              });
              setSubFilters({
                filterBy,
                scope: subFilters.scope,
              });
            }}
            onScopeSelect={(_type: string, scope) => {
              setUnifiedDocuments([]);
              setPaginationInfo({
                ...paginationInfo,
                hasMore: false,
                isLoading: true,
                isLoadingMore: false,
                page: 1,
              });
              setSubFilters({
                filterBy: subFilters.filterBy,
                scope,
              });
            }}
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
      {needsInitialFetch ? (
        <div className={css(styles.initSpinnerWrap)}>
          <Loader
            key={"authored-loader"}
            loading={true}
            size={25}
            color={colors.BLUE()}
          />
        </div>
      ) : (
        <div className={css(styles.feedPosts)}>
          <FeedBlurWithButton />
          {documentCards.length > 0 ? documentCards : <EmptyFeedScreen />}
        </div>
      )}
      {/* if not Loggedin & trying to view "My Hubs", redirect them to "All" */}
      {!isLoggedIn && isOnAllHubsTab ? null : (
        <div className={css(styles.loadMoreWrap)}>
          {isLoadingMore ? (
            <Loader
              key={"authored-loader"}
              loading={true}
              size={25}
              color={colors.BLUE()}
            />
          ) : hasMore ? (
            <Ripples
              className={css(styles.loadMoreButton)}
              onClick={(): void =>
                isLoadingMore
                  ? silentEmptyFnc()
                  : setPaginationInfo({
                      ...paginationInfo,
                      isLoading: false,
                      isLoadingMore: true,
                      page: paginationInfo.page + 1,
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
  },
  mainFilters: {
    alignItems: "center",
    display: "flex",
    height: "inherit",
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
  customUserPostCard: {
    // border: 0,
    // borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 12,
    marginTop: 12,
    // paddingTop: 24,
    // paddingBottom: 24,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
  mobileBlurCard: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  desktopBlurCard: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
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
  initSpinnerWrap: {
    alignContent: "center",
    display: "flex",
    height: 50,
    justifyContent: "center",
    width: "100%",
  },
  bannerContainer: {
    dropShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
    "@media only screen and (max-width: 415px)": {
      padding: 0,
      width: "100%",
    },
  },
  feedPosts: {
    position: "relative",
    minHeight: 200,
  },
});
