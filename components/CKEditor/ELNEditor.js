import API from "~/config/api";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

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

const ELNEditor = ({
  currentOrganizationId,
  editorInstances,
  notes,
  setEditorInstances,
  setTitles,
  titles,
  user,
}) => {
  const router = useRouter();
  const editorRef = useRef();
  const presenceListElementRef = useRef();
  const sidebarElementRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      CKEditorContext: require("@ckeditor/ckeditor5-react").CKEditorContext,
      //CKEditorInspector: require("@ckeditor/ckeditor5-inspector"),
      Context: require("@thomasvu/ckeditor5-custom-build").Context,
      ELNEditor: require("@thomasvu/ckeditor5-custom-build").ELNEditor,
    };
    setEditorLoaded(true);
  }, []);

  const {
    CKEditor,
    CKEditorContext,
    //CKEditorInspector,
    Context,
    ELNEditor,
  } = editorRef.current || {};

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

  const contextConfiguration = {
    // The configuration for real-time collaboration features, shared between the editors:
    cloudServices: {
      tokenUrl: () => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", API.CKEDITOR_TOKEN());

          xhr.addEventListener("load", () => {
            const statusCode = xhr.status;
            const xhrResponse = xhr.response;

            if (statusCode < 200 || statusCode > 299) {
              return reject(new Error("Cannot download a new token!"));
            }

            return resolve(xhrResponse);
          });

          xhr.addEventListener("error", () => reject(new Error("Network error")));
          xhr.addEventListener("abort", () => reject(new Error("Abort")));
          xhr.setRequestHeader(
            "Authorization",
            "Token " + (typeof window !== "undefined" ? window.localStorage[AUTH_TOKEN] : ""),
          );
          xhr.send();
        });
      },
      webSocketUrl: "wss://80957.cke-cs.com/ws",
    },
    // Collaboration configuration for the context:
    collaboration: {
      channelId: `${router.query.orgName}-${currentOrganizationId > 0 ? currentOrganizationId : user.id}`,
    },
    sidebar: {
      container: sidebarElementRef.current,
    },
    presenceList: {
      container: presenceListElementRef.current,
      onClick: (user, element) => console.log(user, element),
    },
  };

  const editors = notes.map(note => {
    const noteId = note.id.toString();
    return (
      <div
        className={css(
          styles.editor,
          router.query.noteId !== noteId && styles.hideEditor,
        )}
        key={noteId}
      >
        <CKEditor
          config={{
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
            collaboration: {
              channelId: noteId,
            },
            autosave: {
              save(editor) {
                return saveData(editor, noteId);
              },
            },
          }}
          editor={ELNEditor}
          id={noteId}
          onChange={(event, editor) => handleInput(editor)}
          onReady={(editor) => {
            console.log("Editor is ready to use!", editor);
            //CKEditorInspector.attach(editor);
            setEditorInstances([...editorInstances, editor]);
            editor.editing.view.change((writer) => {
              writer.setStyle(
                {
                  "min-height": "calc(100% - 227px)",
                },
                editor.editing.view.document.getRoot()
              );
            });
          }}
        />
      </div>
    );
  });

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.presenceListContainer)}>
        <div ref={presenceListElementRef} className={css(styles.presenceList) + " presence"}></div>
      </div>
      {editorLoaded &&
        <CKEditorContext config={contextConfiguration} context={Context}>
          {editors}
        </CKEditorContext>
      }
      <div ref={sidebarElementRef} className="sidebar"></div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: "max(min(16%, 300px), 240px)",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
  },
  editorContainer: {},
  editor: {
    height: "100%",
  },
  hideEditor: {
    display: "none",
  },
  presenceListContainer: {
    background: "#fff",
  },
  presenceList: {
    marginLeft: 10,
    marginTop: 5,
  },
});

export default ELNEditor;
