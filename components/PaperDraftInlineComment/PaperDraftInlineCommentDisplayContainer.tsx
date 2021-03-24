import InlineCommentUnduxStore, {
  InlineComment,
  InlineCommentStore,
} from "./undux/InlineCommentUnduxStore";
import React, { useEffect } from "react";

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
  // inlineCommentStore.set('inlineComments')({});
}

function PaperDraftInlineCommentDisplayContainer(
  _props: any
): React.ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperID = inlineCommentStore.get("paperID");
  useEffect((): void => {
    console.warn("HI", paperID);
    fetchInlineCommentThreads({ paperID, inlineCommentStore });
  }, [paperID, inlineCommentStore]);
  // const inlineCommentData = inlineCommentStore.get("inlineComments");
  // const inlineComments = Object.keys(inlineCommentStore.get("inlineComments")).map((inlineCommentKey: string): typeof => {
  //  return <></>
  // });
  return <div>"YOYOYOYO"</div>;
}

export default PaperDraftInlineCommentDisplayContainer;
