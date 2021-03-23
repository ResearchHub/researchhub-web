import { draftCssToCustomCss } from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import { EditorState, Modifier } from "draft-js";
import {
  updateInlineComment,
  deleteInlineComment,
} from "../undux/InlineCommentUnduxStore.ts";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

function getSelectedBlockFromEditorState(editorState) {
  // TODO: calvinhlee need to improve below to capture selection range within the block
  const selectionState = editorState.getSelection();
  return editorState
    .getCurrentContent()
    .getBlockForKey(selectionState.getStartKey());
}

function getBlockTypesInSet(block) {
  return new Set(block.getType().split(" "));
}

function getModifiedContentState({ blockData, editorState, newBlockTypes }) {
  const currentContentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  let modifiedContentState = Modifier.setBlockData(
    currentContentState,
    selectionState,
    blockData
  );
  return Modifier.setBlockType(
    modifiedContentState,
    selectionState,
    Array.from(newBlockTypes).join(" ")
  );
}

function handleInlineCommentBlockToggle(editorState, inlineCommentStore) {
  /* TODO: calvinhlee - add inline-comment removal plan */
  const selectionBlock = getSelectedBlockFromEditorState(editorState);
  const currBlockTypes = getBlockTypesInSet(selectionBlock);
  const currBlockData = selectionBlock.getData();

  const newBlockTypes = new Set([...currBlockTypes]); // need to preserve curr styling
  if (!currBlockTypes.has(INLINE_COMMENT_MAP.TYPE_KEY)) {
    newBlockTypes.add(INLINE_COMMENT_MAP.TYPE_KEY);
    updateInlineComment({
      updatedInlineComment: {
        blockKey: editorState.getSelection().getStartKey(),
        threadID: null,
      },
      store: inlineCommentStore,
    });
  } else {
    newBlockTypes.delete(INLINE_COMMENT_MAP.TYPE_KEY);
    deleteInlineComment({
      blockKey: editorState.getSelection().getStartKey(),
      store: inlineCommentStore,
    });
    /* NOTE: Any new styling should be in custom type for consistency */
    newBlockTypes.size === 0
      ? newBlockTypes.add(draftCssToCustomCss.unstyled)
      : newBlockTypes;
  }

  return getModifiedContentState({
    blockData: currBlockData,
    editorState,
    newBlockTypes,
  });
}

function handleNonInlineCommentBlockToggle(editorState, toggledStyle) {
  const selectionBlock = getSelectedBlockFromEditorState(editorState);
  const currBlockTypes = getBlockTypesInSet(selectionBlock);
  const currBlockData = selectionBlock.getData();

  /* NOTE: Any new styling should be in custom type for consistency */
  const newBlockTypes = currBlockTypes.has(INLINE_COMMENT_MAP.TYPE_KEY)
    ? new Set([INLINE_COMMENT_MAP.TYPE_KEY])
    : new Set();
  const toggledBlockType = draftCssToCustomCss[toggledStyle] ?? toggledStyle;
  if (!currBlockTypes.has(toggledBlockType)) {
    newBlockTypes.add(toggledBlockType);
  }

  // if every style was removed, we manually add custom unstyled css
  newBlockTypes.size === 0
    ? newBlockTypes.add(draftCssToCustomCss.unstyled)
    : newBlockTypes;
  return getModifiedContentState({
    blockData: currBlockData,
    editorState,
    newBlockTypes,
  });
}

/* -------- EXPORTS -------- */
export const INLINE_COMMENT_MAP = {
  TYPE_KEY: "RichEditor-research-hub-inline-comment", // interpreted in paper.css
};

export function handleBlockStyleToggle({
  editorState,
  inlineCommentStore /* unduxStore see InlineCommentUnduxStore */,
  toggledStyle,
}) {
  const modifiedContentState =
    toggledStyle === INLINE_COMMENT_MAP.TYPE_KEY
      ? handleInlineCommentBlockToggle(editorState, inlineCommentStore)
      : handleNonInlineCommentBlockToggle(editorState, toggledStyle);
  return EditorState.push(editorState, modifiedContentState);
}

export const getInlineCommentBlockRenderer = ({
  inlineComments,
  updateInlineComment,
}) => (contentBlock) => {
  const blockTypes = contentBlock.getType().split(" ");
  return blockTypes.includes(INLINE_COMMENT_MAP.TYPE_KEY)
    ? {
        component: PaperDraftInlineCommentTextWrap,
        editable: true,
        props: {
          cssClassNames: blockTypes,
          inlineComments,
          updateInlineComment,
        },
      }
    : undefined; /* intentional undefined for DraftJS to handle */
};

export function getCurrSelectionBlockTypesInSet(editorState) {
  const block = getSelectedBlockFromEditorState(editorState);
  return getBlockTypesInSet(block);
}
