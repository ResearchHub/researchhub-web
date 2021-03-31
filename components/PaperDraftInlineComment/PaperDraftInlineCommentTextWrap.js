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
  console.warn("isBeingPrompted: ", isBeingPrompted);
  // console.warn("===============================");
  // console.warn("my entityKey: ", entityKey);
  // console.warn("prompt: ", unduxStore.get("currentPromptKey"));
  // console.warn("isBeingPrompted: ", isBeingPrompted);
  // console.warn("doesCommentExistInStore: ", doesCommentExistInStore);
  // console.warn("isSilenced: ", isSilenced);
  // console.warn("RESULT: ", isBeingPrompted && !doesCommentExistInStore);
  // console.warn("===============================");

  useEffect(() => {
    return function cleanup() {
      unduxStore.set("currentPromptKey")(null);
    };
  }, []);

  const hidePopoverAndInsertToStore = (event) => {
    updateInlineComment({
      store: unduxStore,
      updatedInlineComment: {
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      },
    });
    unduxStore.set("silencedPromptKeys")(
      new Set([...unduxStore.get("silencedPromptKeys"), entityKey])
    );
    unduxStore.set("lastPromptRemovedTime")(Date.now());
    unduxStore.set("currentPromptKey")(null);
    setShowPopover(false);
  };

  const hidePopoverAndSilence = (event) => {
    /* calvin: below is indeed funcky. 
    we need to figure out a better way to handle this because with deletion, 
    there's a nasty race-condition with the way decorators are being rendered */
    console.warn("****** hidePopoverAndSilence ******* ");
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
    background: "rgb(41, 41, 41)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px",
    borderRadius: 5,
  },
});

export default PaperDraftInlineCommentTextWrap;
