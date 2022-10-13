import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import {
  ChangeEvent,
  ChangeEventHandler,
  Fragment,
  KeyboardEventHandler,
  ReactElement,
  RefObject,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { pickFiltersForApp, QUERY_PARAM } from "~/config/utils/search";
import { trackEvent } from "~/config/utils/analytics";
import { NextRouter, useRouter } from "next/router";
import { useStore } from "react-redux";
import { isServer } from "~/config/server/isServer";
import { NullableString } from "~/config/types/root_types";
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
  handleKeyPress,
  expendableSearchbarRef,
  pushSearchToUrlAndTrack,
  searchString,
  setSearchString,
}: SearchProps): ReactElement {
  return <></>;
}

const styles = StyleSheet.create({
  rhSearchBarExpandableInputDisplay: {
    display: "none",
    width: 0,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "block",
    },
  },
  rhSearchBarInputDisplay: {
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
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 4,
    boxSizing: "border-box",
    display: "flex",
    fontSize: 14,
    height: "100%",
    maxHeight: 32,
    outline: "none",
    padding: 10,
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
      background: colors.GREY(0.14), /* matching NavbarRightButtonGroup */
    },
  },
});
