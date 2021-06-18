import { css, StyleSheet } from "aphrodite";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "../../config/utils/nullchecks";
import { NextRouter, useRouter } from "next/router";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import Ripples from "react-ripples";
import PaperEntryCard from "../../components/Hubs/PaperEntryCard";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import UserPostCard from "../Author/Tabs/UserPostCard";
import colors from "../../config/themes/colors";
import Loader from "../Loader/Loader";
import { capitalize } from "../../config/utils";
import { connect } from "react-redux";

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
  const shouldGetSubScribed =
    router.pathname === "all" || router.pathname === "all/";
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
    setPaginationInfo({
      ...paginationInfo,
      isLoading: true,
      hasMore: paginationInfo.page !== 1,
      isLoadingMore: false,
    });
    // @ts-ignore legacy fetch code
    fetchUnifiedDocs({
      docTypeFilter,
      hubID: shouldGetSubScribed
        ? hubState.subscribedHubs.map((hub) => hub.id)
        : isNullOrUndefined(hub)
        ? null
        : hub.id,
      onError,
      onSuccess,
      subFilters,
    });
  }, [docTypeFilter, subFilters, paginationInfo.page, hub]);
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
  home,
  hubName,
  hub, // selected hub
  hubState, // hub data of current user
  subscribeButton,
}): ReactElement<"div"> {
  const router = useRouter();
  const [docTypeFilter, setDocTypeFilter] = useState<string>(
    getFilterFromRouter(router)
  );
  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });
  const [documents, setDocuments] = useState([]);

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    hasMore: false,
    isLoading: true,
    isLoadingMore: false,
    page: 1,
  });
  const { page, isLoading, hasMore, isLoadingMore } = paginationInfo;

  const formatMainHeader = () => {
    const { filterBy } = subFilters;

    if (feed === 0) {
      return "My Hubs";
    }

    const isHomePage = home;
    let prefix = "";
    switch (filterBy.value) {
      case "removed":
        prefix = "Removed";
        break;
      case "hot":
        prefix = "Trending";
        break;
      case "top_rated":
        prefix = "Top";
        break;
      case "newest":
        prefix = "Newest";
        break;
      case "most_discussed":
        prefix = "Most Discussed";
        break;
      case "pulled-papers":
        prefix = "Pulled";
        break;
    }

    if (isHomePage) {
      return `${prefix} on ResearchHub`;
    }

    return `${capitalize(hubName)}`;
  };

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
    () =>
      documents.map((document: any, i: number): ReactElement<
        typeof PaperEntryCard
      > | null => {
        const { document_type } = document;
        if (document_type === "PAPER") {
          return (
            <PaperEntryCard
              key={`${document.id}-${i}`}
              paper={document.documents}
              index={i}
              vote={document.user_vote}
              voteCallback={(index, curPaper) => {
                let newDocument = {
                  ...document,
                };
                newDocument.documents.user_vote = curPaper.user_vote;
                newDocument.documents.score = curPaper.score;

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
              key={`${document.id}-${i}`}
              style={styles.customUserPostCard}
            />
          );
        }
      }),
    [
      documents,
      paginationInfo.page,
      docTypeFilter,
      subFilters.filterBy,
      subFilters.scope,
    ]
  );
  const onInitialLoad = page === 1 && isLoading;
  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title) + " clamp2"}>{formatMainHeader()}</h1>
        {home ? null : (
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
        documentCards
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
                isLoading: true,
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
});
