import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import Button from "~/components/Form/Button";

// Config
import API from "~/config/api";

export function ELNEditor() {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { CKEditor, Editor } = editorRef.current || {};

  const sidebarElementRef = useRef();
  const presenceListElementRef = useRef();

  function saveData(data) {
    console.log("saveData: " + data);
  }

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
      "|",
      "comment",
      "trackChanges",
    ],
    cloudServices: {
      tokenUrl:
        "https://80957.cke-cs.com/token/dev/960c0bc0e3d16e2cd7f0526fa9839a08285b35601de07963c52090da8bf6",
      uploadUrl: "https://80957.cke-cs.com/easyimage/upload/",
      webSocketUrl: "wss://80957.cke-cs.com/ws",
    },
    collaboration: {
      channelId: "2ncu8o1t3v8",
    },
    sidebar: {
      container: sidebarElementRef.current,
    },
    presenceList: {
      container: presenceListElementRef.current,
    },
    autosave: {
      save(editor) {
        return saveData(editor.getData());
      },
    },
  };

  useEffect(() => {
    console.log(editorRef);
    if (!editorRef.current) {
      editorRef.current = {
        CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
        Editor: require("ckeditor5-eln-build/build/ckeditor").Editor,
      };
    }
    setEditorLoaded(true);
    return () => {
      //window.removeEventListener("resize", boundRefreshDisplayMode);
      //window.removeEventListener("beforeunload", boundCheckPendingActions);
    };
  }, []);

  const refreshDisplayMode = (editor) => {
    const annotationsUIs = editor.plugins.get("AnnotationsUIs");
    const sidebarElement = sidebarElementRef.current;

    if (window.innerWidth < 1070) {
      sidebarElement.classList.remove("narrow");
      sidebarElement.classList.add("hidden");
      annotationsUIs.switchTo("inline");
    } else if (window.innerWidth < 1300) {
      sidebarElement.classList.remove("hidden");
      sidebarElement.classList.add("narrow");
      annotationsUIs.switchTo("narrowSidebar");
    } else {
      sidebarElement.classList.remove("hidden", "narrow");
      annotationsUIs.switchTo("wideSidebar");
    }
  };

  const checkPendingActions = (editor, domEvt) => {
    if (editor.plugins.get("PendingActions").hasAny) {
      domEvt.preventDefault();
      domEvt.returnValue = true;
    }
  };

  const renderEditor = () => {
    return (
      <div className={css(styles.editor)}>
        {editorLoaded && (
          <CKEditor
            onReady={(editor) => {
              console.log("Editor is ready to use!", editor);
              setEditorInstance(editor);

              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "height",
                  "1200px",
                  editor.editing.view.document.getRoot()
                );
              });

              // Switch between inline and sidebar annotations according to the window size.
              const boundRefreshDisplayMode = refreshDisplayMode.bind(
                this,
                editor
              );
              // Prevent closing the tab when any action is pending.
              const boundCheckPendingActions = checkPendingActions.bind(
                this,
                editor
              );

              window.addEventListener("resize", boundRefreshDisplayMode);
              window.addEventListener("beforeunload", boundCheckPendingActions);
              refreshDisplayMode(editor);
            }}
            onChange={(event, editor) => console.log({ event, editor })}
            editor={Editor}
            config={editorConfiguration}
            data={"hello world"}
          />
        )}
        <div ref={sidebarElementRef} className="sidebar"></div>
      </div>
    );
  };

  return (
    <div className="centered">
      <div className={css(styles.presenceList)}>
        <div ref={presenceListElementRef} className="presence"></div>
      </div>
      {renderEditor()}
      <div className={css(styles.saveButton)}>
        <Button
          isWhite={false}
          label={"Save"}
          hideRipples={true}
          onClick={() => manualSaveData(editorInstance.getData())}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  presenceList: {
    marginTop: 10,
    marginBottom: 10,
  },
  editor: {
    width: "90vw",
  },
  saveButton: {
    marginTop: 15,
    marginBottom: 15,
  },
});
