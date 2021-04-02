import { css, StyleSheet } from "aphrodite";
import InlineCommentUnduxStore, {
  ID,
  InlineComment,
  InlineCommentStore,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import React, { ReactElement } from "react";
import InlineCommentThreadCard from "./InlineCommentThreadCard";

export default function InlineCommentThreadsDisplayBar(): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );

  const cleanupStoreAndCloseDisplay = (): void => {
    const commentsWithThreadID = inlineCommentStore
      .get("inlineComments")
      .filter(
        (inlineComment: InlineComment): boolean =>
          inlineComment.commentThreadID != null
      );
    inlineCommentStore.set("displayableInlineComments")([]);
    inlineCommentStore.set("inlineComments")(commentsWithThreadID);
  };

  const commentThreadCards = displayableInlineComments.map(
    (
      inlineComment: InlineComment
    ): ReactElement<typeof InlineCommentThreadCard> => (
      <InlineCommentThreadCard
        cleanupStoreAndCloseDisplay={cleanupStoreAndCloseDisplay}
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
          onClick={cleanupStoreAndCloseDisplay}
          src={"/static/icons/close.png"}
        />
      </div>
      {commentThreadCards}
    </div>
  );
}

const styles = StyleSheet.create({
  inlineCommentThreadsDisplayBar: {
    flexDirection: "column",
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
