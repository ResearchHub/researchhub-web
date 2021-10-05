import API from "~/config/api";
import Link from "next/link";
import ResearchHubPopover from "~/components/ResearchHubPopover";
import SidebarSectionContent from "~/components/CKEditor/SidebarSectionContent";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const NoteTemplateModal = dynamic(() => import("~/components/Modals/NoteTemplateModal"));

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

export const ELNEditor = ({ user }) => {
  const router = useRouter();
  const editorRef = useRef();
  const presenceListElementRef = useRef();
  const sidebarElementRef = useRef();
  const [currentOrganizationId, setCurrentOrganizationId] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);
  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [refetchNotes, setRefetchNotes] = useState(false);
  const [refetchTemplates, setRefetchTemplates] = useState(false);
  const [titles, setTitles] = useState({});
  const [editorInstances, setEditorInstances] = useState([]);

  const {
    CKEditor,
    CKEditorContext,
    CKEditorInspector,
    Context,
    ELNEditor,
  } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      CKEditorContext: require("@ckeditor/ckeditor5-react").CKEditorContext,
      CKEditorInspector: require("@ckeditor/ckeditor5-inspector"),
      Context: require("@thomasvu/ckeditor5-custom-build").Context,
      ELNEditor: require("@thomasvu/ckeditor5-custom-build").ELNEditor,
    };
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    fetch(API.ORGANIZATION({ userId: user.id }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        setOrganizations(data);
        setCurrentOrganizationId(getCurrentOrganizationId(data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!isNullOrUndefined(currentOrganizationId)) {
      fetch(API.NOTE({ orgId: currentOrganizationId }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((data) => {
          const sortedNotes = data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
          setNotes(sortedNotes);
          const updatedTitles = {};
          for (const note of sortedNotes) {
            updatedTitles[note.id.toString()] = note.title;
          }
          setTitles(updatedTitles);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [refetchNotes, currentOrganizationId]);

  useEffect(() => {
    setCurrentOrganizationId(getCurrentOrganizationId(organizations));
    setEditorInstances([]);
  }, [router.query.orgName]);

  const getCurrentOrganizationId = (orgs) => {
    const orgName = router.query.orgName;
    if (orgName === "personal") {
      return 0; // orgId of 0 for personal notes
    } else {
      for (const org of orgs) {
        if (orgName === org.slug) {
          return org.id;
        }
      }
    }
  };

  const handleCreateNote = () => {
    const params = {
      organization: currentOrganizationId,
      title: "Untitled",
    };

    fetch(API.NOTE({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((note) => {
        const noteId = note.id.toString();
        setRefetchNotes(!refetchNotes);
        setTitles({
          [noteId]: note.title,
          ...titles
        });
        router.push(`/notebook/${router.query.orgName}/${noteId}`);
      });
  };

  const handleDeleteNote = (noteId) => {
    fetch(API.NOTE_DELETE({ noteId }), API.POST_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((deleted_note) => {
        const newNotes = notes.filter(note => note.id !== deleted_note.id);
        setNotes(newNotes);
        const newEditorInstances = editorInstances.filter(
          editor => editor.config._config.collaboration.channelId !== deleted_note.id.toString()
        );
        setEditorInstances(newEditorInstances);
        router.push(`/notebook/${router.query.orgName}/${newNotes[0].id}`);
      });
  };

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

  let organizationName;
  let organizationImage;
  if (currentOrganizationId === 0) {
    organizationName = "Personal Notes";
    organizationImage = user.author_profile.profile_image;
  } else if (currentOrganizationId > 0) {
    for (const org of organizations) {
      if (org.id === currentOrganizationId) {
        organizationName = org.name;
        organizationImage = org.cover_image;
      }
    }
  }

  return (
    <div className={css(styles.container)}>
      <NoteTemplateModal
        currentOrganizationId={currentOrganizationId}
        isOpen={isNoteTemplateModalOpen}
        refetchNotes={refetchNotes}
        refetchTemplates={refetchTemplates}
        setIsOpen={setIsNoteTemplateModalOpen}
        setRefetchNotes={setRefetchNotes}
        setRefetchTemplates={setRefetchTemplates}
        user={user}
      />
      <div className={css(styles.sidebar)}>
        <div>
          <ResearchHubPopover
            containerStyle={{ marginLeft: "10px", marginTop: "-10px" }}
            isOpen={isPopoverOpen}
            popoverContent={
              <div className={css(styles.popoverBodyContent)}>
                <Link href={`/notebook/personal/1`}>
                  <a className={css(styles.popoverBodyItem)} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    <img className={css(styles.popoverBodyItemImage)} draggable="false" src={user.author_profile.profile_image} />
                    <div className={css(styles.popoverBodyItemTitle)}>Personal Notes</div>
                  </a>
                </Link>
                {organizations.map(org => (
                  <Link href={`/notebook/${org.slug}/1`} key={org.id.toString()}>
                    <a className={css(styles.popoverBodyItem)} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                      <img className={css(styles.popoverBodyItemImage)} draggable="false" src={org.cover_image} />
                      <div className={css(styles.popoverBodyItemText)}>
                        <div className={css(styles.popoverBodyItemTitle)}>{org.name}</div>
                        <div className={css(styles.popoverBodyItemSubtitle)}>{"1 member"}</div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            }
            positions={["bottom"]}
            setIsPopoverOpen={setIsPopoverOpen}
            targetContent={
              <div className={css(styles.popoverTarget)} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                <img className={css(styles.popoverBodyItemImage)} draggable="false" src={organizationImage} />
                {organizationName}
                <span className={css(styles.sortIcon)}>
                  {icons.sort}
                </span>
              </div>
            }
          />
        </div>
        <div
          className={css(styles.sidebarSection, hideNotes && styles.showBottomBorder)}
          onClick={() => setHideNotes(!hideNotes)}
        >
          Notes
          <span className={css(styles.chevronIcon)}>
            {hideNotes ? icons.chevronDown : icons.chevronUp}
          </span>
        </div>
        {!hideNotes && (
          <div>
            {notes.map(note => {
              const noteId = note.id.toString();
              let editorInstance;
              for (const editor of editorInstances) {
                if (noteId === editor.config._config.collaboration.channelId) {
                  editorInstance = editor;
                }
              }
              return (
                <SidebarSectionContent
                  currentNoteId={router.query.noteId}
                  currentOrganizationId={currentOrganizationId}
                  handleDeleteNote={handleDeleteNote}
                  key={noteId}
                  noteBody={editorInstance?.getData() ?? ""}
                  noteId={noteId}
                  orgName={router.query.orgName}
                  refetchTemplates={refetchTemplates}
                  setRefetchTemplates={setRefetchTemplates}
                  title={titles[noteId]}
                />
              );
            })}
          </div>
        )}
        <div className={css(styles.sidebarButtonsContainer)}>
          <div
            className={css(styles.sidebarButton)}
            onClick={() => setIsNoteTemplateModalOpen(true)}
          >
            {icons.shapes}
            <span className={css(styles.sidebarButtonText)}>
              Templates
            </span>
          </div>
          <div className={css(styles.sidebarButton)}>
            {icons.fileImport}
            <span className={css(styles.sidebarButtonText)}>
              Import
            </span>
          </div>
        </div>
        <div
          className={css(styles.sidebarNewNote)}
          onClick={handleCreateNote}
        >
          <div className={css(styles.actionButton)}>{icons.plus}</div>
          <div className={css(styles.newNoteText)}>Create New Note</div>
        </div>
      </div>
      <div className={css(styles.editorContainer)}>
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
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  editorContainer: {
    marginLeft: "max(min(16%, 300px), 240px)",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
  },
  editor: {
    height: "100%",
  },
  hideEditor: {
    display: "none",
  },
  sidebar: {
    background: "#f9f9fc",
    borderRight: `1px solid ${colors.GREY(0.3)}`,
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 80px)",
    left: 0,
    maxWidth: 300,
    minWidth: 240,
    position: "fixed",
    top: 80,
    width: "16%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  popoverTarget: {
    alignItems: "center",
    color: colors.BLACK(0.6),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 1.2,
    padding: 20,
    textTransform: "uppercase",
    userSelect: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  popoverBodyContent: {
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    width: 270,
  },
  popoverBodyItem: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    padding: 16,
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.2),
    },
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  popoverBodyItemImage: {
    borderRadius: "50%",
    height: 30,
    marginRight: 10,
    objectFit: "cover",
    width: 30,
  },
  popoverBodyItemText: {
    display: "flex",
    flexDirection: "column",
  },
  popoverBodyItemTitle: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  popoverBodyItemSubtitle: {
    color: colors.BLACK(0.5),
    fontSize: 13,
    marginTop: 2,
  },
  sidebarSection: {
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
    padding: 20,
    userSelect: "none",
  },
  sidebarNewNote: {
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLUE(),
    cursor: "pointer",
    display: "flex",
    marginTop: "auto",
    padding: 20,
    ":hover": {
      color: "#3E43E8",
    },
  },
  newNoteText: {
    fontSize: 18,
    fontWeight: 500,
    margin: "auto",
  },
  actionButton: {
    alignItems: "center",
    background: colors.LIGHT_GREY(),
    border: "1px solid #ddd",
    borderRadius: "50%",
    display: "flex",
    fontSize: 16,
    height: 35,
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
    transition: "all ease-in-out 0.1s",
    width: 35,
  },
  showBottomBorder: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  sidebarButtonsContainer: {
    margin: 10,
  },
  sidebarButton: {
    border: "none",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    maxWidth: "fit-content",
    padding: 10,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  sidebarButtonText: {
    marginLeft: 10,
  },
  sortIcon: {
    marginLeft: 10,
  },
  chevronIcon: {
    marginLeft: "auto",
  },
  presenceListContainer: {
    background: "#fff",
  },
  presenceList: {
    marginLeft: 10,
    marginTop: 5,
  },
});