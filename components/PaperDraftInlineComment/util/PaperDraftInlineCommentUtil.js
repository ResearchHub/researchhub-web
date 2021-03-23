import { EditorState, Modifier } from "draft-js";
import { draftCssToCustomCss } from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

function getSelectedBlockFromEditorState(editorState) {
  // TODO: calvinhlee may need to improve below to capture selection range within the block
  const selectionState = editorState.getSelection();
  return editorState
    .getCurrentContent()
    .getBlockForKey(selectionState.getStartKey());
}

function getBlockTypesFromBlock(block) {
  return new Set(block.getType().split(" "));
}

function getModifiedContentState(editorState, newSelectionBlockTypes) {
  return Modifier.setBlockType(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    Array.from(newSelectionBlockTypes).join(" ")
  );
}

export const INLINE_COMMENT_MAP = {
  TYPE_KEY: "RichEditor-research-hub-inline-comment", // interpreted in paper.css
};

export function handleBlockStyleToggle({
  editorState,
  inlineCommentStore /* unduxStore see InlineCommentUnduxStore */,
  toggledStyle,
}) {
  const selectionBlock = getSelectedBlockFromEditorState(editorState);
  const selectionBlockTypes = getBlockTypesFromBlock(selectionBlock);

  /* NOTE: Any additional styling should be in CUSTOM CSS - see draftCssToCustomCss */
  let newSelectionBlockTypes = null;
  if (toggledStyle === INLINE_COMMENT_MAP.TYPE_KEY) {
    /* TODO: calvinhlee - add inline-comment removal plan */
    newSelectionBlockTypes = new Set([...selectionBlockTypes]);
    if (!selectionBlockTypes.has(INLINE_COMMENT_MAP.TYPE_KEY)) {
      newSelectionBlockTypes.add(INLINE_COMMENT_MAP.TYPE_KEY);
      inlineCommentStore;
    } else {
      newSelectionBlockTypes.delete(INLINE_COMMENT_MAP.TYPE_KEY);
    }
    newSelectionBlockTypes.size <= 1
      ? newSelectionBlockTypes.add(draftCssToCustomCss.unstyled)
      : newSelectionBlockTypes;
  } else {
    newSelectionBlockTypes = selectionBlockTypes.has(
      INLINE_COMMENT_MAP.TYPE_KEY
    )
      ? new Set([INLINE_COMMENT_MAP.TYPE_KEY])
      : new Set();
    const recognizedBlockType =
      draftCssToCustomCss[toggledStyle] ?? toggledStyle;
    if (!selectionBlockTypes.has(recognizedBlockType)) {
      newSelectionBlockTypes.add(recognizedBlockType);
    }
    newSelectionBlockTypes.size > 0
      ? newSelectionBlockTypes
      : newSelectionBlockTypes.add("unstyled");
  }

  const modifiedContentState = getModifiedContentState(
    editorState,
    newSelectionBlockTypes
  );

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
