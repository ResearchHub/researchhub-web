import { StyleSheet } from "aphrodite";
import React, { useState } from "react";
import TextEditor from "../TextEditor";

type Props = {
  isReadOnly: boolean;
  onCancel: () => void;
  onSubmit: (text: String, plainText: String) => void;
  textData: any; // this is a draftjs object
};

function InlineCommentComposer({
  isReadOnly,
  onCancel,
  onSubmit,
  textData,
}: Props) {
  console.log(textData);
  console.warn("passedValue: ", textData); // <======= THIS GUY
  return (
    <TextEditor
      canEdit={true}
      commentEditor={true}
      commentEditorStyles={styles.commentEditorStyles}
      focusEditor={focus}
      mediaOnly={true}
      onCancel={onCancel}
      onSubmit={onSubmit}
      // passedValue={passedValue}
      initialValue={textData}
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
