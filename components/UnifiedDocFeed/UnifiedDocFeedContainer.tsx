import { css, StyleSheet } from "aphrodite";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "../../config/utils/nullchecks";
import { NextRouter, useRouter } from "next/router";
import fetchUnifiedDocs from "./api/unifiedDocFetch";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";

type PaginationInfo = {
  count: number;
  hasMore: Boolean;
  isLoading: Boolean;
  page: number;
};

type UseEffectFetchFeedArgs = {
  filter: string;
  paginationInfo: PaginationInfo;
  setDocuments: Function;
  setPaginationInfo: Function;
  subFilters: any;
};

const useEffectFetchFeed = ({
  filter,
  paginationInfo,
  setDocuments,
  setPaginationInfo,
  subFilters,
}: UseEffectFetchFeedArgs): void => {
  const onSuccess = ({ count, next, documents }) => {
    setDocuments(documents);
    setPaginationInfo({
      ...paginationInfo,
      count,
      hasMore: next,
      isLoading: false,
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
    fetchUnifiedDocs({ filter, subFilters, onSuccess, onError });
  }, [filter, subFilters, paginationInfo]);
};

const getFilterFromRouter = (router: NextRouter): string => {
  const filter = router.query.filter;
  return isNullOrUndefined(filter)
    ? UnifiedDocFilters.ALL
    : Array.isArray(filter)
    ? nullthrows(filter[0])
    : nullthrows(filter);
};

export default function UnifiedDocFeedContainer(): ReactElement<"div"> {
  const router = useRouter();
  const [filter, setFilter] = useState<string>(getFilterFromRouter(router));
  const [subFilters, setSubFilters] = useState({
    filterBy: filterOptions[0],
    scope: scopeOptions[0],
  });
  const [documents, setDocuments] = useState([]);

  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    count: 0,
    hasMore: false,
    isLoading: true,
    page: 1,
  });

  useEffectFetchFeed({
    filter,
    paginationInfo,
    setDocuments,
    setPaginationInfo,
    subFilters,
  });

  console.warn("DOCUMENTS: ", documents);

  const filterButtons = useMemo(() => {
    return Object.keys(UnifiedDocFilters).map(
      (filterKey: string): ReactElement<typeof UnifiedDocFeedFilterButton> => {
        const filterValue = UnifiedDocFilters[filterKey];
        return (
          <UnifiedDocFeedFilterButton
            isActive={filter === filterValue}
            key={filterKey}
            label={UnifiedDocFilterLabels[filterKey]}
            onClick={(): void => {
              setFilter(filterValue);
              router.push({
                pathname: router.pathname,
                query: { filter: filterValue },
              });
            }}
          />
        );
      }
    );
  }, [filter]);

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      <div className={css(styles.buttonGroup)}>
        <div className={css(styles.mainFilters)}>{filterButtons}</div>
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
      <div>Hi this is UnifiedDocFeedContainer</div>
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
});
