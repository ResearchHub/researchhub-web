import { StyleSheet } from "aphrodite";
import React, { useState } from "react";
import TextEditor from "../TextEditor";

type Props = {
  isReadOnly: boolean;
  onCancel: () => void;
  onChange: (str: any) => void;
  onSubmit: (text: String, plainText: String) => void;
};

function InlineCommentComposer({
  isReadOnly,
  onCancel,
  onChange,
  onSubmit,
}: Props) {
  return (
    <TextEditor
      canEdit={true}
      commentEditor={true}
      commentEditorStyles={styles.commentEditorStyles}
      focusEditor={focus}
      initialValue={""}
      onCancel={onCancel}
      onChange={onChange}
      onSubmit={onSubmit}
      placeholder={"What are your thoughts?"}
      readOnly={isReadOnly}
      smallToolBar={true}
      mediaOnly={true}
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
