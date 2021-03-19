import React from "react";

function PaperDraftInlineCommentTextWrap(props) {
  const { block = {}, blockProps = {} } = props ?? {};
  const { text: blockText } = block;
  const { cssClassNames = "" } = blockProps;
  console.warn("props: ", props);
  return <p className={"RichEditor-h2" /* see paper.css*/}>{blockText}</p>;
}

export default PaperDraftInlineCommentTextWrap;
