import { ID, NullableString } from "~/config/types/root_types";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { NextRouter } from "next/router";
import { UnifiedDocFilters } from "../constants/UnifiedDocFilters";
import { useEffect } from "react";
import fetchUnifiedDocs from "../api/unifiedDocFetch";

export type UniDocFetchParams = {
  docTypeFilter?: NullableString;
  hotV2: Boolean;
  hubID: ID;
  isLoggedIn: Boolean;
  onError: Function;
  onSuccess: Function;
  page: number;
  subFilters: any;
  subscribedHubs: Boolean;
};

export type PaginationInfo = {
  hasMore: Boolean;
  isLoading: Boolean;
  isLoadingMore: Boolean;
  isServerLoaded: Boolean;
  localPage: number; // for UI
  page: number; // for BE
};

export const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.type;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

export const getPaginationInfoFromServerLoaded = (
  serverLoadedData: any
): PaginationInfo => {
  return {
    hasMore: !isNullOrUndefined(serverLoadedData?.next),
    isLoading: isNullOrUndefined(serverLoadedData),
    isLoadingMore: false,
    isServerLoaded: !isNullOrUndefined(serverLoadedData),
    localPage: 1,
    page: 1,
  };
};

export const useEffectUpdateStatesOnServerChanges = ({
  routePath,
  serverLoadedData,
  setPaginationInfo,
}): void => {
  useEffect((): void => {
    setPaginationInfo(getPaginationInfoFromServerLoaded(serverLoadedData));
  }, [routePath, serverLoadedData]);
};

export const useEffectPrefetchNext = ({
  fetchParams,
  prevFetchParams,
  setPrevFetchParams,
  setIsPrefetching,
  shouldPrefetch,
}: {
  fetchParams: UniDocFetchParams;
  prevFetchParams: UniDocFetchParams | null;
  setPrevFetchParams: any;
  setIsPrefetching: (flag: boolean) => void;
  shouldPrefetch: Boolean;
}): void => {
  const {
    docTypeFilter: prevDocTypeFilter,
    subFilters: prevSubFilters,
    page: prevPage,
  } = prevFetchParams ?? {};
  const { docTypeFilter, subFilters, page } = fetchParams ?? {};

  useEffect((): void => {
    const readyToPrefetch =
      shouldPrefetch &&
      prevPage !== page &&
      (prevFetchParams === null ||
        (prevDocTypeFilter == docTypeFilter && prevSubFilters == subFilters));

    if (readyToPrefetch) {
      setIsPrefetching(true);
      fetchUnifiedDocs(fetchParams);
      setPrevFetchParams(fetchParams);
    }
  }, [
    shouldPrefetch,
    prevDocTypeFilter,
    prevSubFilters,
    docTypeFilter,
    subFilters,
  ]);
};

export const useEffectForceUpdate = ({
  fetchParams,
  updateOn,
  setUnifiedDocsLoading,
  firstLoad,
}: {
  fetchParams: UniDocFetchParams;
  updateOn: any[];
  setUnifiedDocsLoading: any;
  firstLoad: any;
}): void => {
  useEffect((): void => {
    if (firstLoad?.current) {
      setUnifiedDocsLoading && setUnifiedDocsLoading(true);
      fetchUnifiedDocs(fetchParams);
    } else if (firstLoad) {
      firstLoad.current = true;
    }
  }, [...updateOn]);
};
