import React, { Fragment, useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";

export type SimpleEditorProps = {
  id: string;
  initialData: string;
  onChange: (fieldID: string, value: string) => void;
};

export function SimpleEditor({ id, onChange, initialData }: SimpleEditorProps) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { CKEditor, Editor } = editorRef.current || {};

  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "blockquote",
      "codeBlock",
      "insertTable",
      "mathType",
      "|",
      "numberedList",
      "bulletedList",
      "outdent",
      "indent",
      "|",
      "link",
      "imageUpload",
      "mediaEmbed",
    ],
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("ckeditor5-simple-build/build/ckeditor").Editor,
    };
    setEditorLoaded(true);
  }, []);

  return (
    <Fragment>
      {editorLoaded && (
        <CKEditor
          onChange={(event, editor) => {
            onChange(id, editor.getData());
          }}
          onReady={setEditorInstance}
          editor={Editor}
          config={editorConfiguration}
          data={initialData}
        />
      )}
    </Fragment>
  );
}
