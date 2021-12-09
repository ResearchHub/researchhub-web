import { css, StyleSheet } from "aphrodite";
import {
  isNullOrUndefined,
  nullToEmptyString,
} from "../../config/utils/nullchecks";
import { connect } from "react-redux";
import { ReactElement, RefObject, SyntheticEvent, useEffect, useRef } from "react";
import colors from "../../config/themes/colors";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  InlineCommentStore,
} from "./undux/InlineCommentUnduxStore";
import icons from "../../config/themes/icons";
import PaperDraftUnduxStore, {
  clearSelection,
  PaperDraftStore,
  revertBackToSavedState,
} from "../PaperDraft/undux/PaperDraftUnduxStore";
import { ModalActions } from "../../redux/modals";

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
  const isRefNull = buttonRef != null && buttonRef.current == null;
  function onClickOutside(event: MouseEvent) {
    // @ts-ignore
    if (!isRefNull && !buttonRef.current.contains(event.target)) {
      revertBackToSavedState({ paperDraftStore });
      cleanupStoreAndCloseDisplay({ inlineCommentStore });
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

function PaperDraftInlineCommentSlideButton({
  isLoggedIn,
  openLoginModal,
}): ReactElement<"div"> | null {
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
    if (!isLoggedIn) {
      openLoginModal(true, "Please sign in with Google to add a comment.");
      return;
    }
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
    isNullOrUndefined(typeof window) ||
    isNullOrUndefined(typeof document) ||
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
      {icons.plusThick}
    </div>
  );
}

const styles = StyleSheet.create({
  PaperDraftInlineCommentSlideButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: `2px solid ${colors.BLUE(1)}`,
    borderRadius: 5,
    color: colors.BLUE(1),
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    height: BUTTON_HEIGHT,
    justifyContent: "center",
    padding: 8,
    position: "absolute",
    right: -52 /* arbitrary css decision based on look */,
    zIndex: 1,
    width: BUTTON_WIDTH,
    ":hover": {
      opacity: 0.8,
      // backgroundColor: colors.GREY(.2),
    },
  },
});

// TODO: Change this to useSelector
const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperDraftInlineCommentSlideButton);
