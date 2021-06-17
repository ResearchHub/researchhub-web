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

type PaginationInfo = {
  count: number;
  hasMore: Boolean;
  isLoading: Boolean;
  isLoadingMore: Boolean;
  page: number;
};

type UseEffectFetchFeedArgs = {
  documents: any;
  docTypeFilter: string;
  paginationInfo: PaginationInfo;
  setDocuments: Function;
  setPaginationInfo: Function;
  subFilters: any;
};

const useEffectFetchFeed = ({
  documents: currDocuments,
  docTypeFilter,
  paginationInfo,
  setDocuments,
  setPaginationInfo,
  subFilters,
}: UseEffectFetchFeedArgs): void => {
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
    fetchUnifiedDocs({ docTypeFilter, subFilters, onSuccess, onError });
  }, [docTypeFilter, subFilters, paginationInfo.page]);
};

const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.docType;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

export default function UnifiedDocFeedContainer(): ReactElement<"div"> {
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
  const { hasMore, isLoadingMore } = paginationInfo;

  useEffectFetchFeed({
    documents,
    docTypeFilter,
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
              router.push({
                pathname: router.pathname,
                query: { docType: filterValue },
              });
            }}
          />
        );
      }
    );
  }, [docTypeFilter]);

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
    [documents, paginationInfo.page]
  );

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>{docTypeFilterButtons}</div>
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
      {documentCards}
      <div className={css(styles.loadMoreWrap)}>
        {hasMore ? (
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
        ) : isLoadingMore ? (
          <Loader
            key={"authored-loader"}
            loading={true}
            size={25}
            color={colors.BLUE()}
          />
        ) : null}
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  unifiedDocFeedContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: 1200,
    width: "100%",
    "@media only screen and (min-width: 1920px)": {
      minWidth: 1200,
    },
    "@media only screen and (max-width: 990px)": {
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      padding: 0,
      width: "100%",
    },
  },
  buttonGroup: {
    alignItems: "center",
    display: "flex",
    height: 120,
    justifyContent: "space-between",
    width: "100%",
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
  },
  customUserPostCard: {
    border: 0,
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 24,
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
});
