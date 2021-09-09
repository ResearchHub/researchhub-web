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
import { ReactElement, useEffect, useMemo, useState, useRef } from "react";
import Loader from "../Loader/Loader";
import PaperEntryCard from "../../components/Hubs/PaperEntryCard";
import Ripples from "react-ripples";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import UserPostCard from "../Author/Tabs/UserPostCard";
import { connect } from "react-redux";
import FeedBlurWithButton from "./FeedBlurWithButton";
import UnifiedDocFeedCardPlaceholder from "./UnifiedDocFeedCardPlaceholder";

type PaginationInfo = {
  isLoading: Boolean;
  isLoadingMore: Boolean;
  page: number;
};

type UnifiedCard = ReactElement<typeof PaperEntryCard | typeof UserPostCard>;

const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.type;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

const usePrevious = (value: any): any => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

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
  const { next: preloadNext, results: preloadResults } = preloadedDocData || {};
  const router = useRouter();
  const isOnMyHubsTab = useMemo<Boolean>(
    (): Boolean => ["/my-hubs"].includes(router.pathname),
    [router.pathname]
  );

  const [docTypeFilter, setDocTypeFilter] = useState<string>(
    getFilterFromRouter(router)
  );

  const [prevPath, setPrevPath] = useState<string>(router.asPath);
  const prevHub = usePrevious(hub);

  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    isLoading: isNullOrUndefined(preloadResults),
    isLoadingMore: false,
    page: 1,
  });

  const { page, isLoading, isLoadingMore } = paginationInfo;
  const { filterBy } = subFilters;

  const [unifiedDocuments, setUnifiedDocuments] = useState<any>(
    preloadResults || []
  );
  const [nextResultSet, setNextResultSet] = useState<any>([]);

  const hasSubscribed = useMemo(
    (): Boolean => auth.authChecked && hubState.subscribedHubs.length > 0,
    [auth.authChecked, hubState.subscribedHubs]
  );
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

  // When the hub changes, we want to automatically fetch new docs
  useEffect((): void => {
    const currPath = router.asPath;

    if (prevPath !== currPath) {
      resetState();
      fetchUnifiedDocs({ ...getFetchParams() });
      setPrevPath(router.asPath);
    }
  }, [hub]);

  // Switching from "all" => slug hub unmounts the component
  // to mitigate, we need to figure out if a fetch is needed.
  useEffect((): void => {
    if (preloadedDocData) {
      setPaginationInfo({
        isLoadingMore: false,
        isLoading: false,
        page: 1,
      });
    } else {
      resetState();
      fetchUnifiedDocs({ ...getFetchParams() });
    }

    prefetchNextPage({ nextPage: 2 });
  }, []);

  const prefetchNextPage = ({ nextPage, fetchParams = {} }): void => {
    fetchUnifiedDocs({
      ...getFetchParams(),
      ...fetchParams,
      page: nextPage,
      onSuccess: ({ documents }) => {
        setNextResultSet(documents);
        setPaginationInfo({
          isLoading: false,
          isLoadingMore: false,
          page: nextPage,
        });
      },
      onError: () => {
        setNextResultSet([]);
      },
    });
  };

  const handleLoadMore = (): void => {
    if (isLoadingMore) {
      return silentEmptyFnc();
    }

    // If we have more results loaded, use them
    if (nextResultSet.length > 0) {
      setUnifiedDocuments([...unifiedDocuments, ...nextResultSet]);
      setNextResultSet([]);
      prefetchNextPage({ nextPage: paginationInfo.page + 1 });
    }
  };

  const handleDocTypeChange = (docTypeValue: string): void => {
    resetState();
    setDocTypeFilter(docTypeValue);

    fetchUnifiedDocs({
      ...getFetchParams(),
      docTypeFilter: docTypeValue,
    });
    prefetchNextPage({
      nextPage: 2,
      fetchParams: { docTypeFilter: docTypeValue },
    });

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

    resetState();
    setSubFilters(updatedSubFilters);
    fetchUnifiedDocs({
      ...getFetchParams(),
      subFilters: updatedSubFilters,
    });

    prefetchNextPage({
      nextPage: 2,
      fetchParams: { subFilters: updatedSubFilters },
    });
  };

  const handleScopeSelect = (_type: string, scope: any): void => {
    const updatedSubFilters = { filterBy: subFilters.filterBy, scope };

    resetState();
    setSubFilters(updatedSubFilters);
    fetchUnifiedDocs({
      ...getFetchParams(),
      subFilters: updatedSubFilters,
    });
    prefetchNextPage({
      nextPage: 2,
      fetchParams: { subFilters: updatedSubFilters },
    });
  };

  const resetState = (): void => {
    setPaginationInfo({
      isLoading: true,
      isLoadingMore: false,
      page: 1,
    });
    setUnifiedDocuments([]);
    setNextResultSet([]);
  };

  const getFetchParams = (): any => {
    const hubID = hub ? hub.id : null;

    const onFetchSuccess = ({ page, documents, prevDocuments }): void => {
      page > 1
        ? setUnifiedDocuments([...prevDocuments, ...documents])
        : setUnifiedDocuments(documents);

      setPaginationInfo({
        isLoading: false,
        isLoadingMore: false,
        page,
      });
    };

    const onFetchError = (error: Error): void => {
      emptyFncWithMsg(error);
      setPaginationInfo({
        isLoading: false,
        isLoadingMore: false,
        page: paginationInfo.page,
      });
    };

    return {
      hubID,
      prevDocuments: unifiedDocuments,
      docTypeFilter,
      subFilters,
      isLoggedIn,
      onSuccess: onFetchSuccess,
      onError: onFetchError,
      subscribedHubs: isOnMyHubsTab,
      page: 1,
    };
  };

  const docTypeFilterButtons = useMemo(() => {
    return Object.keys(UnifiedDocFilters).map(
      (filterKey: string): ReactElement<typeof UnifiedDocFeedFilterButton> => {
        const filterValue = UnifiedDocFilters[filterKey];
        return (
          <UnifiedDocFeedFilterButton
            isActive={docTypeFilter === filterValue}
            key={filterKey}
            label={UnifiedDocFilterLabels[filterKey]}
            onClick={() => handleDocTypeChange(filterValue)}
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
            arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;
          const shouldBlurDesktop =
            arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;
          if (isPaperCard) {
            return (
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
            );
          } else {
            // NOTE: we are sharing this UI with other document types
            return (
              <UserPostCard
                {...uniDoc.documents[0]}
                key={`${docTypeFilter}-${docID}-${arrIndex}`}
                style={[
                  styles.customUserPostCard,
                  shouldBlurMobile && styles.mobileBlurCard,
                  shouldBlurDesktop && styles.desktopBlurCard,
                ]}
              />
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
      {needsInitialFetch ? (
        <div className={css(styles.initPlaceholder)}>
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
        </div>
      ) : (
        <div className={css(styles.feedPosts)}>
          <FeedBlurWithButton />
          {documentCards.length > 0 ? documentCards : <EmptyFeedScreen />}
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
  initPlaceholder: {
    alignContent: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
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
