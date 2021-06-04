import React, { Fragment, useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";

export function SimpleEditor({
  id,
  containerStyle,
  onChange,
  initialData,
  label,
  labelStyle,
  required,
}) {
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
      <div className={css(containerStyle)}>
        {label && (
          <div
            className={css(
              styles.inputLabel,
              styles.text,
              labelStyle && labelStyle,
              !label && styles.hide
            )}
          >
            {label && label}
            {required && <div className={css(styles.asterick)}>*</div>}
          </div>
        )}
        {editorLoaded && (
          <CKEditor
            onChange={(event, editor) => {
              onChange(id, editor.getData());
            }}
            onReady={(editor) => {
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "height",
                  "200px",
                  editor.editing.view.document.getRoot()
                );
              });
              setEditorInstance(editor);
            }}
            editor={Editor}
            config={editorConfiguration}
            data={initialData}
          />
        )}
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  asterick: {
    color: colors.BLUE(1),
  },
  inputLabel: {
    fontWeight: 500,
    marginBottom: 10,
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
  hide: {
    display: "none",
  },
});
