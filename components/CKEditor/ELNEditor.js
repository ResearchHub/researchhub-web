import API from "~/config/api";
import React, { useEffect, useRef, useState } from "react";
import { AUTH_TOKEN } from "~/config/constants";
import { css, StyleSheet } from "aphrodite";

// Components
import Button from "~/components/Form/Button";

export const ELNEditor = () => {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { CKEditor, Editor } = editorRef.current || {};

  const sidebarElementRef = useRef();
  const presenceListElementRef = useRef();

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@thomasvu/ckeditor5-custom-build").ELNEditor,
    };
    setEditorLoaded(true);
    return () => {
      //window.removeEventListener("resize", boundRefreshDisplayMode);
      //window.removeEventListener("beforeunload", boundCheckPendingActions);
    };
  }, []);

  function saveData(data) {
    console.log("saveData: " + data);
  }

  function manualSaveData(data) {
    console.log("manualSaveData: " + data);
  }

  const editorConfiguration = {
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: API.SAVE_IMAGE,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization:
          "Token " + (process.browser ? window.localStorage[AUTH_TOKEN] : ""),
      },
    },
    cloudServices: {
      tokenUrl:
        "https://80957.cke-cs.com/token/dev/f7269818e72213ec0c800718cd4aeeed27eaa131ec5f5b60f3339fdeeecc",
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

  return (
    <div className="centered">
      <div className={css(styles.presenceList)}>
        <div ref={presenceListElementRef} className="presence"></div>
      </div>
      {editorLoaded && (
        <div className={css(styles.editor)}>
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
        </div>
      )}
      <div ref={sidebarElementRef} className="sidebar"></div>
      <div className={css(styles.saveButton)}>
        <Button
          hideRipples={true}
          isWhite={false}
          label={"Save"}
          onClick={() => manualSaveData(editorInstance.getData())}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  presenceList: {
    marginBottom: 10,
    marginTop: 10,
  },
  editor: {
    width: "100vw",
  },
  saveButton: {
    marginBottom: 15,
    marginTop: 15,
  },
});
