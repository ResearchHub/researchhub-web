import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { pickFiltersForApp, QUERY_PARAM } from "~/config/utils/search";
import { trackEvent } from "~/config/utils/analytics";
import { useRouter } from "next/router";
import { useSelector, useStore } from "react-redux";
import { useState, useEffect, useRef, Fragment, ReactElement } from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import PropTypes from "prop-types";
import { NullableString } from "~/config/types/root_types";
import { isServer } from "~/config/server/isServer";

const RETURN_KEY = 13;
const DEFAULT_EXPANDED_SEARCH_HEIGHT = 66;

type SearchProps = {
  expendableSearchbarRef?: HTMLInputElement;
  searchbarRef?: HTMLInputElement;
  searchString: NullableString;
  setSearchString: (query: NullableString) => void;
};

function RhSearchBarInput({}): ReactElement {
  return <></>;
}

function RhSearchBarExpandableInput({}): ReactElement {
  return <></>;
}

/* 
  The real execution of search is being done at the page level. 
  The only real responsibility of this component is to push the query to URL for the page to read
*/
export default function RhSearchBar({}): ReactElement {
  const auth = useStore()?.getState()?.auth;
  const router = useRouter();
  const [searchString, setSearchString] = useState<NullableString>(
    // Extracting query "q" from the URL
    ((router?.query ?? {})?.[QUERY_PARAM] ?? [])[0] ?? null
  );
  const expendableSearchbarRef = useRef<HTMLInputElement>(null);
  const searchbarRef = useRef<HTMLInputElement>(null);

  const blurAndCloseDeviceKeyboard = () => {
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

  return <Fragment></Fragment>;
}
