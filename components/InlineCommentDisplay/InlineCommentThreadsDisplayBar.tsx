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
    height: "100%",
    overflowY: "auto",
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
