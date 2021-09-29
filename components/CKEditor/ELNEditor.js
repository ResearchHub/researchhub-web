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
  const { CKEditor, Editor, CKEditorInspector } = editorRef.current || {};
  const [currentNoteId, setCurrentNoteId] = useState(router.query.noteId);
  const [currentOrganizationId, setCurrentOrganizationId] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);
  const [isNoteTemplateModalOpen, setIsNoteTemplateModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [refetchNotes, setRefetchNotes] = useState(false);
  const [titles, setTitles] = useState({});

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
    router.push(`/notebook/${router.query.orgName}/${router.query.noteId}`);
  }, [router.query.orgName]);

  useEffect(() => {
    setCurrentNoteId(router.query.noteId);
  }, [router.query.noteId]);

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

  const toggleSidebarSection = () => {
    setHideNotes(!hideNotes);
  };

  const handleCreateNewNote = () => {
    const params = {
      organization: currentOrganizationId,
      title: "Untitled",
    };

    fetch(API.NOTE({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((note) => {
        setRefetchNotes(!refetchNotes);
        setTitles({
          [note.id.toString()]: note.title,
          ...titles
        });
        router.push(`/notebook/${router.query.orgName}/${note.id}`);
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
        setIsOpen={setIsNoteTemplateModalOpen}
        user={user}
        refetchNotes={refetchNotes}
        setRefetchNotes={setRefetchNotes}
      />
      <div className={css(styles.presenceList)}>
        <div ref={presenceListElementRef} className="presence"></div>
      </div>
      <div className={css(styles.sidebar)}>
        <div>
          <ResearchHubPopover
            containerStyle={{ marginLeft: "10px", marginTop: "-10px" }}
            isOpen={isPopoverOpen}
            popoverContent={
              <div className={css(styles.popoverBodyContent)}>
                <Link href={`/notebook/personal/200`}>
                  <a className={css(styles.popoverBodyItem)} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    <img className={css(styles.popoverBodyItemImage)} draggable="false" src={user.author_profile.profile_image} />
                    <div className={css(styles.popoverBodyItemTitle)}>Personal Notes</div>
                  </a>
                </Link>
                {organizations.map(org => (
                  <Link href={`/notebook/${org.slug}/200`} key={org.id.toString()}>
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
          onClick={toggleSidebarSection}
        >
          Notes
          <span className={css(styles.chevronIcon)}>
            {hideNotes ? icons.chevronDown : icons.chevronUp}
          </span>
        </div>
        {!hideNotes && (
          <div>
            {notes.map(note => (
              <SidebarSectionContent
                currentNoteId={currentNoteId}
                noteId={note.id.toString()}
                orgName={router.query.orgName}
                title={titles[note.id.toString()]}
              />
            ))}
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
          onClick={handleCreateNewNote}
        >
          <div className={css(styles.actionButton)}>{icons.plus}</div>
          <div className={css(styles.newNoteText)}>Create New Note</div>
        </div>
      </div>
      <div className={css(styles.editorContainer)}>
        {editorLoaded && editors}
      </div>
      <div ref={sidebarElementRef} className="sidebar"></div>
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
  presenceList: {
    display: "none",
    marginBottom: 10,
    marginTop: 10,
  },
});
