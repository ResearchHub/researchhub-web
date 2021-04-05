import { css, StyleSheet } from "aphrodite";
import React, { useEffect, useMemo, useState } from "react";
import Popover from "react-popover";
import InlineCommentUnduxStore, {
  findTargetInlineComment,
  getInlineCommentsGivenBlockKey,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";
import PaperDraftStore from "../PaperDraft/undux/PaperDraftUnduxStore";

function PaperDraftInlineCommentTextWrap(
  props /* prop comes in from draft-js */
) {
  const {
    blockKey,
    contentState,
    decoratedText: currentSelectText,
    entityKey,
  } = props ?? {};
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftStore.useStore();
  const isSilenced = inlineCommentStore
    .get("silencedPromptKeys")
    .has(entityKey);
  const isBeingPrompted =
    inlineCommentStore.get("promptedEntityKey") === entityKey;

  const [showPopover, setShowPopover] = useState(
    !isSilenced && isBeingPrompted
  );

  useEffect(() => {
    // ensures popover renders properly despite race condition
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
        store: inlineCommentStore,
      }),
    [
      blockKey,
      commentThreadID,
      entityKey,
      inlineCommentStore.get("inlineComments"),
    ]
  );
  const doesCommentExistInStore = targetInlineComment != null;
  const isCommentSavedInBackend = commentThreadID != null;
  const shouldTextBeHighlighted =
    doesCommentExistInStore || isCommentSavedInBackend;
  const hidePopoverAndInsertToStore = (event) => {
    event.stopPropagation();
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("promptedEntityKey")(null);
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    const newInlineComment = {
      blockKey,
      commentThreadID,
      entityKey,
      highlightedText: currentSelectText,
      store: inlineCommentStore,
    };
    updateInlineComment({
      store: inlineCommentStore,
      updatedInlineComment: newInlineComment,
    });
    inlineCommentStore.set("displayableInlineComments")(
      getInlineCommentsGivenBlockKey({
        blockKey,
        editorState: paperDraftStore.get("editorState"),
      })
    );
    setShowPopover(false);
  };

  const hidePopoverAndSilence = (event) => {
    event.stopPropagation();
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    inlineCommentStore.set("promptedEntityKey")(null);
    setShowPopover(false);
  };

  const openCommentThreadDisplay = (event) => {
    event.stopPropagation();
    const targetInlineComment = inlineCommentStore
      .get("inlineComments")
      .find(
        ({ commentThreadID: unduxThreadID }) =>
          unduxThreadID === commentThreadID
      );
    if (targetInlineComment != null) {
      inlineCommentStore.set("displayableInlineComments")(
        getInlineCommentsGivenBlockKey({
          blockKey,
          editorState: paperDraftStore.get("editorState"),
        })
      );
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
            shouldTextBeHighlighted
              ? styles.commentTextHighLight
              : styles.textNonHighLight
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
  textNonHighLight: {
    backgroundColor: "transparent",
  },
});

export default PaperDraftInlineCommentTextWrap;
