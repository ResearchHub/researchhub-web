import { css, StyleSheet } from "aphrodite";
import { ID } from "../PaperDraft/undux/PaperDraftUnduxStore";
import React, { ReactElement, ReactFragment } from "react";
import InlineCommentComposer from "./InlineCommentComposer";

type Props = {
  commentData: Array<any>;
  commentThreadID: ID;
};

export default function InlineCommentThreadCardResponseSection({
  commentData,
  commentThreadID,
}: Props): ReactElement<ReactFragment> {
  const commentResponses =
    commentData.length > 0
      ? commentData.map((commentData, i: number) => {
          return (
            <InlineCommentComposer
              isReadOnly={true}
              key={`thread-response-${commentData.id}-${i}`}
              onCancel={() => {}}
              onSubmit={() => {}}
              textData={commentData ? commentData.text : null}
            />
          );
        })
      : null;

  return (
    <React.Fragment>
      <div className={css(styles.threadResponseComposerWrap)}>
        <InlineCommentComposer
          isReadOnly={false}
          onCancel={() => {}}
          onSubmit={() => {}}
          textData={null} /* initial data should be empty */
          placeholder={"Respond to comment above"}
        />
      </div>
      <div className={css(styles.threadResponsesWrap)}>{commentResponses}</div>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  threadResponsesWrap: { display: "flex", flexDirection: "column" },
  threadResponseComposerWrap: { marginBottom: 8 },
});
