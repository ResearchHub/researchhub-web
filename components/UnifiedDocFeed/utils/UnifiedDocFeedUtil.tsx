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
};

export const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.type;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

export const useEffectPrefetchNext = ({
  fetchParams,
  shouldPrefetch,
}: {
  fetchParams: UniDocFetchParams;
  shouldPrefetch: Boolean;
}): void => {
  useEffect((): void => {
    console.warn("shouldPrefetch: ", shouldPrefetch);
    if (shouldPrefetch) {
      console.warn("fetchParams: ", fetchParams);
      fetchUnifiedDocs(fetchParams);
    }
  }, [fetchParams, shouldPrefetch]);
};

export const useEffectForceUpdate = ({
  fetchParams,
  updateOn,
}: {
  fetchParams: UniDocFetchParams;
  updateOn: any[];
}): void => {
  useEffect((): void => {
    fetchUnifiedDocs(fetchParams);
  }, [...updateOn]);
};
