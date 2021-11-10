import { breakpoints } from "~/config/themes/screen";
import { burgerMenuStyle } from "~/components/InlineCommentDisplay/InlineCommentThreadsDisplayBar";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
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
  useEffect(
    (): void =>
      fetchCitationsThreads({
        onSuccess: (threads: any): void => setCitationThreads(threads),
        onError: emptyFncWithMsg,
        citationID,
      }),
    [citationID, lastUpdateTime]
  );
}

export default function CitationCommentSidebarWithMedia(): ReactElement<"div"> | null {
  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [citationThreads, setCitationThreads] = useState<any>([]);
  const [shouldRenderWithSlide, setShouldRenderWithSlide] = useState<boolean>(
    MEDIA_WIDTH_LIMIT > getCurrMediaWidth()
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
      setShouldRenderWithSlide(MEDIA_WIDTH_LIMIT > newMediaWidth),
  });

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

  return shouldRenderWithSlide ? (
    <div className={css(styles.citationCommentMobile)}>
      <SlideMenu
        customBurgerIcon={false}
        isOpen
        right
        styles={burgerMenuStyle}
        width={"100%"}
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
