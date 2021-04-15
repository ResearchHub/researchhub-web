import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, SyntheticEvent } from "react";
import colors from "../../config/themes/colors";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";
import icons from "../../config/themes/icons";

export const BUTTON_HEIGHT = 24;
export const BUTTON_WIDTH = 24;

function isUndefined(given: any): boolean {
  return given === "undefined" || typeof given === "undefined" || given == null;
}

function nullToEmptyString(given: string | undefined | null): string {
  return given || "";
}

export default function PaperDraftInlineCommentSlideButton(): ReactElement<
  "div"
> | null {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const {
    blockKey,
    entityKey,
    highlightedText,
    offsetTop,
  } = inlineCommentStore.get("promptedInlineComment");
  const displayableOffsetTop = (offsetTop || 0) - BUTTON_HEIGHT / 2;
  const shouldShowButton = entityKey != null && displayableOffsetTop > -1;

  const closeButtonAndRenderThreadCard = (_event: SyntheticEvent) => {
    const newInlineComment = {
      blockKey: nullToEmptyString(blockKey),
      commentThreadID: null,
      entityKey: nullToEmptyString(entityKey),
      highlightedText: nullToEmptyString(highlightedText),
      store: inlineCommentStore,
    };
    updateInlineComment({
      store: inlineCommentStore,
      updatedInlineComment: newInlineComment,
    });
    inlineCommentStore.set("displayableInlineComments")([newInlineComment]);
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    cleanupStoreAndCloseDisplay({
      inlineCommentStore,
    });
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([
        ...inlineCommentStore.get("silencedPromptKeys"),
        entityKey || "",
      ])
    );
  };

  if (
    isUndefined(typeof window) ||
    isUndefined(typeof document) ||
    !shouldShowButton
  ) {
    return null;
  }

  return (
    <div
      className={css(styles.PaperDraftInlineCommentSlideButton)}
      onClick={closeButtonAndRenderThreadCard}
      role="none"
      style={{ top: displayableOffsetTop }}
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
