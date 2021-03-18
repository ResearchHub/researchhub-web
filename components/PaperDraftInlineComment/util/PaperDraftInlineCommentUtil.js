import PaperDraftInlineCommentTextWrap from "../PaperDraftInlineCommentTextWrap";

export const INLINE_COMMENT_KEYS = {
  RESEARCH_HUB_PAPER_INLINE_COMMENT: "RESEARCH_HUB_PAPER_INLINE_COMMENT",
};

export const getInlineCommentBlockRenderer = (inlineCommentID) => (
  contentBlock
) => {
  const type = contentBlock.getType();
  switch (type) {
    case INLINE_COMMENT_KEYS.RESEARCH_HUB_PAPER_INLINE_COMMENT:
      return {
        component: PaperDraftInlineCommentTextWrap,
        editable: false,
        props: { inlineCommentID },
      };
  }
};
