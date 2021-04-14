import { css, StyleSheet } from "aphrodite";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  findTargetInlineComment,
  getSavedInlineCommentsGivenBlockKeyAndThreadID,
} from "./undux/InlineCommentUnduxStore";
import { formatTextWrapID } from "./util/PaperDraftInlineCommentUtil";
import { getTargetInlineDraftEntityEl } from "../InlineCommentDisplay/util/InlineCommentThreadUtil";
import PaperDraftStore from "../PaperDraft/undux/PaperDraftUnduxStore";
import React, {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type useClickOutsideEffectArgs = {
  entityEl: HTMLElement | null;
  isBeingPrompted: boolean;
  isReadyToAddListener: boolean;
  onClickOutside: (event: SyntheticEvent) => void;
  setIsReadyToAddListener: (flag: boolean) => void;
};

/* Caution: don't modify unless you know what you're doing */
function useClickOutsideEffect({
  entityEl,
  isBeingPrompted,
  isReadyToAddListener,
  onClickOutside,
  setIsReadyToAddListener,
}: useClickOutsideEffectArgs) {
  function handleClickOutside(event) {
    if (isReadyToAddListener) {
      setIsReadyToAddListener(false);
    }
    if (entityEl != null && !entityEl.contains(event.target)) {
      document.removeEventListener("mousedown", handleClickOutside);
      onClickOutside(event);
    }
  }
  useEffect(() => {
    if (entityEl != null && isBeingPrompted && isReadyToAddListener) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  }, [
    entityEl,
    isBeingPrompted,
    isReadyToAddListener,
    onClickOutside,
    setIsReadyToAddListener,
  ]);
}

export default function PaperDraftInlineCommentTextWrapWithSlideButton(
  {
    blockKey,
    children,
    contentState,
    decoratedText,
    entityKey,
  } /* Props passed down from draft-js. See documentations for decorators */
): ReactElement<"span"> {
  const [isReadyToAddListener, setIsReadyToAddListener] = useState<boolean>(
    true
  );
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftStore.useStore();
  const animatedEntityKey = inlineCommentStore.get("animatedEntityKey");
  const animatedTextCommentID = inlineCommentStore.get("animatedTextCommentID");
  const silencedPromptKeys = inlineCommentStore.get("silencedPromptKeys");
  const { commentThreadID } = contentState.getEntity(entityKey).getData();
  const isCommentSavedInBackend = commentThreadID != null;
  const doesCommentExistInStore =
    findTargetInlineComment({
      blockKey,
      commentThreadID,
      entityKey,
      store: inlineCommentStore,
    }) != null;
  const isBeingPrompted =
    inlineCommentStore.get("promptedEntityKey") === entityKey &&
    !silencedPromptKeys.has(entityKey);
  const shouldTextBeHighlighted = useMemo<boolean>(
    (): boolean => doesCommentExistInStore || isCommentSavedInBackend,
    [doesCommentExistInStore, isCommentSavedInBackend]
  );
  const isCurrentCommentTextActive = useMemo<boolean>(
    (): boolean =>
      shouldTextBeHighlighted &&
      (animatedTextCommentID === commentThreadID ||
        animatedEntityKey === entityKey),
    [
      animatedEntityKey,
      animatedTextCommentID,
      commentThreadID,
      entityKey,
      shouldTextBeHighlighted,
    ]
  );
  const thisEntityEl = getTargetInlineDraftEntityEl({
    commentThreadID,
    entityKey,
  });

  const hidePrompterAndSilence = (_event: SyntheticEvent): void => {
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    console.warn("hiding man");
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    console.warn("what now: ", inlineCommentStore.get("promptedEntityKey"));
  };

  const openCommentThreadDisplay = (event): void => {
    if (isCommentSavedInBackend) {
      event.stopPropagation();
      cleanupStoreAndCloseDisplay({ inlineCommentStore });
      inlineCommentStore.set("displayableInlineComments")(
        getSavedInlineCommentsGivenBlockKeyAndThreadID({
          blockKey,
          commentThreadID,
          editorState: paperDraftStore.get("editorState"),
        })
      );
      inlineCommentStore.set("animatedTextCommentID")(commentThreadID);
    }
  };

  useClickOutsideEffect({
    entityEl: thisEntityEl,
    isBeingPrompted,
    isReadyToAddListener,
    onClickOutside: hidePrompterAndSilence,
    setIsReadyToAddListener,
  });

  return (
    <span
      className={css(
        shouldTextBeHighlighted
          ? styles.commentTextHighLight
          : styles.textNonHighLight,
        isCurrentCommentTextActive ? styles.commentActiveHighlight : null
      )}
      id={
        commentThreadID != null
          ? formatTextWrapID(commentThreadID)
          : formatTextWrapID(entityKey)
      }
      key={`InlineCommentTextWrap-${entityKey}-${commentThreadID}`}
      onClick={openCommentThreadDisplay}
      role="none"
    >
      {children}
    </span>
  );
}

const styles = StyleSheet.create({
  commentActiveHighlight: {
    backgroundColor: "rgb(140 230 180)",
    cursor: "pointer",
  },
  commentTextHighLight: {
    backgroundColor: "rgb(204 243 221)",
    cursor: "pointer",
  },
  popoverBodyStyle: {
    background: "rgb(0,0,0)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: 14,
    padding: "8px 16px",
    borderRadius: 5,
  },
  textNonHighLight: {
    backgroundColor: "transparent",
  },
});
