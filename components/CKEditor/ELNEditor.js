import { useEffect, useRef, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import {
  Context,
  ELNEditor as CKELNEditor,
} from "@thomasvu/ckeditor5-custom-build";

import { AUTH_TOKEN } from "~/config/constants";
import API from "~/config/api";
import { breakpoints } from "~/config/themes/screen";
import api from "~/config/api";
import Loader from "../Loader/Loader";

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
  setTitles,
  titles,
  user,
  currentNote,
  currentNoteId,
  onReady,
  disableELN,
  noteLoading,
}) => {
  const router = useRouter();
  const presenceListElementRef = useRef();
  const sidebarElementRef = useRef();

  const channelId = `${router.query.orgSlug}-${
    currentOrganizationId > 0 ? currentOrganizationId : user.id
  }-${currentNoteId}`;
  const INITIAL_CONTEXT_CONFIGURATION = {
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

          xhr.addEventListener("error", () =>
            reject(new Error("Network error"))
          );
          xhr.addEventListener("abort", () => reject(new Error("Abort")));
          xhr.setRequestHeader(
            "Authorization",
            "Token " +
              (typeof window !== "undefined"
                ? window.localStorage[AUTH_TOKEN]
                : "")
          );
          xhr.send();
        });
      },
      webSocketUrl: "wss://80957.cke-cs.com/ws",
    },
    // Collaboration configuration for the context:
    collaboration: {
      channelId,
    },
    sidebar: {
      container: sidebarElementRef.current,
    },
    presenceList: {
      container: presenceListElementRef.current,
      onClick: (user, element) => console.log(user, element),
    },
  };

  const [ELNLoaded, setELNLoaded] = useState(false);

  useEffect(() => {
    if (disableELN) {
      setELNLoaded(false);
    } else {
      setTimeout(() => {
        setELNLoaded(true);
      }, 50);
    }
  }, [disableELN]);

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

  const noteId = currentNoteId;

  if (!process.browser) {
    return null;
  }

  const CKConfig = {
    title: {
      placeholder: "Untitled",
    },
    placeholder:
      "Start typing to continue with an empty page, or pick a template",
    initialData: currentNote.latest_version?.src ?? "",
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
      channelId,
    },
    autosave: {
      save(editor) {
        return saveData(editor, noteId);
      },
    },
  };

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.presenceListContainer)}>
        <div
          ref={presenceListElementRef}
          className={css(styles.presenceList) + " presence"}
        />
      </div>
      {ELNLoaded && (
        <CKEditorContext
          config={INITIAL_CONTEXT_CONFIGURATION}
          context={Context}
        >
          {/* {editors} */}
          <div
            className={css(
              styles.editor,
              router.query.noteId !== noteId && styles.hideEditor
            )}
            key={noteId}
          >
            <CKEditor
              config={CKConfig}
              editor={CKELNEditor}
              id={noteId}
              onChange={(event, editor) => handleInput(editor)}
              onReady={(editor) => {
                onReady && onReady();
              }}
            />
          </div>
        </CKEditorContext>
      )}
      {noteLoading && (
        <div className={css(styles.loaderContainer)}>
          <Loader type="clip" />
        </div>
      )}
      <div ref={sidebarElementRef} className="sidebar"></div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
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
  loaderContainer: {
    height: "calc(100vh - 216px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  presenceList: {
    padding: 16,
    // display: "flex",
    // justifyContent: "flex-end",
    // marginRight: 60,
  },
});

export default ELNEditor;
