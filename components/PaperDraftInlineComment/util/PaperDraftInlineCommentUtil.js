import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

export const INLINE_COMMENT_MAP = {
  CLASS_NAME: "RESEARCH_HUB_PAPER_INLINE_COMMENT",
  CSS: "RichEditor-inline-comment", // interpreted in paper.css
};

export const formatBlockStyleToggle = ({
  selectionBlockTypes,
  toggledStyle,
}) => {
  const newSelectionBlock = [...selectionBlockTypes];
  // if (toggledStyle !== INLINE_COMMENT_MAP.CLASS_NAME) {
  //   return selectionBlockTypes.push;
  // } else {
  const targetStyleInd = newSelectionBlock.indexOf(toggledStyle);
  if (targetStyleInd >= 0) {
    newSelectionBlock.splice(targetStyleInd, 1);
  } else {
    newSelectionBlock.push(toggledStyle);
  }
  return newSelectionBlock.length > 0
    ? newSelectionBlock.join(" ")
    : "unstyled";
  // }
};

export const getInlineCommentBlockRenderer = ({
  inlineComments,
  setInlineComments,
}) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case INLINE_COMMENT_KEYS.CLASS_NAME:
      return {
        component: PaperDraftInlineCommentTextWrap,
        editable: false,
        props: { inlineComments, setInlineComments },
      };
    default:
      return undefined; /* intentional undefined for DraftJS to handle */
  }
};
