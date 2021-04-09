import { css, StyleSheet } from "aphrodite";
import { ID } from "../PaperDraft/undux/PaperDraftUnduxStore";
import React, { ReactElement, ReactFragment, useEffect, useState } from "react";
import InlineCommentComposer from "./InlineCommentComposer";
import icons from "../../config/themes/icons";

type Props = {
  commentData: Array<any>;
  commentThreadID: ID;
  isActive?: boolean;
};

function emptyFunction(): void {}

export default function InlineCommentThreadCardResponseSection({
  commentData,
  commentThreadID,
  isActive = false,
}: Props): ReactElement<"div"> {
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
              onCancel={emptyFunction}
              onSubmit={emptyFunction}
              textData={commentData ? commentData.text : null}
            />
          );
        })
      : null;

  return (
    <div className={css(styles.inlineCommentThreadCardResponseSection)}>
      {shouldShowComposer && (
        <div className={css(styles.threadResponseComposerWrap)}>
          <InlineCommentComposer
            isReadOnly={false}
            onCancel={emptyFunction}
            onSubmit={emptyFunction}
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
