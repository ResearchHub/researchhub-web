import { css, StyleSheet } from "aphrodite";
import React, { useEffect, useMemo, useState } from "react";
import Popover from "react-popover";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  findTargetInlineComment,
  getSavedInlineCommentsGivenBlockKey,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";
import PaperDraftStore from "../PaperDraft/undux/PaperDraftUnduxStore";

const ANIMATION_DURATION = 2; /* in seconds */

function PaperDraftInlineCommentTextWrap(
  props /* prop comes in from draft-js */
) {
  const { blockKey, contentState, decoratedText, entityKey } = props ?? {};
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftStore.useStore();
  const isSilenced = inlineCommentStore
    .get("silencedPromptKeys")
    .has(entityKey);
  const animatedEntityKey = inlineCommentStore.get("animatedTextCommentID");
  const animatedTextCommentID = inlineCommentStore.get("animatedTextCommentID");
  const isBeingPrompted =
    inlineCommentStore.get("promptedEntityKey") === entityKey;
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

  const [showPopover, setShowPopover] = useState(
    !isSilenced && isBeingPrompted
  );
  useEffect(() => {
    // ensures popover renders properly despite race condition
    if (!showPopover && isBeingPrompted) {
      setShowPopover(true);
    }
  }, [showPopover, isBeingPrompted]);

  const hidePopoverAndInsertToStore = (event) => {
    event.stopPropagation();
    cleanupStoreAndCloseDisplay({
      inlineCommentStore,
    });
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("promptedEntityKey")(null);
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    const newInlineComment = {
      blockKey,
      commentThreadID,
      entityKey,
      highlightedText: decoratedText,
      store: inlineCommentStore,
    };
    updateInlineComment({
      store: inlineCommentStore,
      updatedInlineComment: newInlineComment,
    });
    const displayableComments = [
      newInlineComment,
      ...getSavedInlineCommentsGivenBlockKey({
        blockKey,
        editorState: paperDraftStore.get("editorState"),
      }),
    ];
    inlineCommentStore.set("displayableInlineComments")(displayableComments);
    setShowPopover(false);
  };

  const hidePopoverAndSilence = (event) => {
    event.stopPropagation();
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    inlineCommentStore.set("promptedEntityKey")(null);
    setShowPopover(false);
  };

  const openCommentThreadDisplay = (event) => {
    event.stopPropagation();
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    inlineCommentStore.set("displayableInlineComments")(
      getSavedInlineCommentsGivenBlockKey({
        blockKey,
        editorState: paperDraftStore.get("editorState"),
      })
    );
    inlineCommentStore.set("animatedTextCommentID")(commentThreadID);
  };

  return (
    <Popover
      above
      key={`Popver-${entityKey}`}
      onOuterAction={isBeingPrompted ? hidePopoverAndSilence : () => {}}
      body={
        <span
          key={`Popver-Body-${entityKey}`}
          className={css(styles.popoverBodyStyle)}
          role="none"
          onClick={hidePopoverAndInsertToStore}
        >
          {"Add Comment"}
        </span>
      }
      children={
        <span
          className={css(
            shouldTextBeHighlighted
              ? styles.commentTextHighLight
              : styles.textNonHighLight,
            isCurrentCommentTextActive ? styles.commentActiveHighlight : null
          )}
          id={
            commentThreadID != null
              ? `inline-comment-${commentThreadID}`
              : entityKey
          }
          key={`Popver-Child-${entityKey}`}
          onClick={openCommentThreadDisplay}
          role="none"
        >
          {props.children}
        </span>
      }
      isOpen={showPopover}
    />
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

export default PaperDraftInlineCommentTextWrap;
