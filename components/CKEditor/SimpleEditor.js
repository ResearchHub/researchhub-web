import React, { Fragment, useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import colors from "../../config/themes/colors";
import API from "~/config/api";
import { AUTH_TOKEN } from "~/config/constants";

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

  let token = "";
  if (process.browser) {
    token = window.localStorage[AUTH_TOKEN];
  }

  const editorConfiguration = {
    toolbar: {
      viewportTopOffset: window.innerWidth < breakpoints.small.int ? 66 : 80,
      items: [
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
    },
    mediaEmbed: {
      previewsInData: true,
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: API.SAVE_IMAGE,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization: "Token " + token,
      },
    },
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("ckeditor5-classic-plus"),
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
