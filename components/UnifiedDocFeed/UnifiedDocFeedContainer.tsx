import { css, StyleSheet } from "aphrodite";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import {
  emptyFncWithMsg,
  filterNull,
  isNullOrUndefined,
  nullthrows,
} from "../../config/utils/nullchecks";
import { NextRouter, useRouter } from "next/router";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import Button from "../Form/Button";
import CreateFeedBanner from "../Home/CreateFeedBanner";
import React, {
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import Ripples from "react-ripples";
import PaperEntryCard from "../../components/Hubs/PaperEntryCard";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import UserPostCard from "../Author/Tabs/UserPostCard";
import colors from "../../config/themes/colors";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import { ID } from "../../config/types/root_types";
import { formatMainHeader } from "./UnifiedDocFeedUtil";

type PaginationInfo = {
  count: number;
  hasMore: Boolean;
  isLoading: Boolean;
  isLoadingMore: Boolean;
  page: number;
};

type UseEffectFetchFeedArgs = {
  docTypeFilter: string;
  documents: any;
  hub: any;
  hubState: any;
  router: NextRouter;
  paginationInfo: PaginationInfo;
  setDocuments: Function;
  setPaginationInfo: Function;
  subFilters: any;
};

type UnifiedCard = ReactElement<typeof PaperEntryCard | typeof UserPostCard>;

const useEffectFetchFeed = ({
  docTypeFilter,
  documents: currDocuments,
  hub,
  hubState,
  router,
  paginationInfo,
  setDocuments,
  setPaginationInfo,
  subFilters,
}: UseEffectFetchFeedArgs): void => {
  const currPathname = router.pathname;
  const shouldGetSubscribed = useMemo<Boolean>(
    (): Boolean => ["all", "all/"].includes(currPathname),
    [currPathname]
  );

  const onSuccess = ({ count, hasMore, documents }) => {
    paginationInfo.isLoadingMore
      ? setDocuments([...currDocuments, ...documents])
      : setDocuments(documents);
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
    // @ts-ignore legacy fetch code
    fetchUnifiedDocs({
      docTypeFilter,
      hubID: shouldGetSubscribed
        ? hubState.subscribedHubs.map((hub: any): ID => hub.id)
        : isNullOrUndefined(hub)
        ? null
        : [hub.id],
      onError,
      onSuccess,
      subFilters,
    });
  }, [currPathname, docTypeFilter, hub, paginationInfo.page, subFilters]);
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
  hubName,
  hub, // selected hub
  hubState, // hub data of current user
  isLoggedIn,
  subscribeButton,
}): ReactElement<"div"> {
  const router = useRouter();
  const [docTypeFilter, setDocTypeFilter] = useState<string>(
    getFilterFromRouter(router)
  );
  const [documents, setDocuments] = useState<any>([]);
  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    hasMore: false,
    isLoading: true,
    isLoadingMore: false,
    page: 1,
  });
  const { page, isLoading, hasMore, isLoadingMore } = paginationInfo;

  const hasSubscribed = useMemo(
    (): Boolean => auth.authChecked && hubState.subscribedHubs.length > 0,
    [auth.authChecked, hubState.subscribedHubs]
  );
  const onInitialLoad = useMemo((): Boolean => page === 1 && isLoading, [
    page,
    isLoading,
  ]);
  const formattedMainHeader = useMemo(
    (): string =>
      formatMainHeader({
        feed,
        filterBy: subFilters.filterBy,
        hubName,
        isHomePage,
      }),
    [feed, subFilters.filterBy, hubName, isHomePage]
  );

  useEffectFetchFeed({
    docTypeFilter,
    documents,
    hub,
    hubState,
    router,
    paginationInfo,
    setDocuments,
    setPaginationInfo,
    subFilters,
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
              setDocTypeFilter(filterValue);
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
      filterNull(documents).map(
        (document: any, arrIndex: number): UnifiedCard => {
          console.warn("HI");
          const isPaperCard = document.document_type === "PAPER";
          const docID = document.id;
          if (isPaperCard) {
            return (
              <PaperEntryCard
                key={`Paper-${docID}-${arrIndex}`}
                paper={document.documents}
                index={arrIndex}
                vote={document.user_vote}
                voteCallback={(index: number, currPaper: any): void => {
                  let newDocument = {
                    ...document,
                  };
                  newDocument.documents.user_vote = currPaper.user_vote;
                  newDocument.documents.score = currPaper.score;

                  let newDocuments = [...documents];

                  newDocuments[index] = newDocument;

                  setDocuments(newDocuments);
                }}
              />
            );
          } else {
            return (
              <UserPostCard
                {...document.documents[0]}
                key={`Post-${docID}-${arrIndex}`}
                style={styles.customUserPostCard}
              />
            );
          }
        }
      ),
    [documents, docTypeFilter, paginationInfo, subFilters]
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
              setSubFilters({
                filterBy,
                scope: subFilters.scope,
              });
            }}
            onScopeSelect={(_type: string, scope) => {
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
            <CreateFeedBanner />
          </div>
        </div>
      ) : null}
      {onInitialLoad ? (
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
          {!hasSubscribed ? (
            <Fragment>
              <div className={css(styles.blur)} />
              <Button
                isLink={
                  isLoggedIn
                    ? {
                        href: `/user/${auth.user.author_profile.id}/onboard`,
                        query: {
                          selectHubs: true,
                        },
                      }
                    : {
                        href: "/all",
                        linkAs: "/all",
                      }
                }
                hideRipples={true}
                label={isLoggedIn ? "Generate My Hubs" : "View All Hubs"}
                customButtonStyle={styles.allFeedButton}
              />
            </Fragment>
          ) : null}
          {documentCards}
        </div>
      )}
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
              setPaginationInfo({
                ...paginationInfo,
                isLoading: false,
                isLoadingMore: true,
                page: paginationInfo.page + 1,
              })
            }
          >
            Load More
          </Ripples>
        ) : null}
      </div>
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
    marginBottom: 5,
    marginTop: 5,
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
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FCFCFC 86.38%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
  },
  allFeedButton: {
    position: "absolute",
    bottom: 100,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "unset",
    padding: "0px 15px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.14)",
  },
  feedPosts: {
    position: "relative",
    minHeight: 200,
  },
});
