import API from "~/config/api";
import colors from "~/config/themes/colors";

import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined, isEmpty } from "~/config/utils/nullchecks";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import OrgSidebar from "~/components/Org/OrgSidebar";

const saveData = (editor, noteId) => {
  const noteParams = {
    title: editor.plugins.get("Title").getTitle() || "Untitled",
  };
  fetch(API.NOTE({ noteId }), API.PATCH_CONFIG(noteParams))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);

  const noteContentParams = {
    full_src: editor.getData(),
    plain_text: "",
    note: noteId,
  };
  fetch(API.NOTE_CONTENT(), API.POST_CONFIG(noteContentParams))
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON);
};

export const ELNEditor = ({ currentNoteId, user, notes, titles, setTitles }) => {
  const router = useRouter();
  const editorRef = useRef();
  const presenceListElementRef = useRef();
  const sidebarElementRef = useRef();

  const { CKEditor, Editor, CKEditorInspector } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false); 

console.log('currentNoteId', currentNoteId);  
console.log('notes', notes);  

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@thomasvu/ckeditor5-custom-build").ELNEditor,
      CKEditorInspector: require("@ckeditor/ckeditor5-inspector"),
    };
    setEditorLoaded(true);
    return () => {
      //window.removeEventListener("resize", boundRefreshDisplayMode);
      //window.removeEventListener("beforeunload", boundCheckPendingActions);
    };
  }, []);


  const handleInput = (editor) => {
    const updatedTitles = {};
    for (const key in titles) {
      updatedTitles[key] =
        key === editor.config._config.collaboration.channelId
          ? editor.plugins.get("Title").getTitle() || "Untitled"
          : titles[key];
    }
    setTitles(updatedTitles);
  };

  const editors = notes.map(note => {
    const editorConfiguration = {
      title: {
        placeholder: "Untitled",
      },
      placeholder:
        "Start typing to continue with an empty page, or pick a template",
      initialData: note.latest_version?.src ?? "",
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
      cloudServices: {
        tokenUrl:
          "https://80957.cke-cs.com/token/dev/3d646c4223d2d642814d04dc9d1d748beba883a1646f419aff5d61d61efa",
        webSocketUrl: "wss://80957.cke-cs.com/ws",
      },
      collaboration: {
        channelId: note.id.toString(),
      },
      sidebar: {
        container: sidebarElementRef.current,
      },
      presenceList: {
        container: presenceListElementRef.current,
      },
      autosave: {
        save(editor) {
          return saveData(editor, note.id.toString());
        },
      },
    };

    return (
      <div
        className={css(
          styles.editor,
          currentNoteId !== note.id.toString() && styles.hideEditor,
        )}
        key={note.id.toString()}
      >
        <CKEditor
          config={editorConfiguration}
          editor={Editor}
          id={note.id.toString()}
          onChange={(event, editor) => handleInput(editor)}
          onReady={(editor) => {
            console.log("Editor is ready to use!", editor);
            //CKEditorInspector.attach(editor);

            editor.editing.view.change((writer) => {
              writer.setStyle(
                {
                  "min-height": "calc(100% - 227px)",
                },
                editor.editing.view.document.getRoot()
              );
            });

            //// Switch between inline and sidebar annotations according to the window size.
            //const boundRefreshDisplayMode = refreshDisplayMode.bind(
            //  this,
            //  editor
            //);
            //// Prevent closing the tab when any action is pending.
            //const boundCheckPendingActions = checkPendingActions.bind(
            //  this,
            //  editor
            //);

            //window.addEventListener("resize", boundRefreshDisplayMode);
            //window.addEventListener("beforeunload", boundCheckPendingActions);
            //refreshDisplayMode(editor);
          }}
        />
      </div>
    );
  });

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.presenceList)}>
        <div ref={presenceListElementRef} className="presence"></div>
      </div>  
      <div className={css(styles.editorContainer)}>
        {editorLoaded && editors}
      </div>
      <div ref={sidebarElementRef} className="sidebar"></div>  
    </div>  
  )
};


const styles = StyleSheet.create({
  container: {
    marginLeft: "max(min(16%, 300px), 240px)",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
  },
  editorContainer: {
  },
  editor: {
    height: "100%",
  },
  hideEditor: {
    display: "none",
  },
  presenceList: {
    display: "none",
    marginBottom: 10,
    marginTop: 10,
  },
});

export default ELNEditor;
