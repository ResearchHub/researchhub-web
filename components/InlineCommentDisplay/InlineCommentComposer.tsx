import { StyleSheet } from "aphrodite";
import React, { useState } from "react";
import TextEditor from "../TextEditor";

type Props = {
  onCancel: () => void;
  onChange: (str: any) => void;
  onSubmit: () => void;
  value: any;
};

function InlineCommentComposer({ onCancel, onChange, onSubmit, value }: Props) {
  const [initValue, _setInitValue] = useState<any>(value);
  return (
    <TextEditor
      canEdit={true}
      commentEditor={true}
      commentEditorStyles={styles.commentEditorStyles}
      focusEditor={focus}
      initialValue={initValue}
      onCancel={onCancel}
      onChange={onChange}
      onSubmit={onSubmit}
      placeholder={"Leave an inline comment"}
      readOnly={false}
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
