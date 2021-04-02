import { StyleSheet } from "aphrodite";
import React, { useState } from "react";
import TextEditor from "../TextEditor";

type Props = {
  isReadOnly: boolean;
  onCancel: () => void;
  onSubmit: (text: String, plainText: String) => void;
  passedValue: string;
};

function InlineCommentComposer({
  isReadOnly,
  onCancel,
  onSubmit,
  passedValue,
}: Props) {
  console.warn("passedValue: ", passedValue); // <======= THIS GUY
  return (
    <TextEditor
      canEdit={true}
      commentEditor={true}
      commentEditorStyles={styles.commentEditorStyles}
      focusEditor={focus}
      mediaOnly={true}
      onCancel={onCancel}
      onSubmit={onSubmit}
      data={{ text: passedValue }}
      // passedValue={passedValue}
      placeholder={"What are your thoughts?"}
      readOnly={isReadOnly}
      smallToolBar={true}
    />
  );
}

var styles = StyleSheet.create({
  commentEditorStyles: {
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
});

export default InlineCommentComposer;
