import API from "~/config/api";
import Loader from "~/components/Loader/Loader";
import NotebookHeader from "~/components/Notebook/NotebookHeader";
import { AUTH_TOKEN } from "~/config/constants";
import {
  BUNDLE_VERSION,
  CKEditorCS as CKELNEditor,
  Context,
} from "@researchhub/ckeditor5-custom-build";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";
import { MessageActions } from "~/redux/message";
import { PERMS } from "~/components/Notebook/config/notebookConstants";
import { breakpoints } from "~/config/themes/screen";
import { captureEvent } from "~/config/utils/events";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getUserNoteAccess } from "~/components/Notebook/utils/notePermissions";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { unescapeHtmlString } from "~/config/utils/unescapeHtmlString";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import Cookies from "js-cookie";

const saveData = async ({
  editor,
  noteId,
  onSaveSuccess,
  onSaveFail,
  parsedNoteTitle,
}) => {
  if (editor.isReadOnly) {
    return false;
  }

  try {
    const noteParams = {
      title: parsedNoteTitle,
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
    captureEvent({
      error,
      msg: "Failed to save content",
      data: { noteId },
    });
  }
};

const ELNEditor = ({
  ELNLoading,
  currentNote,
  currentOrganization,
  handleEditorInput,
  isOrgMember,
  notePerms,
  redirectToNote,
  refetchNotePerms,
  setELNLoading,
  setMessage,
  showMessage,
  user,
  userOrgs,
}) => {
  const router = useRouter();
  const { orgSlug } = router.query;
  const sidebarElementRef = useRef();
  const [presenceListElement, setPresenceListElement] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);

  const onRefChange = useCallback((node) => {
    if (node !== null) {
      setPresenceListElement(node);
    }
  }, []);
  const currentUserAccess = getUserNoteAccess({ user, notePerms, userOrgs });
  const noteIdLength = `${currentNote.id}`.length;
  const channelId = `${orgSlug.slice(0, 59 - noteIdLength)}-${currentNote.id}`;
  const editorInstanceTitle = editorInstance?.plugins?.get("Title")?.getTitle();
  const parsedNoteTitle = unescapeHtmlString(
    editorInstanceTitle ? editorInstanceTitle : "Untitled"
  );

  useEffect(() => {
    if (process.browser) {
      document.title =
        isEmpty(parsedNoteTitle) || parsedNoteTitle === "Untitled"
          ? "ResearchHub | Notebook"
          : parsedNoteTitle;
    }

    return () => {
      document.title = "ResearchHub";
    };
  }, [parsedNoteTitle]);

  const onSaveFail = (response) => {
    if (response.status === 403) {
      setMessage("You do not have permission to edit this document");
      showMessage({ show: true, error: true });
    } else {
      captureEvent({
        msg: "Could not save content",
        data: { currentNote },
      });
    }
  };

  const getEditorContent = () => {
    return {
      full_src: editorInstance.getData(),
      editorInstance,
      title: parsedNoteTitle,
    };
  };

  return (
    <div className={css(styles.container)}>
      <NotebookHeader
        currentNote={currentNote}
        currentOrganization={currentOrganization}
        getEditorContent={getEditorContent}
        isOrgMember={isOrgMember}
        notePerms={notePerms}
        onRefChange={onRefChange}
        redirectToNote={redirectToNote}
        refetchNotePerms={refetchNotePerms}
        userOrgs={userOrgs}
      />
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
                        ? Cookies.get(AUTH_TOKEN)
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
                        ? Cookies.get(AUTH_TOKEN)
                        : ""),
                  },
                },
                collaboration: {
                  channelId,
                },
                autosave: {
                  save(editor) {
                    const editorInstanceTitle = editor?.plugins
                      ?.get("Title")
                      ?.getTitle();
                    const parsedNoteTitle = unescapeHtmlString(
                      editorInstanceTitle ? editorInstanceTitle : "Untitled"
                    );

                    return saveData({
                      parsedNoteTitle,
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
                setEditorInstance(editor);
                setELNLoading(false);
              }}
            />
          </div>
        </CKEditorContext>
      )}
      <div ref={sidebarElementRef} className="sidebar" />
      {ELNLoading && (
        <div className={css(styles.loader)}>
          <Loader size={50} />
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "calc(100vh - 80px)",
    // marginLeft: "max(min(16%, 300px), 160px)",
    overflow: "auto",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "calc(100vh - 66px)",
    },
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

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(null, mapDispatchToProps)(ELNEditor);
