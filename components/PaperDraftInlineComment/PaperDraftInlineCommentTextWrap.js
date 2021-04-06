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
  const { blockKey, commentThreadID, entityKey } = props ?? {};
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

  const targetInlineComment = useMemo(
    () =>
      findTargetInlineComment({
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      }),
    [blockKey, commentThreadID, entityKey, unduxStore]
  );

  const doesCommentExistInStore = targetInlineComment != null;

  const hidePopoverAndInsertToStore = (event) => {
    event.stopPropagation();
    unduxStore.set("silencedPromptKeys")(
      new Set([...unduxStore.get("silencedPromptKeys"), entityKey])
    );
    unduxStore.set("lastPromptRemovedTime")(Date.now());
    unduxStore.set("currentPromptKey")(null);
    updateInlineComment({
      store: unduxStore,
      updatedInlineComment: {
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      },
    });
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
            doesCommentExistInStore ? styles.commentTextHighLight : null
          )}
          id={entityKey}
          key={`Popver-Child-${entityKey}`}
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
