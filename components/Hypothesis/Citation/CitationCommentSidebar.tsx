import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import { slide as SlideMenu } from "@quantfive/react-burger-menu";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";
import CitationCommentThreadComposer from "./CitationCommentThreadComposer";
import colors from "~/config/themes/colors";
import HypothesisUnduxStore, {
  HypothesisStore,
} from "../undux/HypothesisUnduxStore";
import icons from "~/config/themes/icons";
import DiscussionEntry from "~/components/Threads/DiscussionEntry";

const MEDIA_WIDTH_LIMIT = breakpoints.large.int;

type CitationCommentSidebarProps = {
  citationID: ID;
  citationThreadEntries: ReactElement<typeof DiscussionEntry>[];
  citationTitle: string;
  hypothesisUnduxStore: HypothesisStore;
  setLastUpdateTime: (time: number) => void;
};

type UseEffectFetchCitationThreadsArgs = {
  citationID: ID;
  lastUpdateTime: number;
  setCitationThreads: Function;
};

function useEffectFetchCitationThreads({
  citationID,
  lastUpdateTime,
  setCitationThreads,
}: UseEffectFetchCitationThreadsArgs): void {
  useEffect((): void => {}, [citationID, lastUpdateTime]);
}

export default function CitationCommentSidebarWithMedia(): ReactElement<"div"> | null {
  const [shouldRenderWithSlide, setShouldRenderWithSlide] = useState<boolean>(
    MEDIA_WIDTH_LIMIT > getCurrMediaWidth()
  );

  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
  const targetCitationComment = hypothesisUnduxStore.get(
    "targetCitationComment"
  );
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [citationThreads, setCitationThreads] = useState<any>([]);
  const { citationID, citationTitle = "" } = targetCitationComment ?? {};

  useEffectFetchCitationThreads({
    citationID,
    lastUpdateTime,
    setCitationThreads,
  });

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void =>
      setShouldRenderWithSlide(MEDIA_WIDTH_LIMIT > newMediaWidth),
  });

  const citationThreadEntries = citationThreads.map((yoyo, index) => (
    <DiscussionEntry
      key={index}
      data={yoyo}
      discussionCount={0}
      hoverEvents
      mediaOnly
      noVoteLine
      withPadding
    />
  ));

  const citationCommentSidebarProps: CitationCommentSidebarProps = {
    citationID,
    citationThreadEntries,
    citationTitle,
    hypothesisUnduxStore,
    setLastUpdateTime,
  };

  return shouldRenderWithSlide ? (
    <div className={css(styles.citationCommentMobile)}>
      <SlideMenu
        right
        width={"100%"}
        isOpen={true}
        styles={burgerMenuStyle}
        customBurgerIcon={false}
      >
        <CitationCommentSidebar {...citationCommentSidebarProps} />
      </SlideMenu>
    </div>
  ) : (
    <div className={css(styles.inlineSticky)}>
      <CitationCommentSidebar {...citationCommentSidebarProps} />
    </div>
  );
}

function CitationCommentSidebar({
  citationID,
  citationThreadEntries,
  citationTitle,
  hypothesisUnduxStore,
  setLastUpdateTime,
}: CitationCommentSidebarProps): ReactElement<"div"> {
  return (
    <div className={css(styles.citationCommentSidebar)}>
      <div className={css(styles.header)}>
        <div
          className={css(styles.backButton)}
          onClick={(): void =>
            hypothesisUnduxStore.set("targetCitationComment")(null)
          }
        >
          {icons.arrowRight}
          <span className={css(styles.marginLeft8)}>Hide</span>
        </div>
      </div>
      <CitationCommentThreadComposer
        citationID={citationID}
        citationTitle={citationTitle ?? ""}
        onCancel={(): void => {
          hypothesisUnduxStore.set("targetCitationComment")(null);
        }}
        onSubmitSuccess={(): void => setLastUpdateTime(Date.now())}
      />
      {citationThreadEntries.length > 0 ? (
        <div className={css(styles.citationThreadEntriesWrap)}>
          {citationThreadEntries}
        </div>
      ) : null}
    </div>
  );
}

const burgerMenuStyle = {
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "26px",
    width: "26px",
    color: "#FFF",
    display: "none",
    visibility: "hidden",
  },
  bmCross: {
    background: "#bdc3c7",
    display: "none",
    visibility: "hidden",
  },
  bmMenuWrap: {
    position: "fixed",
    top: 0,
    zIndex: 10,
    overflowY: "auto",
    width: "85%",
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
    overflowY: "auto",
    width: "100%",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "auto",
    borderTop: "1px solid rgba(255,255,255,.2)",
    ":focus": {
      outline: "none",
    },
  },
  bmItem: {
    display: "inline-block",
    margin: "15px 0 15px 0",
    color: "#FFF",
    ":focus": {
      outline: "none",
    },
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9,
    bottom: 0,
  },
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    display: "flex",
    textDecoration: "none",
    "@media only screen and (max-width: 1023px)": {
      paddingLeft: 8,
      width: "100%",
      height: "100%",
    },
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  citationThreadEntriesWrap: {
    height: "100%",
    overflowY: "auto",
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      border: "none",
    },
  },
  header: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    positioin: "relative",
    marginBottom: 16,
    "@media only screen and (max-width: 1199px)": {
      padding: 16,
    },
  },
  citationCommentSidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: 1000,
    width: 400,
    ":focus": {
      outline: "none",
    },
    "@media only screen and (max-width: 1199px)": {
      width: "100%",
    },
  },
  inlineSticky: {
    position: "sticky",
    top: 60,
  },
  marginLeft8: {
    marginLeft: 8,
  },
  citationCommentMobile: {
    display: "none",
    "@media only screen and (max-width: 1199px)": {
      display: "block",
    },
  },
});
