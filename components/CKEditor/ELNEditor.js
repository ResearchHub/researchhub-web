import API from "~/config/api";
import React, { useEffect, useRef, useState } from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { AUTH_TOKEN } from "~/config/constants";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";

// Components
import Button from "~/components/Form/Button";
import Collapsible from "~/components/Form/Collapsible";

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
    <div className={css(styles.container)}>
      <div className={css(styles.presenceList)}>
        <div ref={presenceListElementRef} className="presence"></div>
      </div>
      <div className={css(styles.sidebar)}>
        <Collapsible
          className={css(styles.sidecolumnHeader)}
          contentInnerClassName={css(styles.collapsibleContent)}
          open={true}
          openedClassName={css(styles.sidecolumnHeader)}
          trigger={
            <div className={css(styles.trigger)}>
              Workspace
              <span className={css(styles.chevronDown)}>
                {icons.chevronDownLeft}
              </span>
            </div>
          }
        >
          <ul>
            <li>Note 1</li>
            <li>Note 2</li>
            <li>Note 3</li>
          </ul>
        </Collapsible>
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
                  "100%",
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
      {/*<div className={css(styles.saveButton)}>
        <Button
          hideRipples={true}
          isWhite={false}
          label={"Save"}
          onClick={() => manualSaveData(editorInstance.getData())}
        />
      </div>*/}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    background: "#FFF",
    display: "flex",
    maxWidth: "100vw",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sidebar: {
    background: "#f9f9fc",
    //background: "#ddd",
    minWidth: 255,
    maxWidth: 400,
    width: "18%",
    position: "sticky",
    top: -15,
    height: "100vh",
    paddingTop: "30px",
    paddingLeft: "15px",
    paddingRight: "15px",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      display: "none",
    },
  },
  presenceList: {
    display: "none",
    marginBottom: 10,
    marginTop: 10,
  },
  editor: {
    maxWidth: "1200px",
    marginLeft: 30,
    marginRight: 30,
  },
  saveButton: {
    marginBottom: 15,
    marginTop: 15,
  },
  sidecolumnHeader: {
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: 1.2,
    color: colors.BLACK(0.6),
  },
  collapsibleSection: {
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000000",
    marginTop: 24,
  },
  collapsibleContent: {
    marginLeft: "3px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "26px",
    color: "#241F3A",
  },
  chevronDown: {
    marginLeft: "auto",
  },
  trigger: {
    display: "flex",
    cursor: "pointer",
  },
});
