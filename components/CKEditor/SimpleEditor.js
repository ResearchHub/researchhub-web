import { Fragment, useState, useEffect, useRef } from "react";
import { AUTH_TOKEN } from "~/config/constants";
import { StyleSheet, css } from "aphrodite";
import API from "~/config/api";
import colors from "../../config/themes/colors";
import Cookies from "js-cookie";

export default function SimpleEditor(props) {
  const {
    containerStyle,
    editing,
    id,
    initialData,
    isBalloonEditor,
    label,
    labelStyle,
    noTitle,
    onChange,
    placeholder,
    readOnly,
    required,
  } = props;
  const editorRef = useRef();
  const observerRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { CKEditor, SimpleEditor, SimpleBalloonEditor } =
    editorRef.current || {};

  const editorConfiguration = {
    ...(noTitle && { removePlugins: ["Title"] }),
    placeholder,
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: API.SAVE_IMAGE,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization:
          "Token " +
          (typeof window !== "undefined" ? Cookies.get(AUTH_TOKEN) : ""),
      },
    },
  };

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      SimpleEditor: require("@researchhub/ckeditor5-custom-build").SimpleEditor,
      SimpleBalloonEditor: require("@researchhub/ckeditor5-custom-build")
        .SimpleBalloonEditor,
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
        {editorLoaded ? (
          <div className={editing && "editing"}>
            <CKEditor
              className={css(styles.editor)}
              config={editorConfiguration}
              data={initialData}
              editor={isBalloonEditor ? SimpleBalloonEditor : SimpleEditor}
              id={id}
              onChange={(event, editor) => {
                onChange(id, editor.getData());
              }}
              onReady={(editor) => {
                if (readOnly) {
                  editor.isReadOnly = true;
                } else {
                  editor.editing.view.change((writer) => {
                    // writer.setStyle(
                    //   "min-height",
                    //   "200px",
                    //   editor.editing.view.document.getRoot()
                    // );
                  });
                }

                setEditorInstance(editor);
              }}
            />
          </div>
        ) : null}
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
