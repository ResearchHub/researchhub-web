import { css, StyleSheet } from "aphrodite";
import { formGenericStyles } from "../../../Paper/Upload/styles/formGenericStyles";
import React, {
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import colors from "../../../../config/themes/colors";
import SourceSearchInputItem from "./SourceSearchInputItem";
import CitationTableRowItemPlaceholder from "../table/CitationTableRowItemPlaceholder";

export type Props = {
  emptyResultDisplay?: ReactNode;
  inputPlaceholder?: string;
  label: string;
  onClearSelect?: () => void;
  onInputTextChange?: (text: string) => void;
  onSelect: (sourceData: any) => void;
  optionalResultItem?: ReactNode;
  required?: boolean;
};

type UseEffectHandleInputFocusArgs = {
  inputRef: RefObject<typeof FormInput>;
  setIsInputFocused: (flag: boolean) => void;
};

const useEffectHandleInputFocus = ({
  inputRef,
  setIsInputFocused,
}: UseEffectHandleInputFocusArgs) => {
  useEffect(() => {
    if (!isNullOrUndefined(inputRef) && !isNullOrUndefined(document)) {
      // @ts-ignore TODO: calvinhlee change to optional chaining on Next upgrade
      const refID = (inputRef.current || {}).id;
      if (
        !isNullOrUndefined(refID) &&
        refID === (document.activeElement || {}).id
      ) {
        setIsInputFocused(true);
      } else {
        setIsInputFocused(false);
      }
    }
  }, [document, document.activeElement, inputRef, setIsInputFocused]);
};

export default function SourceSearchInput({
  emptyResultDisplay,
  inputPlaceholder,
  label,
  onClearSelect,
  onInputTextChange,
  onSelect,
  optionalResultItem,
  required,
}: Props): ReactElement<"div"> {
  const inputRef = useRef<typeof FormInput>(null);
  const [searchState, setSearchState] = useState<SearchState>(
    DEFAULT_SEARCH_STATE
  );
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffectHandleInputFocus({ inputRef, setIsInputFocused });

  const {
    filters,
    filters: { query = "" },
  } = searchState;

  const apiSearchHandler = useMemo((): ((searchState: SearchState) => void) => {
    setIsResultLoading(true);
    return getHandleSourceSearchInputChange({
      debounceTime: 600,
      onError: emptyFncWithMsg,
      onSuccess: (payload: any): void => {
        setIsResultLoading(false);
        setSearchResults(payload.results || []);
      },
    });
  }, [setSearchResults, setIsResultLoading]);

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

  const handleItemSelect = (item: any): void => {
    onSelect(item);
    setSelectedItem(item);
  };

  const handleClearItemSelect = (): void => {
    onSelect(null);
    setSelectedItem(null);
    const updatedSearchState = {
      ...searchState,
      filters: {
        ...filters,
        query: "",
      },
    };
    setSearchState(updatedSearchState);
    if (!isNullOrUndefined(onInputTextChange)) {
      nullthrows(onInputTextChange)("");
    }
  };

  const shouldShowInput = !Boolean(selectedItem);
  const shouldDisplaySearchResults =
    shouldShowInput && isInputFocused && query.length > 0;

  const searchResultsItems = shouldDisplaySearchResults ? (
    <div className={css(styles.itemsList)}>
      {isResultLoading
        ? [
            <CitationTableRowItemPlaceholder key="1" />,
            <CitationTableRowItemPlaceholder key="2" />,
          ]
        : searchResults.map((item: any) => (
            <SourceSearchInputItem
              key={`source-search-input-item-${(item || {}).id}`}
              onClick={() => {}}
              label={item.title || item.paper_title || "N/A"}
            />
          ))}
    </div>
  ) : null;

  return (
    <div className={css(styles.sourceSearchInput)}>
      {shouldShowInput ? (
        <div className={css(styles.inputSection)}>
          <FormInput
            autoComplete="off"
            getRef={inputRef}
            id="source-search-input"
            inputStyle={formGenericStyles.inputStyle}
            label={label}
            labelStyle={formGenericStyles.labelStyle}
            onChange={handleInputChange}
            placeholder={inputPlaceholder || "Search sources"}
            required={Boolean(required)}
            value={query || ""}
          />
        </div>
      ) : (
        <div className={css(styles.selectedItemSection)}></div>
      )}
      {searchResultsItems}
    </div>
  );
}

const styles = StyleSheet.create({
  sourceSearchInput: { position: "relative", width: "100%" },
  inputSection: {},
  itemsList: {
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    background: "#fff",
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: "inherit",
    zIndex: 2,
    minHeight: 40,
    maxHeight: 120,
    overflowY: "scroll",
  },
  selectedItemSection: {},
});
