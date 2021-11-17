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
import { useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Loader from "../Loader/Loader";
import NoteShareButton from "~/components/Notebook/NoteShareButton";
import { connect } from "react-redux";
import { MessageActions } from "~/redux/message";
import { captureError } from "~/config/utils/error";
import { getUserNoteAccess } from "~/components/Notebook/utils/notePermissions";
import { PERMS } from "~/components/Notebook/config/notebookConstants";
import NoteOptionsMenuButton from "~/components/Notebook/NoteOptionsMenuButton";
import { isOrgMember } from "~/components/Org/utils/orgHelper";
import JupyterViewer from "@thomasvu/react-jupyter-notebook";
import test from "./test.json"; // You need to read the .ipynb file into a JSON Object.
import nb_test from "./nb_test.json"; // You need to read the .ipynb file into a JSON Object.

const saveData = async ({ editor, noteId, onSaveSuccess, onSaveFail }) => {
  if (editor.isReadOnly) {
    return false;
  }

  try {
    const noteParams = {
      title:
        editor.plugins
          .get("Title")
          .getTitle()
          .replace(/&nbsp;/g, " ") || "Untitled",
    };

    let noteResponse;
    let contentResponse;

    noteResponse = await fetch(
      API.NOTE({ noteId }),
      API.PATCH_CONFIG(noteParams)
    );

    if (noteResponse.ok) {
      const contentParams = {
        full_src: editor.getData(),
        plain_text: "",
        note: noteId,
      };

      contentResponse = await fetch(
        API.NOTE_CONTENT(),
        API.POST_CONFIG(contentParams)
      );
      if (contentResponse.ok) {
        return onSaveSuccess && onSaveSuccess(contentResponse);
      }
    }

    return onSaveFail && onSaveFail(contentResponse || noteResponse);
  } catch (error) {
    captureError({
      error,
      msg: "Failed to save content",
      data: { noteId },
    });
  }
};

const ELNEditor = ({
  ELNLoading,
  notePerms,
  currentOrganization,
  userOrgs,
  currentNote,
  handleEditorInput,
  setELNLoading,
  refetchNotePerms,
  setMessage,
  showMessage,
  user,
  onNotePermChange,
  onNoteCreate,
  onNoteDelete,
}) => {
  const router = useRouter();
  const { orgSlug } = router.query;
  const sidebarElementRef = useRef();
  const [presenceListElement, setPresenceListElement] = useState(null);
  const _isOrgMember = isOrgMember({ user, org: currentOrganization });

  const onRefChange = useCallback((node) => {
    if (node !== null) {
      setPresenceListElement(node);
    }
  }, []);

  const currentUserAccess = getUserNoteAccess({ user, notePerms, userOrgs });
  const noteIdLength = `${currentNote.id}`.length;
  const channelId = `${orgSlug.slice(0, 59 - noteIdLength)}-${currentNote.id}`;

  const onSaveFail = (response) => {
    if (response.status === 403) {
      setMessage("You do not have permission to edit this document");
      showMessage({ show: true, error: true });
    } else {
      captureError({
        msg: "Could not save content",
        data: { currentNote },
      });
    }
  };

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.noteHeader)}>
        <div className={css(styles.noteHeaderOpts)}>
          <div
            className={css(styles.presenceList) + " presence"}
            ref={onRefChange}
          />
          <NoteShareButton
            noteId={currentNote.id}
            notePerms={notePerms}
            org={currentOrganization}
            userOrgs={userOrgs}
            refetchNotePerms={refetchNotePerms}
            onNotePermChange={onNotePermChange}
          />
          {_isOrgMember && (
            <div className={css(styles.optionsMenuWrapper)}>
              <NoteOptionsMenuButton
                note={currentNote}
                title={currentNote.title}
                currentOrg={currentOrganization}
                onNoteCreate={onNoteCreate}
                onNoteDelete={onNoteDelete}
                onNotePermChange={onNotePermChange}
                show={true}
                size={24}
              />
            </div>
          )}
        </div>
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
              webSocketUrl: "wss://83764.cke-cs.com/ws",
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
                    return saveData({
                      editor,
                      noteId: currentNote.id,
                      onSaveFail,
                    });
                  },
                },
              }}
              editor={CKELNEditor}
              onChange={(event, editor) => handleEditorInput(editor)}
              onReady={(editor) => {
                if (currentUserAccess === PERMS.NOTE.VIEWER) {
                  editor.isReadOnly = true;
                }

                setELNLoading(false);
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
      <JupyterViewer rawIpynb={nb_test} />
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
  optionsMenuWrapper: {
    marginLeft: 17,
  },
  noteHeader: {
    display: "flex",
    userSelect: "none",
    margin: "auto 30px 0px auto",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingTop: 10,
  },
  noteHeaderOpts: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  presenceList: {},
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

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(ELNEditor);
