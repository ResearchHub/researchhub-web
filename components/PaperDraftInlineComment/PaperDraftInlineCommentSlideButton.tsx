import { css, StyleSheet } from "aphrodite";
import { isUndefined, nullToEmptyString } from "../../config/utils/nullchecks";
import React, {
  ReactElement,
  RefObject,
  SyntheticEvent,
  useEffect,
  useRef,
} from "react";
import colors from "../../config/themes/colors";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineCommentStore,
} from "./undux/InlineCommentUnduxStore";
import icons from "../../config/themes/icons";
import PaperDraftUnduxStore, {
  clearSelection,
  PaperDraftStore,
} from "../PaperDraft/undux/PaperDraftUnduxStore";

export const BUTTON_HEIGHT = 24;
export const BUTTON_WIDTH = 24;

function useEffectHandleClickOutside({
  buttonRef,
  inlineCommentStore,
  paperDraftStore,
  shouldShowButton,
}: {
  buttonRef: RefObject<HTMLDivElement>;
  inlineCommentStore: InlineCommentStore;
  paperDraftStore: PaperDraftStore;
  shouldShowButton: boolean;
}): void {
  // TODO: calvinhlee - figure out how to clear selection state
  const isRefNull = buttonRef != null && buttonRef.current == null;
  function onClickOutside(event: MouseEvent) {
    // @ts-ignore
    if (!isRefNull && !buttonRef.current.contains(event.target)) {
      cleanupStoreAndCloseDisplay({ inlineCommentStore });
      clearSelection({ paperDraftStore });
      document.removeEventListener("mousedown", onClickOutside);
    }
  }
  useEffect((): (() => void) => {
    if (!isRefNull && shouldShowButton) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return function cleanup() {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isRefNull, onClickOutside, shouldShowButton]);
}

export default function PaperDraftInlineCommentSlideButton(): ReactElement<
  "div"
> | null {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftUnduxStore.useStore();
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

  const closeButtonAndRenderThreadCard = (event: SyntheticEvent) => {
    clearSelection({ paperDraftStore });
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

  useEffectHandleClickOutside({
    buttonRef,
    inlineCommentStore,
    paperDraftStore,
    shouldShowButton,
  });

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
