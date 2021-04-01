import { css, StyleSheet } from "aphrodite";
import InlineCommentUnduxStore, {
  ID,
  InlineComment,
  InlineCommentStore,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import React, { ReactElement, useEffect } from "react";
import InlineCommentThreadCard from "./InlineCommentThreadCard";

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

export default function InlineCommentThreadsDisplayBar(): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );
  useEffect((): void => {
    fetchInlineCommentThreads({ paperID, inlineCommentStore });
  }, [paperID, inlineCommentStore]);

  const commentThreadCards = displayableInlineComments.map(
    (
      inlineComment: InlineComment
    ): ReactElement<typeof InlineCommentThreadCard> => (
      <InlineCommentThreadCard
        key={inlineComment.entityKey}
        unduxInlineComment={inlineComment}
      />
    )
  );

  return (
    <div className={css(styles.inlineCommentThreadsDisplayBar)}>
      <div className={css(styles.header)}>
        <img
          alt={"Close Button"}
          className={css(styles.closeButton)}
          onClick={(): void =>
            inlineCommentStore.set("displayableInlineComments")([])
          }
          src={"/static/icons/close.png"}
        />
      </div>
      {commentThreadCards}
    </div>
  );
}

const styles = StyleSheet.create({
  inlineCommentThreadsDisplayBar: {
    // background: "yellow",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    width: 350,
  },
  header: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    height: "100%",
    justifyContent: "flex-start",
    width: "100%",
  },
  closeButton: {
    width: 16,
  },
});
