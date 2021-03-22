import React from "react";

function PaperDraftInlineCommentTextWrap(props) {
  const { block = {} } = props ?? {};
  const { text: blockText } = block;
  return <React.Fragment>{blockText}</React.Fragment>;
}

export default PaperDraftInlineCommentTextWrap;
