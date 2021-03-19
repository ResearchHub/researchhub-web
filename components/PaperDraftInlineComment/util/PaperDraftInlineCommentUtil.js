import { draftCssToCustomCss } from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

const removeUnstyled = (styleSet) => {
  styleSet.delete("unstyled");
  styleSet.delete(draftCssToCustomCss.unstyled);
};

export const INLINE_COMMENT_MAP = {
  DRAFT_JS: "research-hub-inline-comment",
  PAPER_DRAFT: "RichEditor-inline-comment", // interpreted in paper.css
};

export const formatBlockStyleToggle = ({
  selectionBlockTypes = new Set(),
  toggledStyle,
}) => {
  const newSelectionBlockTypes = new Set(selectionBlockTypes);
  const styleSetSize = newSelectionBlockTypes.size;
  console.warn("before: ", newSelectionBlockTypes);
  if (styleSetSize === 0) {
    return toggledStyle;
  }

  removeUnstyled(newSelectionBlockTypes);
  console.warn("remove unstyle: ", newSelectionBlockTypes);

  if (toggledStyle !== INLINE_COMMENT_MAP.DRAFT_JS) {
    newSelectionBlockTypes.has(toggledStyle)
      ? newSelectionBlockTypes.delete(toggledStyle)
      : newSelectionBlockTypes.add(toggledStyle);
  }

  if (toggledStyle === INLINE_COMMENT_MAP.DRAFT_JS) {
    // TODO: calvinhlee add delete inline comment logic here
    newSelectionBlockTypes.add(toggledStyle);
    newSelectionBlockTypes.size === 1 &&
      newSelectionBlockTypes.add(draftCssToCustomCss.unstyled);
  }

  console.warn("return: ", newSelectionBlockTypes);
  return newSelectionBlockTypes.size > 0
    ? newSelectionBlockTypes
    : newSelectionBlockTypes.add("unstyled");
};

export const getInlineCommentBlockRenderer = ({
  inlineComments,
  setInlineComments,
}) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case INLINE_COMMENT_KEYS.DRAFT_JS:
      return {
        component: PaperDraftInlineCommentTextWrap,
        editable: false,
        props: { inlineComments, setInlineComments },
      };
    default:
      return undefined; /* intentional undefined for DraftJS to handle */
  }
};
