import colors from "../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import icons from "../../config/themes/icons";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import React, { ReactElement } from "react";

export default function InlineCommentThreadsDisplayBar(): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );

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
        <div
          className={css(styles.backButton)}
          onClick={(): void =>
            cleanupStoreAndCloseDisplay({ inlineCommentStore })
          }
        >
          {icons.arrowRight}
          <span className={css(styles.marginLeft8)}>Hide</span>
        </div>
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
  backButton: {
    color: colors.BLACK(0.5),
    textDecoration: "none",
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
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
  marginLeft8: {
    marginLeft: 8,
  },
});
