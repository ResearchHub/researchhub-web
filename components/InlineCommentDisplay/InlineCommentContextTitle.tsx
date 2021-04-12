import { css, StyleSheet } from "aphrodite";
import colors from "../../config/themes/colors";
import React, { ReactElement } from "react";
import {
  getScrollToTargetElFnc,
  getTargetInlineDraftEntityEl,
} from "./util/InlineCommentThreadUtil";
import { ID } from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

type Props = {
  commentThreadID: ID;
  entityKey: ID;
  onScrollSuccess: () => void;
  title: string;
};

export default function InlineCommentContextTitle({
  commentThreadID,
  entityKey,
  onScrollSuccess,
  title,
}: Props): ReactElement<"div"> {
  const animateAndScrollToTarget = getScrollToTargetElFnc({
    onSuccess: onScrollSuccess,
    targetElement: getTargetInlineDraftEntityEl({
      commentThreadID,
      entityKey,
    }),
  });
  return (
    <div
      className={css(styles.headerHighlightedTextContainer)}
      onClick={animateAndScrollToTarget}
      role="none"
    >
      <span className={css(styles.headerHighlightedText)}>{title}</span>
    </div>
  );
}

const styles = StyleSheet.create({
  headerHighlightedTextContainer: {
    alignItems: "center",
    borderLeft: `4px solid ${colors.GREY(1)}`,
    boxSizing: "border-box",
    display: "flex",
    fontFamily: "CharterBT",
    height: 24,
  },
  headerHighlightedText: {
    boxSizing: "border-box",
    color: colors.GREY(1),
    cursor: "pointer",
    fontSize: 16,
    fontStyle: "italic",
    maxWidth: 920,
    padding: 16,
    textOverflow: "ellipsis",
    width: "100%",
  },
});
