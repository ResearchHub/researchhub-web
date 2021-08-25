import {
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { KeyOf, ValueOf } from "../../../../config/types/root_types";
import { useState } from "react";
import API from "../../../../config/api";

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
  searchInputString: string | null;
};

export type getHandleSourceSearchInputChange = {
  debounceTime: number | undefined | null;
  onError: Function;
  onSuccess: Function;
  searchState: SearchState;
  setDebounceRef: (ref: NodeJS.Timeout | null) => void;
};

export const getHandleSourceSearchInputChange = ({
  debounceTime = 500,
  onError,
  onSuccess,
  searchState,
}: getHandleSourceSearchInputChange): ((searchText: string | null) => void) => {
  const [debounceRef, setDebounceRef] = useState<NodeJS.Timeout | null>(null);

  return (searchText: string | null): void => {
    if (!isNullOrUndefined(debounceRef)) {
      clearTimeout(nullthrows(debounceRef));
    }

    const shouldShowSearchResult = Boolean(searchText);

    setDebounceRef(
      setTimeout(async () => {
        const { config, facets, filters } = searchState;
        return fetch(API.SEARCH({ config, facets, filters }), API.GET_CONFIG())
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((apiResponse) => {
            onSuccess(apiResponse);
            setDebounceRef(null);
          })
          .catch((error: Error): void => onError(error));
      }, debounceTime || 500)
    );
  };
};
