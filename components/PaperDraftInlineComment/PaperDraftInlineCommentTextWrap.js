import React from "react";

function PaperDraftInlineCommentTextWrap(props) {
  return (
    <React.Fragment className={props.styles ?? "" /* see paper.css*/}>
      {props.block.text}
    </React.Fragment>
  );
}

export default PaperDraftInlineCommentTextWrap;
