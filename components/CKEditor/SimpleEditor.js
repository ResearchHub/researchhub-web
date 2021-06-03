import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import Button from "~/components/Form/Button";

// Config
import API from "~/config/api";

export function SimpleEditor() {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { CKEditor, Editor } = editorRef.current || {};

  function manualSaveData(data) {
    console.log("manualSaveData: " + data);
  }

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
    return () => {
      //window.removeEventListener("resize", boundRefreshDisplayMode);
      //window.removeEventListener("beforeunload", boundCheckPendingActions);
    };
  }, []);

  const renderEditor = () => {
    return (
      <div className="row row-editor">
        {editorLoaded && (
          <CKEditor
            onReady={(editor) => {
              console.log("Editor is ready to use!", editor);
              setEditorInstance(editor);
            }}
            onChange={(event, editor) => console.log({ event, editor })}
            editor={Editor}
            config={editorConfiguration}
            data={""}
          />
        )}
      </div>
    );
  };

  return <div className="centered">{renderEditor()}</div>;
}

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 15,
  },
});
