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
  const newSelectionBlockTypes = new Set(selectionBlockTypes);
  const styleSetSize = newSelectionBlockTypes.size;
  if (styleSetSize === 0) {
    return toggledStyle;
  }

  removeUnstyled(newSelectionBlockTypes);
  if (toggledStyle !== INLINE_COMMENT_MAP.TYPE_KEY) {
    // the reason for doing this as below is because block types can directly from pdf parse or post edit
    newSelectionBlockTypes.has(toggledStyle)
      ? newSelectionBlockTypes.delete(toggledStyle)
      : newSelectionBlockTypes.has(draftCssToCustomCss[toggledStyle])
      ? newSelectionBlockTypes.delete(draftCssToCustomCss[toggledStyle])
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
  console.warn("newSelectionBlockTypes: ", newSelectionBlockTypes);
  return newSelectionBlockTypes.size > 0
    ? newSelectionBlockTypes
    : newSelectionBlockTypes.add("unstyled");
};

export const getInlineCommentBlockRenderer = ({
  inlineComments,
  setInlineComments,
}) => (contentBlock) => {
  const blockTypes = contentBlock.getType().split(" ");
  return blockTypes.includes(INLINE_COMMENT_MAP.TYPE_KEY)
    ? {
        component: PaperDraftInlineCommentTextWrap,
        editable: false,
        props: { inlineComments, setInlineComments, cssClassNames: blockTypes },
      }
    : undefined; /* intentional undefined for DraftJS to handle */
};
