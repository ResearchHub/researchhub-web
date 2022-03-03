import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { ID } from "~/config/types/root_types";
import { NextRouter } from "next/router";
import { UnifiedDocFilters } from "../constants/UnifiedDocFilters";
import { useEffect } from "react";
import fetchUnifiedDocs from "../api/unifiedDocFetch";

export type UniDocFetchParams = {
  docTypeFilter: null | string | undefined;
  hubID: ID;
  isLoggedIn: Boolean;
  onError: Function;
  onSuccess: Function;
  page: number;
  subFilters: any;
  subscribedHubs: Boolean;
  hotV2: Boolean;
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
  setPaginationInfo,
  setUnifiedDocuments,
  serverLoadedData,
  routePath,
}): void => {
  useEffect((): void => {
    setPaginationInfo(getPaginationInfoFromServerLoaded(serverLoadedData));
    setUnifiedDocuments(serverLoadedData?.results || []);
  }, [routePath, serverLoadedData]);
};

export const useEffectPrefetchNext = ({
  fetchParams,
  shouldPrefetch,
}: {
  fetchParams: UniDocFetchParams;
  shouldPrefetch: Boolean;
}): void => {
  let prevFetchParams: UniDocFetchParams | null = null;
  useEffect((): void => {
    // comparing "memoized" filters to avoid unwanted prefetch
    const { docTypeFilter: prevDocTypeFilter, subFilters: prevSubFilters } =
      prevFetchParams ?? {};
    const { docTypeFilter, subFilters } = fetchParams ?? {};
    const readyToPrefetch =
      shouldPrefetch &&
      prevDocTypeFilter === docTypeFilter &&
      prevSubFilters === subFilters;

    if (readyToPrefetch) {
      fetchUnifiedDocs(fetchParams);
      prevFetchParams = fetchParams;
    }
    
  }, [shouldPrefetch, fetchParams]);
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
