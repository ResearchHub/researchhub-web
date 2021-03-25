import React, { ReactElement, useMemo } from "react";
import { InlineComment } from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

type Props = { inlineComment: InlineComment };

function InlineCommentThreadCard({
  inlineComment,
}: Props): ReactElement<"div"> {
  console.warn("InlineCommentThreadCard: ", inlineComment);
  return <div>{"Hi this is InlineComment Thread"}</div>;
}

export default InlineCommentThreadCard;
