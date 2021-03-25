import { css, StyleSheet } from "aphrodite";
import InlineCommentUnduxStore, {
  ID,
  InlineComment,
  InlineCommentStore,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import React, { ReactElement, useEffect } from "react";
<<<<<<< HEAD
import InlineCommentThreadCard from "./InlineCommentThreadCard";
=======
import { StyleSheet, css } from "aphrodite";
>>>>>>> ed1f997e (rendering comment bar with sticky)

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

  useEffect((): void => {
    fetchInlineCommentThreads({ paperID, inlineCommentStore });
  }, [paperID, inlineCommentStore]);

  const inlineComments = inlineCommentStore.get("inlineComments");
  const commentThreadCards = inlineComments.map(
    (
      inlineComment: InlineComment
    ): ReactElement<typeof InlineCommentThreadCard> => (
      <InlineCommentThreadCard
        inlineComment={inlineComment}
        key={inlineComment.entityKey}
      />
    )
  );

  return (
    <div className={css(styles.InlineCommentThreadsDisplayBar)}>
      {commentThreadCards}
    </div>
  );
}

const styles = StyleSheet.create({
  InlineCommentThreadsDisplayBar: {
    height: 900,
    overflow: "auto",
    width: 350,
  },
});
