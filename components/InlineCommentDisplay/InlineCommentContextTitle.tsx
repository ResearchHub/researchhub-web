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
    background: "#fff",
    borderRadius: 4,
    boxShadow: "rgb(0 0 0 / 10%) 2px 8px 8px",
    boxSizing: "border-box",
    display: "flex",
    fontWeight: 500,
    maxWidth: "100%",
    fontFamily: "CharterBT",
  },
  headerHighlightedText: {
    backgroundColor: "rgb(204 243 221)",
    boxSizing: "border-box",
    color: colors.BLACK(0.8),
    fontSize: 14,
    borderRadius: 4,
    maxWidth: 920,
    padding: 16,
    textOverflow: "ellipsis",
    width: "100%",
    cursor: "pointer",
  },
});
