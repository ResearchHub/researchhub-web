import { css, StyleSheet } from "aphrodite";
import { ID } from "../PaperDraft/undux/PaperDraftUnduxStore";
import React, { ReactElement, ReactFragment, useEffect, useState } from "react";
import InlineCommentComposer from "./InlineCommentComposer";
import {
  emptyFunction,
  silentEmptyFnc,
} from "../PaperDraft/util/PaperDraftUtils";
import InlineCommentUnduxStore from "../PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import { saveCommentToBackend } from "./api/InlineCommentCreate";

type Props = {
  auth: any;
  commentData: Array<any>;
  commentThreadID: ID;
  isActive?: boolean;
};

export default function InlineCommentThreadCardResponseSection({
  commentData,
  commentThreadID,
  isActive = false,
}: Props): ReactElement<"div"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const [composedResponse, setComposedResponse] = useState<any>(null);
  const [shouldShowComposer, setShouldShowComposer] = useState<boolean>(
    isActive
  );

  useEffect((): void => {
    setShouldShowComposer(isActive);
  }, [isActive]);

  const commentResponses =
    commentData.length > 0
      ? commentData.map((commentData, i: number) => {
          return (
            <InlineCommentComposer
              isReadOnly={true}
              key={`thread-response-${commentData.id}-${i}`}
              onCancel={silentEmptyFnc}
              onSubmit={silentEmptyFnc}
              textData={commentData ? commentData.text : null}
            />
          );
        })
      : null;

  const paperID = inlineCommentStore.get("paperID");
  return (
    <div className={css(styles.inlineCommentThreadCardResponseSection)}>
      {shouldShowComposer && (
        <div className={css(styles.threadResponseComposerWrap)}>
          <InlineCommentComposer
            isReadOnly={false}
            onCancel={silentEmptyFnc}
            onSubmit={(text: string, plainText: string) => {
              saveCommentToBackend({
                onSuccess: silentEmptyFnc,
                onError: emptyFunction,
                paperID,
                params: {
                  text,
                  parent: commentThreadID,
                  plain_text: plainText,
                },
                threadID: commentThreadID,
              });
            }}
            placeholder={"Respond to comment above"}
            textData={composedResponse}
          />
        </div>
      )}
      <div className={css(styles.threadResponsesWrap)}>{commentResponses}</div>
    </div>
  );
}

const styles = StyleSheet.create({
  inlineCommentThreadCardResponseSection: {},
  replyIcon: {
    color: "#918f9b",
    marginRight: 8,
  },
  responseText: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#AAAAAA",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  textBump: {
    marginBottom: 2,
  },
  threadResponsesWrap: { display: "flex", flexDirection: "column" },
  threadResponseComposerWrap: { marginBottom: 8 },
});
