import React from "react";

function PaperDraftInlineCommentTextWrap(props) {
  const { block = {} } = props ?? {};
  const { text: blockText } = block;
  console.warn("YOYOYO: ", block.getType());
  return <React.Fragment>{blockText}</React.Fragment>;
}

export default PaperDraftInlineCommentTextWrap;
