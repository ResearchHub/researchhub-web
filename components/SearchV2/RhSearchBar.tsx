import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faSearch } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import {
  ChangeEvent,
  Fragment,
  KeyboardEventHandler,
  ReactElement,
  RefObject,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { isEmpty } from "~/config/utils/nullchecks";
import { isServer } from "~/config/server/isServer";
import { NextRouter, useRouter } from "next/router";
import { NullableString } from "~/config/types/root_types";
import { pickFiltersForApp, QUERY_PARAM } from "~/config/utils/search";
import { trackEvent } from "~/config/utils/analytics";
import { useStore } from "react-redux";
import colors, { mainNavIcons } from "~/config/themes/colors";
import { fetchAllSuggestions } from "../SearchSuggestion/lib/api";
import SearchSuggestions from "../SearchSuggestion/SearchAutosuggest";



type SearchProps = {
  expendableSearchbarRef?: RefObject<HTMLInputElement>;
  handleKeyPress: KeyboardEventHandler<HTMLInputElement>;
  pushSearchToUrlAndTrack: () => void;
  searchbarRef?: RefObject<HTMLInputElement>;
  searchString: NullableString;
  setSearchString: (query: NullableString) => void;
};

/* 
  The real execution of search is being done at the page level. 
  The only real responsibility of this component is to push the query to URL for the page to read
*/
export default function RhSearchBar(): ReactElement {
  const auth = useStore()?.getState()?.auth;
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchString, setSearchString] = useState<NullableString>(
    ((router?.query ?? {})?.[QUERY_PARAM] ?? [])[0] ?? null
  );
  const expendableSearchbarRef = useRef<HTMLInputElement>(null);
  const searchbarRef = useRef<HTMLInputElement>(null);

  useEffectParseUrlToSearchState({ router, setSearchString });

  useEffect(() => {
    (async () => {
      const suggestions = await fetchAllSuggestions(searchString)
      setSuggestions(suggestions)
    })()
  }, [searchString])

  const blurAndCloseDeviceKeyboard = (): void => {
    if (isServer()) {
      return;
    } else {
      // @ts-ignore incomplete TS definition. activeElement exits
      document?.activeElement?.blur();
      searchbarRef?.current?.blur();
      expendableSearchbarRef?.current?.blur();
    }
  };

  const pushSearchToUrlAndTrack = (): void => {
    // dont do anything if search string is empty
    if (isEmpty(searchString)) {
      return;
    }

    const isUserOnSearchPage = router.pathname.includes("/search");
    const currentSearchType = isUserOnSearchPage ? router.query.type : "all";
    router.push({
      pathname: "/search/[type]",
      query: {
        ...pickFiltersForApp({
          searchType: currentSearchType,
          query: router.query,
        }),
        [QUERY_PARAM]: searchString,
        type: currentSearchType,
      },
    });
    blurAndCloseDeviceKeyboard();
    trackEvent({
      eventType: "search_query_submitted",
      vendor: "amp",
      user: auth?.isLoggedIn ? auth.user : null,
      data: {
        query: searchString ?? "",
      },
    });
  };

  const searchProps: SearchProps = {
    expendableSearchbarRef,
    handleKeyPress: (event): void => {
      if (event.key === "Enter") {
        pushSearchToUrlAndTrack();
      }
    },
    pushSearchToUrlAndTrack,
    searchbarRef,
    searchString,
    setSearchString,
  };
  console.log(suggestions)
  return (
    <Fragment>
      <div
        children={<RhSearchBarExpandableInput {...searchProps} />}
        className={css(styles.rhSearchBarExpandableInputDisplay)}
      />
      <div
        className={css(styles.rhSearchBarInputDisplay)}
      >
        <RhSearchBarInput {...searchProps}  />
        {suggestions.length > 0 &&
          <div style={{
            position: "absolute",
            top: 35,
            left: 0,
            width: "100%",
            boxShadow: "0px 3px 4px 0px #00000005",

            height: "100%",
            backgroundColor: "white",
            borderRadius: 4,
            zIndex: 9,
          }}>
            <SearchSuggestions textToHighlight={searchString as string} suggestions={suggestions} />
            <div>
              <div>See all results</div>
            </div>
          </div>
        }
      </div>
    </Fragment>
  );
}

function useEffectParseUrlToSearchState({
  router,
  setSearchString,
}: {
  router: NextRouter;
  setSearchString: (str: NullableString) => void;
}): void {
  useEffect(
    (): void =>
      setSearchString(((router?.query ?? {})?.[QUERY_PARAM] ?? [])[0] ?? null),
    []
  );
}

function RhSearchBarInput({
  handleKeyPress,
  pushSearchToUrlAndTrack,
  searchbarRef,
  searchString,
  setSearchString,
}: SearchProps): ReactElement {
  return (
    <div style={{ position: "relative" }}>
      <input
        className={css(styles.rhSearchBarInput)}
        placeholder="Search"
        onKeyDown={handleKeyPress}
        autoComplete="off"
        onChange={(event: ChangeEvent<HTMLInputElement>): void =>
          setSearchString(event?.target?.value ?? null)
        }
        value={searchString ?? ""}
        ref={searchbarRef}
        type="text"
      />
      <span
        className={css(styles.searchIcon)}
        onClick={pushSearchToUrlAndTrack}
      >
        {<FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>}
      </span>
    </div>
  );
}

function RhSearchBarExpandableInput({
  expendableSearchbarRef,
  handleKeyPress,
  pushSearchToUrlAndTrack,
  searchString,
  setSearchString,
}: SearchProps): ReactElement {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const handleClickOutside = (event) => {
      if (!expendableSearchbarRef?.current?.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expendableSearchbarRef]);

  return (
    <Fragment>
      {!isExpanded && (
        <span
          className={css(styles.searchIcon, styles.searchIconSmallScreen)}
          onClick={(): void => setIsExpanded(true)}
        >
          {<FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>}
        </span>
      )}
      {isExpanded && (
        <Fragment>
          <span
            className={css(styles.backButton)}
            onClick={(event: SyntheticEvent): void => {
              event.preventDefault();
              setIsExpanded(false);
            }}
          >
            {<FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>}
          </span>
          <input
            autoFocus
            className={css(styles.rhSearchBarExpandableInput)}
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setSearchString(event?.target?.value ?? null)
            }
            onKeyDown={handleKeyPress}
            placeholder="Search"
            ref={expendableSearchbarRef}
            type="text"
            value={searchString ?? ""}
          />
          <span
            className={css(
              styles.searchIcon,
              styles.searchIconSmallScreen,
              styles.searchIconExpandedFloaty
            )}
            onClick={(event: SyntheticEvent): void => {
              event.stopPropagation();
              pushSearchToUrlAndTrack();
            }}
            // prevents collapsing behavior
            onMouseDown={(event: SyntheticEvent): void =>
              event.stopPropagation()
            }
          >
            {<FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>}
          </span>
        </Fragment>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  rhSearchBarExpandableInputDisplay: {
    display: "none",
    width: 0,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "block",
      minWidth: 30,
    },
  },
  rhSearchBarExpandableInput: {
    bottom: 0,
    boxSizing: "border-box",
    fontSize: 20,
    height: 68 /* NAVBAR HEIGHT */,
    padding: "0 54px 0 36px",
    position: "fixed",
    right: 0,
    top: 0,
    width: "calc(100% - 80px)" /* adjusted leftbar width */,
    zIndex: 10,
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      padding: "0 52px",
      width: "100%" /* adjusted leftbar width */,
    },
  },
  rhSearchBarInputDisplay: {
    backgroundColor: "#fff",
    display: "block",
    position: "relative",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "none",
      width: 0,
    },
  },
  rhSearchBarInput: {
    alignItems: "center",
    background: "white",
    border: `1px solid ${colors.GREY_BORDER}`,
    borderRadius: 4,
    boxSizing: "border-box",
    display: "flex",
    fontSize: 16,
    height: "100%",
    maxHeight: 32,
    outline: "none",
    padding: "8px 32px 8px 16px",
    width: "100%",
    ":focus": {
      border: `1px solid ${colors.BLUE()}`,
    },
    "::placeholder": {
      opacity: 0.6,
    },
  },
  backButton: {
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 18,
    opacity: 0.6,
    padding: "4px 7px",
    position: "fixed",
    left: "86px",
    top: 20,
    zIndex: 11,
    ":hover": {
      background: colors.GREY(0.14) /* matching NavbarRightButtonGroup */,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      left: "12px",
    },
  },
  searchIcon: {
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    opacity: 1.0,
    padding: "4px 7px",
    position: "absolute",
    right: 6,
    top: 4,
    zIndex: 2,
    color: mainNavIcons.color,
    ":hover": {
      background: colors.GREY(0.14) /* matching NavbarRightButtonGroup */,
    },
  },
  searchIconSmallScreen: {
    fontSize: 19,
    position: "static",
    padding: "2px 11px",
    right: "unset",
    top: "unset",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  searchIconExpandedFloaty: {
    position: "fixed",
    right: 16,
    top: 20,
    zIndex: 11,
    ":hover": {
      color: colors.BLUE(),
    },
  },
});
