import { css, StyleSheet } from "aphrodite";
import React, { useMemo } from "react";
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

  const targetInlineComment = useMemo(
    () =>
      findTargetInlineComment({
        blockKey,
        commentThreadID,
        entityKey,
        store: unduxStore,
      }) ?? {},
    [blockKey, commentThreadID, entityKey, unduxStore]
  );

  const turnOffPopover = () => {
    updateInlineComment({
      store: unduxStore,
      updatedInlineComment: { ...targetInlineComment, isNewSelection: false },
    });
  };

  return (
    <Popover
      above
      body={
        <span
          className={css(styles.popoverBodyStyle)}
          role="none"
          onClick={turnOffPopover}
        >
          {"Add Comment"}
        </span>
      }
      children={
        <span className={css(styles.commentTextHighLight)}>
          {props.children}
        </span>
      }
      isOpen={targetInlineComment.isNewSelection ?? false}
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
