import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useEffect, useState } from "react";
import colors from "../../config/themes/colors";
import { formatTextWrapID } from "./util/PaperDraftInlineCommentUtil";
import InlineCommentUnduxStore from "./undux/InlineCommentUnduxStore";

const BUTTON_HEIGHT = 24;
const BUTTON_WIDTH = 24;

export default function PaperDraftInlineCommentSlideButton(): ReactElement<
  "div"
> | null {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const promptedEntityKey = inlineCommentStore.get("promptedEntityKey");
  const shouldShowButton = promptedEntityKey != null;
  console.warn("promptedEntityKey: ", promptedEntityKey);

  if (typeof window === "undefined") {
    return null;
  }

  const [offsetTop, setOffsetTop] = useState<number>(0);
  const htmlEntityEl = document.getElementById(
    formatTextWrapID(promptedEntityKey)
  );

  useEffect((): void => {
    if (shouldShowButton && htmlEntityEl != null) {
      setOffsetTop((htmlEntityEl || {}).offsetTop || 0 - BUTTON_HEIGHT / 2);
    }
  }, [shouldShowButton, htmlEntityEl]);

  return (
    <div
      style={{ top: offsetTop }}
      className={css([styles.PaperDraftInlineCommentSlideButton])}
    >
      Hi this is BUTTON
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentSlideButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: `1px solid ${colors.GREY(0.8)}`,
    borderRadius: 5,
    cursor: "pointer",
    display: "flex",
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
