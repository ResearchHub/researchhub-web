import React from "react";

const PaperDraftInlineCommentTextWrap = (props) => {
  console.warn("PaperDraftInlineCommentTextWrap RENDERING");
  // const { contentState, entityKey, onSectionEnter, children } = props;
  // const sectionInstance = contentState.getEntity(entityKey);
  // const { name, index } = sectionInstance.getData();
  return <div {...props}>{children}</div>;
};

export default PaperDraftInlineCommentTextWrap;
