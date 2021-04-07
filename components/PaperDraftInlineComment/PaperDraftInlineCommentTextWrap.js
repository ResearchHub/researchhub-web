import { css, StyleSheet } from "aphrodite";
import React, { useEffect, useState } from "react";
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
  const shouldTextBeHighlighted =
    doesCommentExistInStore || isCommentSavedInBackend;

  const [showPopover, setShowPopover] = useState(
    !isSilenced && isBeingPrompted
  );
  const [shouldAnimateText, setShouldAnimateText] = useState(
    isCommentSavedInBackend && commentThreadID === animatedTextCommentID
  );

  useEffect(() => {
    if (isCommentSavedInBackend && commentThreadID === animatedTextCommentID) {
      setShouldAnimateText(true);
      setTimeout(() => {
        inlineCommentStore.set("animatedTextCommentID")(null);
        setShouldAnimateText(false);
      }, ANIMATION_DURATION * 1000);
    }
  }, [animatedTextCommentID, commentThreadID, isCommentSavedInBackend]);

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
            shouldAnimateText ? styles.textBounce : null
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

const commentTextBounce = {
  "0%": {
    transform: "translateY(0)",
  },
  "50%": {
    transform: "translateY(-12px)",
  },
  "100%": {
    transform: "translateY(0)",
  },
};

const styles = StyleSheet.create({
  commentTextHighLight: {
    cursor: "pointer",
    backgroundColor: "rgb(204 243 221)",
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
  textBounce: {
    animationDuration: `${ANIMATION_DURATION}s`,
    animationName: [commentTextBounce],
    display: "inline-flex",
    height: "inherit",
  },
});

export default PaperDraftInlineCommentTextWrap;
