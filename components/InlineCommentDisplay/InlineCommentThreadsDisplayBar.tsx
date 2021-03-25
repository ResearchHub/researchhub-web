import InlineCommentThreadsDisplayContainer from "./InlineCommentThreadsDisplayContainer";
import InlineCommentUnduxStore, {
  ID,
  InlineCommentStore,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import React, { ReactElement, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

type fetchInlineCommentThreadsArgs = {
  paperID: ID;
  inlineCommentStore: InlineCommentStore;
};

function fetchInlineCommentThreads({
  paperID,
  inlineCommentStore,
}: fetchInlineCommentThreadsArgs): void {
  /* Unlike Waypoint (which relies on paper parsing), 
     the source of truth for InlineComments is the backend. 
     Hence, comment displaying logic & updating unduxStore should happen with a fetch 
     TODO: calvinhlee - make api call here. */
}

function InlineCommentThreadsDisplayBar(): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");

  useEffect((): void => {
    fetchInlineCommentThreads({ paperID, inlineCommentStore });
  }, [paperID, inlineCommentStore]);

  const inlineComments = inlineCommentStore.get("inlineComments");
  const InlineCommentThreadsDisplayContainers = Object.keys(inlineComments).map(
    (
      blockKey: string
    ): ReactElement<typeof InlineCommentThreadsDisplayContainer> => (
      // NOTE: Thread-"s" are grouped by blockKey
      <InlineCommentThreadsDisplayContainer
        blockKey={blockKey}
        key={blockKey}
      />
    )
  );

  return (
    <div className={css(styles.container)}>
      {InlineCommentThreadsDisplayContainers}
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    background: "#fff",
    borderBottom: "1.5px solid #F0F0F0",
    borderTop: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-start",
    padding: "0 20px 0 5px",
    width: "100%",
  },
});

export default InlineCommentThreadsDisplayBar;
