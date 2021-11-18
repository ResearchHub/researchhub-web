import { breakpoints } from "~/config/themes/screen";
import { burgerMenuStyle } from "~/components/InlineCommentDisplay/InlineCommentThreadsDisplayBar";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg, isNullOrUndefined } from "~/config/utils/nullchecks";
import { fetchCitationsThreads } from "../api/fetchCitationThreads";
import { ID } from "~/config/types/root_types";
import { ReactElement, useEffect, useState } from "react";
import { slide as SlideMenu } from "@quantfive/react-burger-menu";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";
import CitationCommentThreadComposer from "./CitationCommentThreadComposer";
import colors from "~/config/themes/colors";
import DiscussionEntry from "~/components/Threads/DiscussionEntry";
import HypothesisUnduxStore, {
  HypothesisStore,
} from "../undux/HypothesisUnduxStore";
import icons from "~/config/themes/icons";

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
  useEffect((): void => {
    if (isNullOrUndefined(citationID)) {
      return;
    }
    fetchCitationsThreads({
      onSuccess: (threads: any): void => setCitationThreads(threads),
      onError: emptyFncWithMsg,
      citationID,
    });
  }, [citationID, lastUpdateTime]);
}

export default function CitationCommentSidebarWithMedia(): ReactElement<"div"> | null {
  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [citationThreads, setCitationThreads] = useState<any>([]);
  const [isRegScreenSize, setIsRegScreenSize] = useState<boolean>(
    getCurrMediaWidth() > MEDIA_WIDTH_LIMIT
  );

  const targetCitationComment = hypothesisUnduxStore.get(
    "targetCitationComment"
  );
  const { citationID, citationTitle = "" } = targetCitationComment ?? {};

  useEffectFetchCitationThreads({
    citationID,
    lastUpdateTime,
    setCitationThreads,
  });

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void =>
      setIsRegScreenSize(newMediaWidth > MEDIA_WIDTH_LIMIT),
  });

  if (isNullOrUndefined(citationID)) {
    return null;
  }

  const citationCommentSidebarProps: CitationCommentSidebarProps = {
    citationID,
    citationThreadEntries: citationThreads.map(
      (citationThread: any, index: number) => (
        <DiscussionEntry
          data={citationThread}
          discussionCount={(citationThread.comments ?? []).length}
          key={`citation-thread-entry-id-${citationThread.id}-${index}`}
          mediaOnly
          noRespond
          noVote
          shouldShowContextTitle={false}
          withPadding
        />
      )
    ),
    citationTitle,
    hypothesisUnduxStore,
    setLastUpdateTime,
  };

  return (
    <div className={css(styles.citationCommentMobile)}>
      <SlideMenu
        customBurgerIcon={false}
        isOpen={!isNullOrUndefined(citationID)}
        right
        styles={
          isRegScreenSize
            ? regBurgerMenuStyleOverride
            : subLargeBurgerMenuStyleOverride
        }
        width={"100%"}
        handleClose={() => {
          alert("HI");
          hypothesisUnduxStore.set("targetCitationComment")(null);
        }}
      >
        <CitationCommentSidebar {...citationCommentSidebarProps} />
      </SlideMenu>
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
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      paddingLeft: 8,
      width: "100%",
      height: "100%",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      top: -118,
      left: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
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
    [`@media only screen and (max-width: ${breakpoints.large.int - 1}px)`]: {
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
    [`@media only screen and (max-width: ${breakpoints.large.int - 1}px)`]: {
      width: "100%",
    },
    marginTop: 16,
  },
  inlineSticky: {
    position: "sticky",
    top: 100,
  },
  marginLeft8: {
    marginLeft: 8,
  },
  citationCommentMobile: {
    display: "block",
  },
});

const regBurgerMenuStyleOverride = {
  ...burgerMenuStyle,
  bmOverlay: {
    background: "transparent",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9,
    bottom: 0,
  },
  bmMenuWrap: {
    position: "fixed",
    top: 0,
    zIndex: 10,
    overflowY: "auto",
    width: "30%",
    maxWidth: 420 /* matched with citationCommentThreadComposer */,
    borderLeft: `1px solid ${colors.LIGHT_GREY(1)}`,
    boxShadow: `0px 0px 0px 4px rgb(0 0 0 / 2%)`,
    [`@media only screen and (max-width: ${breakpoints.xxlarge.str})`]: {
      maxWidth: "unset",
      width: "85%",
    },
  },
  bmItemList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const subLargeBurgerMenuStyleOverride = {
  ...burgerMenuStyle,
  bmOverlay: {
    background: "transparent",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9,
    bottom: 0,
  },
  bmMenuWrap: {
    position: "fixed",
    top: 0,
    zIndex: 10,
    overflowY: "auto",
    borderLeft: `1px solid ${colors.LIGHT_GREY(1)}`,
    boxShadow: `0px 0px 0px 4px rgb(0 0 0 / 2%)`,
    width: "60%",
  },
  bmItemList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
