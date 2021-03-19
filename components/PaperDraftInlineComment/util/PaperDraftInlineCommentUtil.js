import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

export const INLINE_COMMENT_MAP = {
  CLASS_NAME: "RESEARCH_HUB_PAPER_INLINE_COMMENT",
  CSS: "RichEditor-inline-comment", // interpreted in paper.css
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
