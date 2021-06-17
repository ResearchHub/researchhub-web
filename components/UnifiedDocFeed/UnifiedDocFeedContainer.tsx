import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined, nullthrows } from "../../config/utils/nullchecks";
import { NextRouter, useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import UnifiedDocFeedFilterButton from "./UnifiedDocFeedFilterButton";
import {
  UnifiedDocFilterLabels,
  UnifiedDocFilters,
} from "./constants/UnifiedDocFilters";

const useCallbackFetchFeed = ({
  currFilter,
  setIsPageLoading,
}: {
  currFilter: string;
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
  const [currFilter, setCurrFilter] = useState<string>(
    getFilterFromRouter(router)
  );
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useCallbackFetchFeed({ currFilter, setIsPageLoading });

  const filterButtons = useMemo(() => {
    return Object.keys(UnifiedDocFilters).map(
      (filterKey): ReactElement<typeof UnifiedDocFeedFilterButton> => {
        const filterValue = UnifiedDocFilters[filterKey];
        return (
          <UnifiedDocFeedFilterButton
            key={filterKey}
            onClick={(): void => {
              setCurrFilter(filterValue);
              router.push({
                pathname: router.pathname,
                query: { filter: filterValue },
              });
            }}
            isActive={currFilter === filterValue}
            label={UnifiedDocFilterLabels[filterKey]}
          />
        );
      }
    );
  }, [currFilter]);

  return (
    <div className={css(styles.unifiedDocFeedContainer)}>
      <div className={css(styles.buttonGroup)}>{filterButtons}</div>
      <div>HI this is UnifiedDocFeedContainer</div>
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
    width: "100%",
  },
});
