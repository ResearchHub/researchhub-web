import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
import { breakpoints } from "~/config/themes/screen";
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
  useEffect,
  useMemo,
  useState,
} from "react";
import CitationTableRowItemPlaceholder from "../table/CitationTableRowItemPlaceholder";
import colors from "~/config/themes/colors";
import FormInput from "~/components/Form/FormInput";
import PaperMetaData from "~/components/SearchSuggestion/PaperMetaData";
import ResearchHubPopover from "~/components/ResearchHubPopover";

import FeedCard from "~/components/Author/Tabs/FeedCard";

export type Props = {
  emptyResultDisplay?: ReactNode;
  inputPlaceholder?: string;
  label: string;
  onClearSelect?: () => void;
  onInputTextChange?: (text: string) => void;
  onSelectPaperUpload: (event: SyntheticEvent) => void;
  onSelect: (sourceData: any) => void;
  optionalResultItem?: ReactNode;
  required?: boolean;
  shouldAllowNewUpload?: boolean;
};

export default function SourceSearchInput({
  emptyResultDisplay,
  inputPlaceholder,
  label,
  onClearSelect,
  onInputTextChange,
  onSelectPaperUpload,
  onSelect,
  optionalResultItem,
  required,
  shouldAllowNewUpload,
}: Props): ReactElement<"div"> {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchState, setSearchState] =
    useState<SearchState>(DEFAULT_SEARCH_STATE);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [shouldOpenPopover, setShouldOpenPopover] = useState<boolean>(false);
  const {
    filters,
    filters: { query = "" },
  } = searchState;

  useEffect((): void => {
    if (shouldAllowNewUpload && shouldOpenPopover) {
      setShouldOpenPopover(false);
    }
  }, [shouldAllowNewUpload, shouldOpenPopover]);

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
        query: (text ?? "").trim(),
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
            <CitationTableRowItemPlaceholder key="CitationTableRowItemPlaceholder-1" />,
            <CitationTableRowItemPlaceholder key="CitationTableRowItemPlaceholder-2" />,
          ]
        : searchResults
            .map((item: any, index: number) => (
              <div
                key={`source-search-input-item-${
                  (item ?? {}).id ?? index
                }-${index}`}
                onClick={(e: SyntheticEvent): void => {
                  e.stopPropagation(); // prevents FeedCard Redirect
                }}
                onClickCapture={(e: SyntheticEvent): void => {
                  handleItemSelect(item);
                  e.stopPropagation(); // prevents FeedCard Redirect
                }}
              >
                <FeedCard
                  {...item}
                  formattedDocType={"paper"}
                  handleClick={silentEmptyFnc}
                  hideVotes
                  withSidePadding
                />
              </div>
            ))
            .concat(filterNull([optionalResultItem, emptyResultDisplay]))}
    </div>
  ) : null;

  return (
    (<div className={css(styles.sourceSearchInput)}>
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
          <ResearchHubPopover
            containerStyle={{ zIndex: 11 }}
            targetContent={
              <span
                className={css(styles.uploadAPaper)}
                onClick={(event: SyntheticEvent): void => {
                  shouldAllowNewUpload
                    ? onSelectPaperUpload(event)
                    : setShouldOpenPopover(true);
                }}
              >
                {"Upload a paper"}
              </span>
            }
            isOpen={shouldOpenPopover}
            popoverContent={
              <div className={css(styles.uploaderPopoverContent)}>
                <div className={css(styles.uploadPopoverText)}>
                  {"Choose supports / rejects"}
                </div>
                <div style={{ color: colors.LIGHT_GREY_BACKGROUND }}>
                  {<FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>}
                </div>
              </div>
            }
            onClickOutside={(): void => {
              setShouldOpenPopover(false);
              setIsInputFocused(false);
            }}
            positions={["top", "bottom"]}
          />
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
    </div>)
  );
}

const styles = StyleSheet.create({
  sourceSearchInput: { position: "relative", width: "100%", minHeight: 75 },
  inputSection: {},
  itemsList: {
    background: colors.WHITE(),
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    maxHeight: 320,
    minHeight: 40,
    overflowY: "scroll",
    position: "fixed",
    width: "84.5%", // arbitrary to match modal input sizes
    zIndex: 12, // modal overlay position is 11
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "82.4%", // arbitrary to match modal input sizes
    },
    [`@media only screen and (max-width: ${breakpoints.small.str}`]: {
      maxHeight: 200,
    },
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
  uploaderPopoverContent: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  uploadPopoverText: {
    background: colors.LIGHT_GREY_BACKGROUND,
    borderRadius: 4,
    fontSize: 12,
    marginBottom: -8,
    padding: "8px 12px",
  },
});
