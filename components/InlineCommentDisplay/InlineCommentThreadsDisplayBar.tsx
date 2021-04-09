import colors from "../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import icons from "../../config/themes/icons";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import React, { ReactElement } from "react";
// @ts-ignore

type Props = { isShown: boolean };

export default function InlineCommentThreadsDisplayBar({
  isShown,
}: Props): ReactElement<"div"> {
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
  backButton: {
    display: "flex",
    alignItems: "center",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    textDecoration: "none",
    "@media only screen and (max-width: 1023px)": {
      paddingLeft: 8,
      width: "100%",
      height: "100%",
    },
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
      // width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  header: {
    positioin: "relative",
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    "@media only screen and (max-width: 1023px)": {
      height: 50,
    },
  },
  inlineCommentThreadsDisplayBar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: 1000,
    width: 400,
    "@media only screen and (max-width: 1023px)": {
      width: "100%",
    },
    ":focus": {
      outline: "none",
    },
  },
  marginLeft8: {
    marginLeft: 8,
  },
});
