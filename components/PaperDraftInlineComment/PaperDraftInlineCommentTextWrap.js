import React from "react";

function PaperDraftInlineCommentTextWrap(props) {
  const { block = {}, blockProps = {} } = props ?? {};
  const { text: blockText } = block;
  const { cssClassNames = "" } = blockProps;
  cssClassNames.push(cssClassNames.shift());
  console.warn("TYEPPSSSS: ", cssClassNames);
  return (
    <p className={cssClassNames.join(" ") /* see paper.css*/}>{blockText}</p>
  );
}

export default PaperDraftInlineCommentTextWrap;
