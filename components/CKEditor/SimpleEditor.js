import { AUTH_TOKEN } from "~/config/constants";
import { Fragment, useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import API from "~/config/api";
import colors from "../../config/themes/colors";

export default function SimpleEditor({
  containerStyle,
  id,
  initialData,
  label,
  labelStyle,
  onChange,
  placeholder,
  readOnly,
  required,
}) {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { CKEditor, Editor } = editorRef.current || {};

  const editorConfiguration = {
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: API.SAVE_IMAGE,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization:
          "Token " +
          (typeof window !== "undefined"
            ? window.localStorage[AUTH_TOKEN]
            : ""),
      },
    },
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@thomasvu/ckeditor5-custom-build").SimpleBalloonEditor,
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
            placeholder={placeholder}
            onChange={(event, editor) => {
              onChange(id, editor.getData());
            }}
            onReady={(editor) => {
              if (readOnly) {
                editor.isReadOnly = true;
              }
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "min-height",
                  "200px",
                  editor.editing.view.document.getRoot()
                );
              });
              setEditorInstance(editor);
            }}
            editor={Editor}
            config={editorConfiguration}
            data={initialData}
            className={css(styles.editor)}
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
