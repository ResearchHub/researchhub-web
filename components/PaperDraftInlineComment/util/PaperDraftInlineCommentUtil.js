import { draftCssToCustomCss } from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

const removeUnstyled = (styleSet) => {
  styleSet.delete("unstyled");
  styleSet.delete(draftCssToCustomCss.unstyled);
};

export const INLINE_COMMENT_MAP = {
  TYPE_KEY: "RichEditor-research-hub-inline-comment", // interpreted in paper.css
};

export const handleBlockStyleToggle = ({
  selectionBlockTypes = new Set(),
  toggledStyle,
}) => {
  /* WE NEED TO MAKE SURE THAT ANY ADDITIONS TO THE SET IN THIS FUNCTION NEEDS TO BE THE CUSTOM CSS */
  let newSelectionBlockTypes = null;

  /* TODO: calvinhlee - add inline-comment removal plan */
  if (toggledStyle === INLINE_COMMENT_MAP.TYPE_KEY) {
    newSelectionBlockTypes = new Set([...selectionBlockTypes]);
    if (!selectionBlockTypes.has(INLINE_COMMENT_MAP.TYPE_KEY)) {
      newSelectionBlockTypes.add(INLINE_COMMENT_MAP.TYPE_KEY);
    } else {
      newSelectionBlockTypes.delete(INLINE_COMMENT_MAP.TYPE_KEY);
    }
    return newSelectionBlockTypes.size <= 1
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
    return newSelectionBlockTypes.size > 0
      ? newSelectionBlockTypes
      : newSelectionBlockTypes.add("unstyled");
  }
};

export const getInlineCommentBlockRenderer = ({
  inlineComments,
  setInlineComments,
}) => (contentBlock) => {
  const blockTypes = contentBlock.getType().split(" ");
  return blockTypes.includes(INLINE_COMMENT_MAP.TYPE_KEY)
    ? {
        component: PaperDraftInlineCommentTextWrap,
        editable: true,
        props: { inlineComments, setInlineComments, cssClassNames: blockTypes },
      }
    : undefined; /* intentional undefined for DraftJS to handle */
};
