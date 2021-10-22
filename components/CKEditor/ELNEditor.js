import API from "~/config/api";
import { AUTH_TOKEN } from "~/config/constants";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import {
  BUNDLE_VERSION,
  CKEditorCS as CKELNEditor,
  Context,
} from "@thomasvu/ckeditor5-custom-build";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import NoteShareButton from "~/components/Notebook/NoteShareButton";

const saveData = (editor, noteId) => {
  const noteParams = {
    title:
      editor.plugins
        .get("Title")
        .getTitle()
        .replace(/&nbsp;/g, " ") || "Untitled",
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
  ELNLoading,
  currentNote,
  notePerms,
  handleEditorInput,
  currentOrganization,
  userOrgs,
  setELNLoading,
}) => {
  const router = useRouter();
  const { orgSlug } = router.query;

  const sidebarElementRef = useRef();
  const [presenceListElement, setPresenceListElement] = useState(null);

  const onRefChange = useCallback((node) => {
    if (node !== null) {
      setPresenceListElement(node);
    }
  }, []);

  const channelId = `${orgSlug}-${currentNote.id}`;

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.noteHeader)}>
        <div
          className={css(styles.presenceList) + " presence"}
          ref={onRefChange}
        />
        <NoteShareButton
          noteId={currentNote.id}
          notePerms={notePerms}
          org={currentOrganization}
          userOrgs={userOrgs}
        />
      </div>
      {presenceListElement !== null && (
        <CKEditorContext
          config={{
            // The configuration for real-time collaboration features, shared between the editors:
            cloudServices: {
              bundleVersion: BUNDLE_VERSION,
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
                  xhr.addEventListener("abort", () =>
                    reject(new Error("Abort"))
                  );
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
              container: presenceListElement,
              onClick: (user) => {
                const e = window.event;
                const url = `/user/${user.id}/overview`;
                if (e.metaKey || e.shiftKey) {
                  window.open(url);
                } else {
                  router.push(url);
                }
              },
            },
          }}
          context={Context}
        >
          <div className={"eln"}>
            <CKEditor
              config={{
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
                    return saveData(editor, currentNote.id);
                  },
                },
              }}
              editor={CKELNEditor}
              onChange={(event, editor) => handleEditorInput(editor)}
              onReady={(editor) => {
                setELNLoading(false);
                console.log("Editor is ready to use!", editor);
              }}
            />
          </div>
        </CKEditorContext>
      )}
      <div ref={sidebarElementRef} className="sidebar" />
      {ELNLoading && (
        <div className={css(styles.loader)}>
          <Loader type="clip" size={50} />
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "calc(100vh - 80px)",
    marginLeft: "max(min(16%, 300px), 240px)",
    overflow: "auto",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "calc(100vh - 66px)",
    },
  },
  noteHeader: {
    display: "flex",
    height: 50,
  },
  presenceList: {
    margin: "auto 60px 0px auto",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: "max(min(16%, 300px), 240px)",
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ELNEditor;
