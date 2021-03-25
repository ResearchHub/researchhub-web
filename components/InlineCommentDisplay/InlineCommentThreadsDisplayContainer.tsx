import React, { ReactElement, useMemo } from "react";
import InlineCommentThreadCard from "./InlineCommentThreadCard";
import InlineCommentUnduxStore, {
  InlineComment,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

type Props = { blockKey: string };

function InlineCommentThreadsDisplayContainer({
  blockKey,
}: Props): ReactElement<"div"> {
  const unduxStore = InlineCommentUnduxStore.useStore();
  const targetGroupedInlineComments = unduxStore.get("inlineComments")[
    blockKey
  ];

  const commentThreadCards = useMemo(
    (): Array<ReactElement<typeof InlineCommentThreadCard>> =>
      targetGroupedInlineComments.map(
        (
          inlineComment: InlineComment,
          arrInd: number
        ): ReactElement<typeof InlineCommentThreadCard> => (
          <InlineCommentThreadCard
            inlineComment={inlineComment}
            key={`${blockKey}-${arrInd}`}
          />
        )
      ),
    [targetGroupedInlineComments]
  );

  return <div>{commentThreadCards}</div>;
}

export default InlineCommentThreadsDisplayContainer;
