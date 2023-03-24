import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ID, NullableString } from "~/config/types/root_types";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { NextRouter } from "next/router";
import { UnifiedDocFilters } from "../constants/UnifiedDocFilters";
import { useEffect } from "react";
import fetchUnifiedDocs from "../api/unifiedDocFetch";
import { SelectedUrlFilters } from "./getSelectedUrlFilters";

export type UniDocFetchParams = {
  hubID: ID;
  isLoggedIn: boolean;
  onError: Function;
  onSuccess: Function;
  page: number;
  selectedFilters: SelectedUrlFilters;
};

export type PaginationInfo = {
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isServerLoaded: boolean;
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

export const useEffectFetchDocs = ({
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
    if (!fetchParams.selectedFilters.isReady) {
      setUnifiedDocsLoading && setUnifiedDocsLoading(true);
      return;
    }
    else if (firstLoad?.current) {
      setUnifiedDocsLoading && setUnifiedDocsLoading(true);
      fetchUnifiedDocs(fetchParams);
    } else if (firstLoad) {
      firstLoad.current = true;
    }
  }, [...updateOn]);
};
