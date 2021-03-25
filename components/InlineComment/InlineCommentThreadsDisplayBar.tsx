import InlineCommentThreadsDisplayContainer from "./InlineCommentThreadsDisplayContainer";
import InlineCommentUnduxStore, {
  InlineCommentStore,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import React, { ReactElement, useEffect, useMemo } from "react";

type ID = number | string | null;
type fetchInlineCommentThreadsArgs = {
  paperID: ID;
  inlineCommentStore: InlineCommentStore;
};

function fetchInlineCommentThreads({
  paperID,
  inlineCommentStore,
}: fetchInlineCommentThreadsArgs): void {
  // TODO: calvinhlee - make api call here.
}

function InlineCommentThreadsDisplayBar(): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");

  useEffect((): void => {
    fetchInlineCommentThreads({ paperID, inlineCommentStore });
  }, [paperID, inlineCommentStore]);

  const inlineComments = inlineCommentStore.get("inlineComments");
  const InlineCommentThreadsDisplayContainers = Object.keys(inlineComments).map(
    (
      blockKey: string
    ): ReactElement<typeof InlineCommentThreadsDisplayContainer> => (
      <InlineCommentThreadsDisplayContainer
        blockKey={blockKey}
        key={blockKey}
      />
    )
  );

  return <div>{InlineCommentThreadsDisplayContainers}</div>;
}

export default InlineCommentThreadsDisplayBar;
