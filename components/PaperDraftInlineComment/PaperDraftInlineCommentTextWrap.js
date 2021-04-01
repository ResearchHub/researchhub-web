import { css, StyleSheet } from "aphrodite";
import React, { useEffect, useMemo, useState } from "react";
import Popover from "react-popover";
import InlineCommentUnduxStore, {
  findTargetInlineComment,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";

function PaperDraftInlineCommentTextWrap(
  props /* prop comes in from draft-js */
) {
  const { blockKey, contentState, entityKey } = props ?? {};
  const unduxStore = InlineCommentUnduxStore.useStore();
  const isSilenced = unduxStore.get("silencedPromptKeys").has(entityKey);
  const isBeingPrompted = unduxStore.get("currentPromptKey") === entityKey;

  const [showPopover, setShowPopover] = useState(
    !isSilenced && isBeingPrompted
  );

  useEffect(() => {
    // ensures popover renders properly due to race condition
    if (!showPopover && isBeingPrompted) {
      setShowPopover(true);
    }
  }, [showPopover, isBeingPrompted]);

  const data = contentState.getEntity(props.entityKey).getData();
  const { commentThreadID } = data;

  const targetInlineComment = useMemo(
    () =>
      findTargetInlineComment({
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      }),
    [blockKey, commentThreadID, entityKey, unduxStore.get("inlineComments")]
  );
  console.warn("targetInlineComment @ Wrap: ", targetInlineComment);
  const doesCommentExistInStore = targetInlineComment != null;
  const isCommentSavedInBackend = commentThreadID != null;
  const shouldTextBeHighlighted =
    doesCommentExistInStore || isCommentSavedInBackend;

  const hidePopoverAndInsertToStore = (event) => {
    event.stopPropagation();
    unduxStore.set("silencedPromptKeys")(
      new Set([...unduxStore.get("silencedPromptKeys"), entityKey])
    );
    unduxStore.set("lastPromptRemovedTime")(Date.now());
    unduxStore.set("currentPromptKey")(null);
    const newInlineComment = {
      blockKey,
      commentThreadID,
      entityKey,
      store: unduxStore,
    };
    updateInlineComment({
      store: unduxStore,
      updatedInlineComment: newInlineComment,
    });
    unduxStore.set("displayableInlineComments")([newInlineComment]);
    setShowPopover(false);
  };

  const hidePopoverAndSilence = (event) => {
    /* calvin: below is indeed funcky. 
    we need to figure out a better way to handle this because with deletion, 
    there's a nasty race-condition with the way decorators are being rendered */
    event.stopPropagation();
    unduxStore.set("silencedPromptKeys")(
      new Set([...unduxStore.get("silencedPromptKeys"), entityKey])
    );
    unduxStore.set("lastPromptRemovedTime")(Date.now());
    unduxStore.set("currentPromptKey")(null);
    setShowPopover(false);
  };

  const openCommentThreadDisplay = (event) => {
    event.stopPropagation();
    const targetInlineComment = unduxStore
      .get("inlineComments")
      .find(
        ({ commentThreadID: unduxThreadID }) =>
          unduxThreadID === commentThreadID
      );
    console.warn("targetInlineComment: ", targetInlineComment);
    if (targetInlineComment != null) {
      unduxStore.set("displayableInlineComments")([targetInlineComment]);
    }
  };

  return (
    <Popover
      above
      key={`Popver-${entityKey}`}
      onOuterAction={isBeingPrompted ? hidePopoverAndSilence : () => {}}
      body={
        <span
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
            shouldTextBeHighlighted ? styles.commentTextHighLight : null
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
});

export default PaperDraftInlineCommentTextWrap;
