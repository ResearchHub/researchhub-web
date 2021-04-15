import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useEffect, useState } from "react";
import colors from "../../config/themes/colors";
import InlineCommentUnduxStore from "./undux/InlineCommentUnduxStore";
import icons from "../../config/themes/icons";

export const BUTTON_HEIGHT = 24;
export const BUTTON_WIDTH = 24;

function isUndefined(str: string): boolean {
  return str === "undefined";
}

export default function PaperDraftInlineCommentSlideButton(): ReactElement<
  "div"
> | null {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const promptedEntityKey = inlineCommentStore.get("promptedEntityKey");
  const offsetTop = inlineCommentStore.get("promptedEntityOffsetTop") || 0;
  const shouldShowButton = (promptedEntityKey != null && offsetTop) > 0;

  if (
    isUndefined(typeof window) ||
    isUndefined(typeof document) ||
    !shouldShowButton
  ) {
    return null;
  }

  const displayableOffsetTop = offsetTop - BUTTON_HEIGHT / 2;

  return (
    <div
      style={{ top: displayableOffsetTop }}
      className={css([styles.PaperDraftInlineCommentSlideButton])}
    >
      {icons.plus}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentSlideButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: `1px solid ${colors.GREY(0.8)}`,
    borderRadius: 5,
    color: colors.BLUE(1),
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: BUTTON_HEIGHT,
    justifyContent: "center",
    padding: 8,
    position: "absolute",
    right: -55 /* arbitrary css decision based on look */,
    width: BUTTON_WIDTH,
    ":hover": {
      backgroundColor: colors.GREY(0.8),
    },
  },
});
