import React, { ReactElement } from "react";
import { InlineComment } from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

type Props = { inlineComment: InlineComment };

function InlineCommentThreadCard({
  inlineComment,
}: Props): ReactElement<"div"> {
  return <div />;
}

export default InlineCommentThreadCard;
