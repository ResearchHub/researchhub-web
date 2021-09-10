import API from "~/config/api";
import React, { useEffect, useRef, useState } from "react";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";

function useFetchNotes(currentNoteId) {
  const [notes, setNotes] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetch(API.NOTE({}), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        setNotes(data.results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
        if (!fetched) {
          setFetched(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentNoteId]);

  return [fetched, notes];
}

export const ELNEditor = ({ user }) => {
  const router = useRouter();
  const editorRef = useRef();
  const sidebarElementRef = useRef();
  const presenceListElementRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(router.query.noteId);
  const { CKEditor, Editor, CKEditorInspector } = editorRef.current || {};
  const [fetched, notes] = useFetchNotes(currentNoteId);
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
    const updatedTitles = {};
    for (const note of notes) {
      updatedTitles[note.id.toString()] = note.title;
    }
    setTitles(updatedTitles);
  }, [fetched]);

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
          "https://80957.cke-cs.com/token/dev/f7269818e72213ec0c800718cd4aeeed27eaa131ec5f5b60f3339fdeeecc",
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
          onChange={(event, editor) => handleInput(event, editor)}
          onReady={(editor) => {
            console.log("Editor is ready to use!", editor);
            CKEditorInspector.attach(editor);

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

  function saveData(editor, noteId) {
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
  }

  function manualSaveData(data) {
    console.log("manualSaveData: " + data);
  }

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

  const toggleSidebarSection = () => {};

  const handleCreateNewNote = () => {
    const params = {
      title: "Untitled",
    };

    fetch(API.NOTE({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((note) => {
        setCurrentNoteId(note.id.toString());
        router.push(`/notebook/${note.id}`);
      });
  };

  const handleInput = (event, editor) => {
    const updatedTitles = {};
    for (const key in titles) {
      updatedTitles[key] =
        key === currentNoteId
          ? editor.plugins.get("Title").getTitle() || "Untitled"
          : titles[key];
    }
    setTitles(updatedTitles);
  };

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.presenceList)}>
        <div ref={presenceListElementRef} className="presence"></div>
      </div>
      <div className={css(styles.sidebar)}>
        <div className={css(styles.sidebarHeader)}>
          {`${user.first_name} ${user.last_name}'s Notes`}
        </div>
        <div
          className={css(styles.sidebarSection)}
          onClick={toggleSidebarSection}
        >
          Notes
          <span className={css(styles.chevronDown)}>
            {icons.chevronDownLeft}
          </span>
        </div>
        {notes.map((note, index) => (
          <div
            className={css(
              styles.sidebarSectionContent,
              note.id.toString() === currentNoteId && styles.active,
              index === notes.length - 1 && styles.lastSection
            )}
            key={note.id.toString()}
            onClick={() => {
              setCurrentNoteId(note.id.toString());
              router.push(`/notebook/${note.id}`);
            }}
          >
            {titles[note.id.toString()]}
          </div>
        ))}
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
    height: "calc(100vh - 80px)",
    marginLeft: "max(min(16%, 300px), 240px)",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "calc(100vh - 66px)",
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
    borderRight: "1px solid #f0f0f0",
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
  sidebarHeader: {
    color: colors.BLACK(0.6),
    cursor: "default",
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 1.2,
    padding: 20,
    textTransform: "uppercase",
  },
  sidebarSection: {
    borderTop: "1px solid #f0f0f0",
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
    padding: 20,
  },
  sidebarSectionContent: {
    borderTop: "1px solid #f0f0f0",
    color: colors.BLACK(),
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    padding: 20,
    textDecoration: "none",
    ":hover": {
      background: colors.GREY(0.3),
      borderTop: `1px solid transparent`,
    },
  },
  active: {
    background: colors.GREY(0.3),
    borderTop: `1px solid transparent`,
  },
  lastSection: {
    borderBottom: "1px solid #f0f0f0",
  },
  sidebarNewNote: {
    borderTop: "1px solid #f0f0f0",
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
    //":hover": {
    //  background: "#d8d8d8",
    //},
    "@media only screen and (max-width: 415px)": {
      height: 33,
      width: 33,
    },
    "@media only screen and (max-width: 321px)": {
      height: 31,
      width: 31,
    },
  },
  chevronDown: {
    marginLeft: "auto",
  },
  presenceList: {
    display: "none",
    marginBottom: 10,
    marginTop: 10,
  },
});
