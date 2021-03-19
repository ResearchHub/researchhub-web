import { draftCssToCustomCss } from "../../PaperDraft/util/PaperDraftTextEditorUtil";
import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

const removeUnstyled = (styleSet) => {
  styleSet.delete("unstyled");
  styleSet.delete(draftCssToCustomCss.unstyled);
};

export const INLINE_COMMENT_MAP = {
  TYPE_KEY: "RichEditor-research-hub-inline-comment", // interpreted in paper.css
};

export const formatBlockStyleToggle = ({
  selectionBlockTypes = new Set(),
  toggledStyle,
}) => {
  /* WE NEED TO MAKE SURE THAT ANY ADDITIONS TO THE SET IN THIS FUNCTION NEEDS TO BE THE CUSTOM CSS */
  const newSelectionBlockTypes = new Set(selectionBlockTypes);
  const styleSetSize = newSelectionBlockTypes.size;
  if (styleSetSize === 0) {
    return toggledStyle;
  }

  removeUnstyled(newSelectionBlockTypes);
  if (toggledStyle !== INLINE_COMMENT_MAP.TYPE_KEY) {
    newSelectionBlockTypes.has(toggledStyle)
      ? newSelectionBlockTypes.delete(toggledStyle)
      : newSelectionBlockTypes.add(
          draftCssToCustomCss[toggledStyle] ?? toggledStyle
        );
  }

  if (toggledStyle === INLINE_COMMENT_MAP.TYPE_KEY) {
    // TODO: calvinhlee add delete inline comment logic here
    newSelectionBlockTypes.add(
      draftCssToCustomCss[toggledStyle] ?? toggledStyle
    );
    newSelectionBlockTypes.size === 1 &&
      newSelectionBlockTypes.add(draftCssToCustomCss.unstyled);
  }

  return newSelectionBlockTypes.size > 0
    ? newSelectionBlockTypes
    : newSelectionBlockTypes.add("unstyled");
};

export const getInlineCommentBlockRenderer = ({
  inlineComments,
  setInlineComments,
}) => (contentBlock) => {
  const type = contentBlock.getType();
  return contentBlock.split(" ").has(INLINE_COMMENT_KEYS.TYPE_KEY)
    ? {
        component: PaperDraftInlineCommentTextWrap,
        editable: false,
        props: { inlineComments, setInlineComments, styles: contentBlock },
      }
    : undefined; /* intentional undefined for DraftJS to handle */
};
