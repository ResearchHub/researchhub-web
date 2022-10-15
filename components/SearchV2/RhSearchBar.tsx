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
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

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
  const [searchString, setSearchString] = useState<NullableString>(
    ((router?.query ?? {})?.[QUERY_PARAM] ?? [])[0] ?? null
  );
  const expendableSearchbarRef = useRef<HTMLInputElement>(null);
  const searchbarRef = useRef<HTMLInputElement>(null);

  useEffectParseUrlToSearchState({ router, setSearchString });

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

  return (
    <Fragment>
      <div
        children={<RhSearchBarExpandableInput {...searchProps} />}
        className={css(styles.rhSearchBarExpandableInputDisplay)}
      />
      <div
        children={<RhSearchBarInput {...searchProps} />}
        className={css(styles.rhSearchBarInputDisplay)}
      />
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
        {icons.search}
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
          className={css(styles.searchIcon, styles.searchIconLarge)}
          onClick={(): void => setIsExpanded(true)}
        >
          {icons.search}
        </span>
      )}
      {isExpanded && (
        <Fragment>
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
            className={css(styles.searchIcon, styles.searchIconXLarge)}
            onClick={(event: SyntheticEvent): void => {
              event.stopPropagation();
              pushSearchToUrlAndTrack();
            }}
            // prevents collapsing behavior
            onMouseDown={(event: SyntheticEvent): void =>
              event.stopPropagation()
            }
          >
            {icons.search}
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
    height: 64 /* NAVBAR HEIGHT */,
    position: "fixed",
    right: 0,
    top: 0,
    width: "calc(100% - 160px)" /* adjusted leftbar width */,
    zIndex: 10,
    fontSize: 20,
    padding: "0 52px 0 20px",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      width: "calc(100% - 76px)" /* adjusted leftbar width */,
    },
  },
  rhSearchBarInputDisplay: {
    backgroundColor: "#fff",
    display: "block",
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
    padding: "8px 32px 8px 8px",
    width: "100%",
    ":focus": {
      border: `1px solid ${colors.BLUE()}`,
    },
    "::placeholder": {
      opacity: 0.6,
    },
  },
  searchIcon: {
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    opacity: 0.4,
    padding: "4px 7px",
    position: "absolute",
    right: 6,
    top: 4,
    zIndex: 2,
    ":hover": {
      background: colors.GREY(0.14) /* matching NavbarRightButtonGroup */,
    },
  },
  searchIconLarge: {
    fontSize: 17,
    position: "static",
    right: "unset",
    top: "unset",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  searchIconXLarge: {
    fontSize: 20,
    position: "fixed",
    right: 16,
    top: 20,
    zIndex: 11,
    ":hover": {
      color: colors.BLUE(),
    },
  },
});
