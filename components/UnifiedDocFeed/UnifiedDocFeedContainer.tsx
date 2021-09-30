import { css, StyleSheet } from "aphrodite";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  isEmpty,
  silentEmptyFnc,
} from "../../config/utils/nullchecks";
import { formatMainHeader } from "./UnifiedDocFeedUtil";
import { NextRouter, useRouter } from "next/router";
import { unifiedDocTabs } from "./constants/UnifiedDocTabs";
import { connect } from "react-redux";
import { getDocumentCard, UnifiedCard } from "./utils/getDocumentCard";
import {
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useRef,
  Fragment,
} from "react";
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
import TabNewFeature from "../NewFeature/TabNewFeature";
import FeedNewFeatureBox from "../NewFeature/FeedNewFeatureBox";
import killswitch from "~/config/killswitch/killswitch";
import { useEffectNewFeatureShouldAlertUser } from "~/config/newFeature/useEffectNewFeature";
import { postNewFeatureNotifiedToUser } from "~/config/newFeature/postNewFeatureNotified";
import SiteWideBannerTall from "../SiteWideBannerTall";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";

type PaginationInfo = {
  isLoading: Boolean;
  isLoadingMore: Boolean;
  page: number;
};

const featureHeadlines = {
  Hypothesis: "a tool to get an unbiased view of ...",
};

const featureDescriptions = {
  Hypothesis: `We love introducing exciting new features in order to help push and further science. Our new hypothesis feature allows users put a stake in the ground and make a claim, while backing it up with scientific research. 
  
Whether you're just starting your research in a new field, or have been researching for a while, we hope to be the first place anyone looks at to find the consensus of specific topics.`,
};

const getDocTypeFilterFromRouter = (router: NextRouter): string => {
  // The last part of the path is a url friendly doc type.
  // e.g. "posts" (not "post")
  const urlDocType = router.asPath.split("/").pop();

  const docTypeFilterForApi = getUnifiedDocType(urlDocType);

  return docTypeFilterForApi;
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
    (): Boolean => router.asPath.includes("/my-hubs"),
    [router.pathname]
  );

  const [selectedDocTypeFilter, setSelectedDocTypeFilter] = useState<string>(
    getDocTypeFilterFromRouter(router)
  );

  const [prevPath, setPrevPath] = useState<string>(router.asPath);

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
  const needsFetch = useMemo(
    (): Boolean => page === 1 && isLoading,
    [page, isLoading]
  );

  const [newFeatureActive, setNewFeatureActive] = useState(false);
  const [whichFeatureActive, setWhichFeatureActive] = useState(false);

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

  useEffect((): void => {
    if (isEmpty(preloadedDocData)) {
      resetState({});
      fetchUnifiedDocs({ ...getFetchParams() });
    }
    prefetchNextPage({ nextPage: 2 });
  }, []);

  useEffect((): void => {
    const docType = router.asPath.split("/").pop();

    if (docType === "hypothesis" && auth.authChecked) {
      postNewFeatureNotifiedToUser({
        auth,
        featureName: "hypothesis",
      });
    }
  }, [router.asPath, auth])

  useEffect((): void => {
    const currPath = router.asPath;

    if (
      currPath.includes("/my-hubs") &&
      prevPath !== currPath &&
      !isEmpty(prevPath)
    ) {
      resetState({ isLoading: false });
      fetchUnifiedDocs({ ...getFetchParams() });
    }

    setPrevPath(router.asPath);
  }, [router.asPath]);

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

  const getUrlForTab = (tab: any): void => {
    if (
      router.pathname === "/hubs/[slug]" ||
      router.pathname === "/hubs/[slug]/[type]"
    ) {
      return `/hubs/${router.query.slug}/${tab.href}`;
    } else if (
      router.pathname === "/my-hubs" ||
      router.pathname === "/my-hubs/[type]"
    ) {
      return `/my-hubs/${tab.href}`;
    } else {
      return `/${tab.href}`;
    }
  };

  const handleFilterSelect = (_type: string, filterBy: any): void => {
    const updatedSubFilters = { filterBy, scope: subFilters.scope };

    resetState({});
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

    resetState({});
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

  const resetState = ({ isLoading = true }): void => {
    setPaginationInfo({
      isLoading,
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
      docTypeFilter: (selectedDocTypeFilter === "post" ? "posts" : selectedDocTypeFilter),
      subFilters,
      isLoggedIn,
      onSuccess: onFetchSuccess,
      onError: onFetchError,
      subscribedHubs: isOnMyHubsTab,
      page: 1,
    };
  };

  const [shouldAlertHypo, _setShouldAlertHypo] =
    useEffectNewFeatureShouldAlertUser({
      auth,
      featureName: "hypothesis",
    });

  const docTypeFilterButtons = useMemo(() => {
    return unifiedDocTabs.map(
      (tab: any): ReactElement<typeof UnifiedDocFeedFilterButton> => {
        if (tab.filterValue === "hypothesis") {
          return (
            <div key={tab.label} className={css(styles.hypoFeedButton)}>
              <UnifiedDocFeedFilterButton
                isActive={selectedDocTypeFilter === tab.filterValue}
                label={tab.label}
                id={`${router.asPath}-${tab.label}`}
                href={getUrlForTab(tab)}
              />
              {shouldAlertHypo ? (
                <div key={tab.label} className={css(styles.tabFeature)}>
                  <TabNewFeature />
                </div>
              ) : null}
            </div>
          );
        } else {
          return (
            <div key={tab.label} className={css(styles.feedButtonContainer)}>
              <UnifiedDocFeedFilterButton
                isActive={selectedDocTypeFilter === tab.filterValue}
                label={tab.label}
                id={`${router.asPath}-${tab.label}`}
                href={getUrlForTab(tab)}
              />
            </div>
          );
        }
      }
    );
  }, [selectedDocTypeFilter, router, shouldAlertHypo]);

  const documentCards = useMemo((): UnifiedCard[] | any[] => {
    const cards = getDocumentCard({
      hasSubscribed,
      isLoggedIn,
      isOnMyHubsTab,
      setUnifiedDocuments,
      unifiedDocumentData: unifiedDocuments,
    });
    if (shouldAlertHypo && selectedDocTypeFilter === "hypothesis") {
      cards.unshift(
        <SiteWideBannerTall
          body={
            <Fragment>
              <span>
                {
                  "We love introducing exciting new features in order to help push and further science. Our new hypothesis feature allows you to put a stake in the ground and make a claim while backing it up with scientific research."
                }
              </span>
              <br />
              <br />
              <span>
                {
                  "Whether you're just starting your research in a new field, or have been researching for a while, we hope to be the first place aпуone looks at to find the consensus of sресific topics."
                }
              </span>
            </Fragment>
          }
          // button={{
          //   label: "Learn more",
          //   href: undefined /* TODO: Pat add Notion link */,
          // }}
          header={"Introducing Hypotheses"}
          imgSrc={""}
        />
      );
    }
    return cards;
  }, [
    getDocumentCard,
    setUnifiedDocuments,
    unifiedDocuments,
    isLoggedIn,
    shouldAlertHypo,
  ]);

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

      {needsFetch ? (
        <div className={css(styles.initPlaceholder)}>
          {/*<UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />
          <UnifiedDocFeedCardPlaceholder color="#efefef" />*/}
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
