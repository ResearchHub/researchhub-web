import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { pickFiltersForApp, QUERY_PARAM } from "~/config/utils/search";
import { trackEvent } from "~/config/utils/analytics";
import { useRouter } from "next/router";
import { useSelector, useStore } from "react-redux";
import {
  useState,
  useEffect,
  useRef,
  Fragment,
  ReactElement,
  RefObject,
} from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";
import { NullableString } from "~/config/types/root_types";
import { isServer } from "~/config/server/isServer";

const RETURN_KEY = 13;
const DEFAULT_EXPANDED_SEARCH_HEIGHT = 66;

type SearchProps = {
  expendableSearchbarRef?: RefObject<HTMLInputElement>;
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

  const blurAndCloseDeviceKeyboard = (): void => {
    if (isServer()) {
      return;
    } else {
      // @ts-ignore incomplete ts definition. activeElement exits
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
    pushSearchToUrlAndTrack,
    searchbarRef,
    searchString,
    setSearchString,
  };

  return (
    <Fragment>
      <div
        children={<RhSearchBarInput {...searchProps} />}
        style={{
          display: "block",
          width: "100%",
          [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
            display: "none",
            width: 0,
          },
        }}
      />
      <div
        children={<RhSearchBarExpandableInput {...searchProps} />}
        style={{
          display: "none",
          width: 0,
          [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
            display: "block",
          },
        }}
      />
    </Fragment>
  );
}

function RhSearchBarInput({}: SearchProps): ReactElement {
  return <></>;
}

function RhSearchBarExpandableInput({}: SearchProps): ReactElement {
  return <></>;
}
