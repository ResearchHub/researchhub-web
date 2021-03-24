import InlineCommentUnduxStore from "./undux/InlineCommentUnduxStore";
import React, { useEffect } from "react";

type Props = {};

function PaperDraftInlineCommentDisplayContainer(
  props: Props
): React.ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  return <div>"YOYOYOYO"</div>;
}

export default PaperDraftInlineCommentDisplayContainer;
