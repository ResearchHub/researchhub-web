import { css, StyleSheet } from "aphrodite";
import { isUndefined, nullToEmptyString } from "../../config/utils/nullchecks";
import React, { ReactElement, SyntheticEvent, useRef } from "react";
import colors from "../../config/themes/colors";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
} from "./undux/InlineCommentUnduxStore";
import icons from "../../config/themes/icons";

export const BUTTON_HEIGHT = 24;
export const BUTTON_WIDTH = 24;

export default function PaperDraftInlineCommentSlideButton(): ReactElement<
  "div"
> | null {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const buttonRef = useRef<HTMLDivElement>(null);

  const promptedEntityKey = inlineCommentStore.get("promptedEntityKey");
  const {
    blockKey,
    entityKey: preparedEntityKey,
    highlightedText,
    offsetTop,
  } = inlineCommentStore.get("preparingInlineComment");
  const displayableOffsetTop = (offsetTop || 0) - BUTTON_HEIGHT / 2;
  const shouldShowButton =
    promptedEntityKey != null ||
    (preparedEntityKey != null && displayableOffsetTop > -1);
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );

  console.warn("displayableInlineComments: ", displayableInlineComments);

  const closeButtonAndRenderThreadCard = (event: SyntheticEvent) => {
    // TODO: calvinhlee - figure out how to clear selection state
    cleanupStoreAndCloseDisplay({
      inlineCommentStore,
    });
    const newInlineComment = {
      blockKey: nullToEmptyString(blockKey),
      commentThreadID: null,
      entityKey: nullToEmptyString(preparedEntityKey),
      highlightedText: nullToEmptyString(highlightedText),
      store: inlineCommentStore,
    };
    inlineCommentStore.set("displayableInlineComments")([newInlineComment]);
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
      ref={buttonRef}
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
    zIndex: 10000000,
    width: BUTTON_WIDTH,
    ":hover": {
      backgroundColor: colors.GREY(1),
    },
  },
});
