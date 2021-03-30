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
  const [showPopover, setShowPopover] = useState(false);
  const unduxStore = InlineCommentUnduxStore.useStore();

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

  useEffect(() => {
    if (!doesCommentExistInStore) {
      setShowPopover(true);
    }
  }, [doesCommentExistInStore]);

  const hidePopoverAndInsertToStore = () => {
    {
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
    }
  };

  return (
    <Popover
      onOuterAction={() => setShowPopover(false)}
      above
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
