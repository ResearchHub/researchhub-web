import InlineCommentThreadsDisplayContainer from "./InlineCommentThreadsDisplayContainer";
import InlineCommentUnduxStore, {
  ID,
  InlineCommentStore,
} from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import React, { ReactElement, useEffect } from "react";

type fetchInlineCommentThreadsArgs = {
  paperID: ID;
  inlineCommentStore: InlineCommentStore;
};

function fetchInlineCommentThreads({
  paperID,
  inlineCommentStore,
}: fetchInlineCommentThreadsArgs): void {
  /* Unlike Waypoint (which relies on paper parsing), 
     the source of truth for InlineComments is the backend. 
     Hence, comment displaying logic & updating unduxStore should happen with a fetch 
     TODO: calvinhlee - make api call here. */
}

function InlineCommentThreadsDisplayBar(): ReactElement<typeof React.Fragment> {
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
      // NOTE: Thread-"s" are grouped by blockKey
      <InlineCommentThreadsDisplayContainer
        blockKey={blockKey}
        key={blockKey}
      />
    )
  );

  return (
    <React.Fragment>{InlineCommentThreadsDisplayContainers}</React.Fragment>
  );
}

export default InlineCommentThreadsDisplayBar;
