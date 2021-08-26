import { css, StyleSheet } from "aphrodite";
import { formGenericStyles } from "../../../Paper/Upload/styles/formGenericStyles";
import { ReactElement, ReactNode, useCallback, useMemo, useState } from "react";
import FormInput from "../../../Form/FormInput";
import {
  DEFAULT_SEARCH_STATE,
  getHandleSourceSearchInputChange,
  SearchState,
} from "./sourceSearchHandler";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
  nullthrows,
} from "../../../../config/utils/nullchecks";

export type Props = {
  emptyResultDisplay?: ReactNode;
  inputPlaceholder?: string;
  label: string;
  onClearSelect?: () => void;
  onInputTextChange?: (text: string) => void;
  onSelect: (sourceData: any) => void;
};

export default function SourceSearchInput({
  emptyResultDisplay,
  inputPlaceholder,
  label,
  onClearSelect,
  onInputTextChange,
  onSelect,
}: Props): ReactElement<"div"> {
  const [searchState, setSearchState] = useState<SearchState>(
    DEFAULT_SEARCH_STATE
  );
  const [searchResult, setSearchResult] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const shouldEnableInput = !Boolean(selectedItem);

  console.warn("searchState: ", searchState);
  console.warn("searchResult: ", searchResult);

  const {
    filters,
    filters: { query = "" },
  } = searchState;

  const apiSearchHandler = useMemo(
    (): ((searchState: SearchState) => void) =>
      getHandleSourceSearchInputChange({
        debounceTime: 600,
        onError: emptyFncWithMsg,
        onSuccess: setSearchResult,
      }),
    [setSearchResult]
  );

  const handleInputChange = (_id: string, text: string): void => {
    const updatedSearchState = {
      ...searchState,
      filters: {
        ...filters,
        query: text,
      },
    };
    setSearchState(updatedSearchState);
    apiSearchHandler(updatedSearchState);
    if (!isNullOrUndefined(onInputTextChange)) {
      nullthrows(onInputTextChange)(text);
    }
  };

  return (
    <div className={css(styles.sourceSearchInput)}>
      {shouldEnableInput ? (
        <div className={css(styles.inputSection)}>
          <FormInput
            label={label}
            placeholder={inputPlaceholder || "Search sources"}
            labelStyle={formGenericStyles.labelStyle}
            value={query || ""}
            id="source-search-input"
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className={css(styles.selectedItemSection)}></div>
      )}
      {shouldEnableInput ? <div className={css(styles.itemsList)}></div> : null}
    </div>
  );
}

const styles = StyleSheet.create({
  sourceSearchInput: { width: "100%" },
  inputSection: {},
  itemsList: {},
  selectedItemSection: {},
});
