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
  isReadyToRemoveListener: boolean;
  onClickOutside: (event: SyntheticEvent) => void;
  setIsReadyToRemoveListener: (flag: boolean) => void;
};

/* Caution: don't modify unless you know what you're doing */
function useClickOutsideEffect({
  entityEl,
  isBeingPrompted,
  isReadyToRemoveListener,
  onClickOutside,
  setIsReadyToRemoveListener,
}: useClickOutsideEffectArgs) {
  function handleClickOutside(event) {
    console.warn("Clicked Outside: ", entityEl);
    debugger;
    if (entityEl != null && !entityEl.contains(event.target)) {
      onClickOutside(event);
      setIsReadyToRemoveListener(false);
    }
  }
  useEffect(() => {
    if (entityEl != null) {
      if (isBeingPrompted && !isReadyToRemoveListener) {
        console.warn("prompted: ", entityEl);
        entityEl.addEventListener("mousedown", handleClickOutside);
        setIsReadyToRemoveListener(true);
      } else if (isBeingPrompted && isReadyToRemoveListener) {
        console.warn("removing: ", entityEl);
        entityEl.removeEventListener("mousedown", handleClickOutside);
      }
    }
  }, [
    entityEl,
    isBeingPrompted,
    isReadyToRemoveListener,
    onClickOutside,
    setIsReadyToRemoveListener,
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

  const shouldTextBeHighlighted = useMemo(
    () => doesCommentExistInStore || isCommentSavedInBackend,
    [doesCommentExistInStore, isCommentSavedInBackend]
  );
  const isCurrentCommentTextActive = useMemo(
    () =>
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

  const hidePrompterAndSilence = (_event: SyntheticEvent) => {
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    inlineCommentStore.set("promptedEntityKey")(null);
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
  };

  const isBeingPrompted =
    inlineCommentStore.get("promptedEntityKey") === entityKey &&
    !silencedPromptKeys.has(entityKey);
  const [isReadyToRemoveListener, setIsReadyToRemoveListener] = useState<
    boolean
  >(false);
  const thisEntityEl = getTargetInlineDraftEntityEl({
    commentThreadID,
    entityKey,
  });
  useClickOutsideEffect({
    entityEl: thisEntityEl,
    isBeingPrompted,
    isReadyToRemoveListener,
    onClickOutside: hidePrompterAndSilence,
    setIsReadyToRemoveListener,
  });

  const openCommentThreadDisplay = (event) => {
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
  };

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
