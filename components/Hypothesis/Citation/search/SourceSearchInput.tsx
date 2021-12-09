import { css, StyleSheet } from "aphrodite";
import { formGenericStyles } from "~/components/Paper/Upload/styles/formGenericStyles";
import {
  DEFAULT_SEARCH_STATE,
  getHandleSourceSearchInputChange,
  SearchState,
} from "./sourceSearchHandler";
import {
  emptyFncWithMsg,
  filterNull,
  isNullOrUndefined,
  nullthrows,
  silentEmptyFnc,
} from "~/config/utils/nullchecks";
import {
  ReactElement,
  ReactNode,
  SyntheticEvent,
  useMemo,
  useState,
} from "react";
import CitationTableRowItemPlaceholder from "../table/CitationTableRowItemPlaceholder";
import colors from "~/config/themes/colors";
import FormInput from "~/components/Form/FormInput";
import PaperMetaData from "~/components/SearchSuggestion/PaperMetaData";
import SourceSearchInputItem from "./SourceSearchInputItem";

export type Props = {
  emptyResultDisplay?: ReactNode;
  inputPlaceholder?: string;
  label: string;
  onClearSelect?: () => void;
  onInputTextChange?: (text: string) => void;
  onPaperUpload: () => void;
  onSelect: (sourceData: any) => void;
  optionalResultItem?: ReactNode;
  required?: boolean;
};

export default function SourceSearchInput({
  emptyResultDisplay,
  inputPlaceholder,
  label,
  onClearSelect,
  onInputTextChange,
  onPaperUpload,
  onSelect,
  optionalResultItem,
  required,
}: Props): ReactElement<"div"> {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchState, setSearchState] =
    useState<SearchState>(DEFAULT_SEARCH_STATE);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const {
    filters,
    filters: { query = "" },
  } = searchState;

  const apiSearchHandler = useMemo((): ((searchState: SearchState) => void) => {
    return getHandleSourceSearchInputChange({
      debounceTime: 600,
      onError: emptyFncWithMsg,
      onLoad: (): void => setIsResultLoading(true),
      onSuccess: (payload: any): void => {
        setIsResultLoading(false);
        setSearchResults(payload.results ?? []);
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
    Boolean(onClearSelect) && nullthrows(onClearSelect)();
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
        : searchResults
            .map((item: any, index: number) => (
              <SourceSearchInputItem
                key={`source-search-input-item-${(item ?? {}).id ?? index}`}
                label={item.title ?? item.paper_title ?? "N/A"}
                onSelect={(): void => handleItemSelect(item)}
              />
            ))
            .concat(filterNull([optionalResultItem, emptyResultDisplay]))}
    </div>
  ) : null;

  return (
    <div className={css(styles.sourceSearchInput)}>
      {shouldShowInput ? (
        <div className={css(styles.inputSection)}>
          <FormInput
            autoComplete="off"
            id="source-search-input"
            inputStyle={formGenericStyles.inputStyle}
            label={label}
            labelStyle={formGenericStyles.labelStyle}
            onChange={handleInputChange}
            onFocus={(): void => setIsInputFocused(true)}
            placeholder={inputPlaceholder ?? "Search sources"}
            required={Boolean(required)}
            value={query ?? ""}
          />
          <span className={css(styles.uploadAPaper)} onClick={onPaperUpload}>
            {"Upload a paper"}
          </span>
        </div>
      ) : (
        <div className={css(styles.selectedItemCard)}>
          <PaperMetaData
            metaData={{
              ...selectedItem,
              csl_item: {
                ...selectedItem,
                author: (selectedItem ?? {}).authors,
                URL: true,
              },
              url_is_pdf: true,
            }}
            onEdit={silentEmptyFnc}
            onRemove={(event: SyntheticEvent): void => {
              event.preventDefault();
              event.stopPropagation();
              handleClearItemSelect();
              setSearchState({
                ...searchState,
                filters: {
                  ...filters,
                  query: "",
                },
              });
            }}
          />
        </div>
      )}
      {searchResultsItems}
    </div>
  );
}

const styles = StyleSheet.create({
  sourceSearchInput: { position: "relative", width: "100%", minHeight: 75 },
  inputSection: {},
  itemsList: {
    background: "#fff",
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 4,
    top: 104,
    display: "flex",
    flexDirection: "column",
    maxHeight: 300,
    minHeight: 40,
    overflowY: "scroll",
    position: "absolute",
    width: "inherit",
    zIndex: 2,

    "@media only screen and (max-width: 767px)": {
      maxHeight: 200,
    }
  },
  selectedItemCard: { marginBottom: 8 },
  uploadAPaper: {
    color: colors.BLUE(1),
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    position: "absolute",
    right: 0,
    top: 24,
  },
});
