import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined, nullthrows } from "../../config/utils/nullchecks";
import { NextRouter, useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";
import { filterOptions, scopeOptions } from "../../config/utils/options";
import UnifiedDocFeedSubFilters from "./UnifiedDocFeedSubFilters";

const useCallbackFetchFeed = ({
  filter,
  setIsPageLoading,
}: {
  filter: string;
  setIsPageLoading: Function;
}): void => {
  const filters = useEffect((): void => {
    // make fetch call here.
  });
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
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useCallbackFetchFeed({ filter, setIsPageLoading });

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
