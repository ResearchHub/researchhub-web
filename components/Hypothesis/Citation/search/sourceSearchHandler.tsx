import { Helpers } from "@quantfive/js-web-config";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { KeyOf, ValueOf } from "~/config/types/root_types";
import API from "~/config/api";

export const SearchFilterDocType: { [key: string]: string } = {
  ALL: "ALL",
  PAPER: "PAPER",
  POST: "POST",
};

export const SearchFilterDocTypeLabel: {
  [key: KeyOf<typeof SearchFilterDocType>]: string;
} = {
  ALL: "all",
  PAPER: "paper",
  POST: "post",
};

export type SearchState = {
  config: {
    route: ValueOf<typeof SearchFilterDocTypeLabel>;
  };
  facets: string[];
  filters: {
    query: string;
    searchType: ValueOf<typeof SearchFilterDocTypeLabel>;
  };
};

export type getHandleSourceSearchInputChange = {
  debounceTime?: number | undefined | null;
  onError: Function;
  onLoad?: Function;
  onSuccess: Function;
};

export const DEFAULT_SEARCH_STATE: SearchState = {
  config: {
    route: "paper",
  },
  facets: ["hubs"],
  filters: {
    query: "",
    searchType: "paper",
  },
};

export const getHandleSourceSearchInputChange = ({
  debounceTime = 500,
  onError,
  onLoad,
  onSuccess,
}: getHandleSourceSearchInputChange): ((searchState: SearchState) => void) => {
  let debounceRef: NodeJS.Timeout | null = null;

  return (searchState: SearchState): void => {
    if (!isNullOrUndefined(onLoad)) {
      nullthrows(onLoad)();
    }
    if (!isNullOrUndefined(debounceRef)) {
      clearTimeout(nullthrows(debounceRef, "debounceRef not found"));
    }

    debounceRef = setTimeout(async () => {
      const { config, facets, filters } = searchState;
      return fetch(API.SEARCH({ config, facets, filters }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((apiResponse) => {
          onSuccess(apiResponse);
          debounceRef = null;
        })
        .catch((error: Error): void => onError(error));
    }, debounceTime ?? 500);
  };
};
