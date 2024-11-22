import Error from "next/error";
import NotebookSidebar from "~/components/Notebook/NotebookSidebar";
import dynamic from "next/dynamic";
import withWebSocket from "~/components/withWebSocket";
import { Helpers } from "@quantfive/js-web-config";
import { NOTE_GROUPS } from "~/components/Notebook/config/notebookConstants";
import { captureEvent } from "~/config/utils/events";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import {
  fetchNote,
  fetchNotePermissions,
  fetchOrg,
  fetchOrgNotes,
  fetchOrgTemplates,
  fetchUserOrgs,
} from "~/config/fetch";
import { getNotePathname, isOrgMember } from "~/components/Org/utils/orgHelper";
import { getUserNoteAccess } from "~/components/Notebook/utils/notePermissions";
import { emptyFncWithMsg, isNullOrUndefined } from "~/config/utils/nullchecks";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import CommentEditor from "../Comment/CommentEditor";
import NoteTypeSelector, { NOTE_TYPE } from "./lib/NoteTypeSelector";

const Notebook = ({ auth, user, wsResponse }) => {
  const router = useRouter();
  const { orgSlug, noteId } = router.query;

  const [currentNote, setCurrentNote] = useState(null);
  const [currentNotePerms, setCurrentNotePerms] = useState(null);
  const [userNoteAccess, setUserNoteAccess] = useState(null);
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState({});
  const [templates, setTemplates] = useState([]);
  const [didInitialNotesLoad, setDidInitialNotesLoad] = useState(false);

  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const orgsFetched = useRef();

  const [noteType, setNoteType] = useState(NOTE_TYPE.POST);

  useEffect(() => {
    // If user just logged in, refresh the page
    const userLoggedInNow =
      auth.authChecked && isLoggedIn === false && auth.isLoggedIn;
    const userIsLoggedOut = auth.authChecked && !auth.isLoggedIn;

    if (userLoggedInNow) {
      setTimeout(() => {
        window.location.reload();
      }, 2500); /* Arbitrary time to allow auth to be settled. Lower value may result in user being logged out. */
    } else if (userIsLoggedOut) {
      setError({ statusCode: 403 });
      setIsLoggedIn(false);
    }
  }, [auth]);

  useEffect(() => {
    const _fetchAndSetUserOrgs = async () => {
      let userOrgs;
      let currOrg;

      try {
        userOrgs = await fetchUserOrgs({
          user,
          route: "get_user_organizations",
        });
        currOrg = getCurrentOrgFromRouter(userOrgs);

        setCurrentOrganization(currOrg);
        setOrganizations(userOrgs);
        orgsFetched.current = true;
      } catch (error) {
        captureEvent({
          error,
          msg: "Failed to fetch user orgs",
          data: { noteId, orgSlug, userNoteAccess, userId: user.id },
        });
        setError({ statusCode: 500 });
      }
    };

    if (user?.id && !orgsFetched.current) {
      _fetchAndSetUserOrgs();
    }
  }, [user]);

  useEffect(() => {
    setCurrentNote(null);
    fetchAndSetCurrentNote();
    fetchAndSetCurrentNotePermissions();
  }, [noteId]);

  useEffect(() => {
    const shouldCalcUserAccess =
      user?.id &&
      currentNote &&
      parseInt(currentNotePerms?.forNote) === parseInt(currentNote?.id);
    if (shouldCalcUserAccess) {
      const access = getUserNoteAccess({
        user,
        userOrgs: [currentNote.organization] || [],
        notePerms: currentNotePerms.list,
      });

      setUserNoteAccess(access);
    }
  }, [currentNote, currentNotePerms, user]);

  useEffect(() => {
    if (orgSlug !== currentOrganization?.slug) {
      const newOrg = getCurrentOrgFromRouter(organizations);
      setCurrentOrganization(newOrg);
      fetchAndSetCurrentOrgNotes();
      fetchAndSetOrgTemplates();
      setDidInitialNotesLoad(false);
    }
  }, [orgSlug, currentOrganization]);

  const fetchAndSetOrgTemplates = useCallback(async () => {
    const templates = await fetchOrgTemplates(orgSlug);
    setTemplates(templates);
  }, [orgSlug]);

  const noteCreated = () => {
    fetchAndSetCurrentOrgNotes();
  };

  const fetchAndSetCurrentOrgNotes = useCallback(async () => {
    let response;
    let notes;

    try {
      const response = await fetchOrgNotes({
        orgSlug,
      });
      const parsed = await Helpers.parseJSON(response);

      if (response.ok) {
        notes = parsed.results;

        const sortedNotes = notes.sort(
          (a, b) => new Date(b.created_date) - new Date(a.created_date)
        );

        const updatedTitles = {};
        for (const note of sortedNotes) {
          updatedTitles[note.id.toString()] = note.title;
        }

        setNotes(sortedNotes);
        setTitles(updatedTitles);
      } else {
        setError({ statusCode: response.status });
        captureEvent({
          error,
          msg: "Failed to fetch notes",
          data: { orgSlug, userId: user.id },
        });
      }
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch notes",
        data: { orgSlug, userId: user.id },
      });
      setError({ statusCode: 500 });
    } finally {
      setDidInitialNotesLoad(true);
    }
  }, [orgSlug]);

  const fetchAndSetCurrentNotePermissions = useCallback(async () => {
    let response;
    let perms;

    if (noteId) {
      try {
        response = await fetchNotePermissions({ noteId });

        if (response.ok) {
          perms = await Helpers.parseJSON(response);
          setCurrentNotePerms({ forNote: noteId, list: perms });
        } else {
          captureEvent({
            msg: "Could not fetch note permissions",
            data: { noteId, userId: user?.id },
          });
          setError({ statusCode: response.status });
        }
      } catch (error) {
        captureEvent({
          error,
          msg: "Failed to fetch note permissions",
          data: { noteId, userId: user?.id },
        });
        setError({ statusCode: 500 });
      }
    }
  }, [noteId, user]);

  const fetchAndSetCurrentNote = useCallback(async () => {
    let note;
    let response;

    if (noteId) {
      try {
        response = await fetchNote({ noteId });

        if (response.ok) {
          note = await Helpers.parseJSON(response);
          setCurrentNote(note);
        } else {
          captureEvent({
            statusCode: response.status,
            msg: "could not fetch note",
            data: { noteId, orgSlug, userId: user?.id },
          });
          setError({ statusCode: response.status });
        }
      } catch (error) {
        emptyFncWithMsg(error);
        captureEvent({
          statusCode: 500,
          msg: "Failed to fetch note",
          data: { noteId, orgSlug, userId: user?.id },
        });
        setError({ statusCode: 500 });
      }
    }
  }, [noteId, orgSlug, user]);

  useEffect(() => {
    if (!isNullOrUndefined(wsResponse)) {
      const {
        data: note,
        type: responseType,
        requester,
      } = JSON.parse(wsResponse);

      switch (responseType) {
        case "create":
          if (
            note.created_by === user.id ||
            note.access === NOTE_GROUPS.WORKSPACE
          ) {
            setNotes([note, ...notes]);
            setTitles({
              [note.id]: note.title,
              ...titles,
            });
          }
          break;
        case "delete":
          const deletedNoteId = note.id;
          const newNotes = notes.filter((note) => note.id !== deletedNoteId);
          setNotes(newNotes);
          if (String(deletedNoteId) === noteId) {
            router.push(
              getNotePathname({
                noteId: newNotes[0]?.id,
                org: currentOrganization,
              })
            );
          }
          break;
        case "update_title":
          if (note.id !== currentNote?.id) {
            const updatedTitles = {};
            for (const noteId in titles) {
              updatedTitles[noteId] =
                String(noteId) === String(note.id)
                  ? note.title
                  : titles[noteId];
            }
            setTitles(updatedTitles);
          }
          break;
        case "update_permission":
          if (
            String(note.id) === noteId &&
            note.access === NOTE_GROUPS.PRIVATE &&
            requester !== user.id
          ) {
            const permissionChangedNoteId = note.id;
            const newNotes = notes.filter(
              (note) => note.id !== permissionChangedNoteId
            );
            router.push(
              getNotePathname({
                noteId: newNotes[0]?.id,
                org: currentOrganization,
              })
            );
          } else {
            fetchAndSetCurrentNote();
          }
          fetchAndSetCurrentOrgNotes();
          break;
      }
    }
  }, [wsResponse]);

  const fetchAndSetOrg = async ({ orgId }) => {
    try {
      const org = await fetchOrg({ orgId });
      updateUserOrgsLocalCache(org);

      if (orgId === currentOrganization?.id) {
        setCurrentOrganization(org);
      }
    } catch (error) {
      captureEvent({
        msg: "failed to fetch org",
        data: { noteId, orgSlug, orgId, userId: user.id },
      });
      setError({ statusCode: 500 });
    }
  };

  const updateUserOrgsLocalCache = (updatedOrg) => {
    const userOrganizations = organizations;
    const foundIdx = userOrganizations.findIndex((o) => o.id === updatedOrg.id);

    if (foundIdx > -1) {
      userOrganizations[foundIdx] = updatedOrg;
      setOrganizations(userOrganizations);
    } else {
      console.error("Could not find org in user's orgs");
    }
  };

  const onOrgChange = (updatedOrg, changeType, needNoteFetch = false) => {
    const userOrganizations = organizations;
    if (changeType === "UPDATE") {
      updateUserOrgsLocalCache(updatedOrg);
      setCurrentOrganization(updatedOrg);
    } else if (changeType === "CREATE") {
      userOrganizations.push(updatedOrg);
      setOrganizations(userOrganizations);
    }
  };

  const redirectToNote = (note) => {
    const path = getNotePathname({
      noteId: note.id,
      org: currentOrganization,
    });
    router.push(path);
  };

  const getCurrentOrgFromRouter = (orgs) => {
    return orgs.find((org) => org.slug === orgSlug);
  };

  const handleEditorInput = (editor) => {
    const updatedTitles = {};
    for (const noteId in titles) {
      updatedTitles[noteId] =
        String(noteId) === String(currentNote.id)
          ? editor.plugins
              .get("Title")
              .getTitle()
              .replace(/&nbsp;/g, " ") || "Untitled"
          : titles[noteId];
    }
    setTitles(updatedTitles);
  };

  if (error) {
    return <Error {...error} />;
  }

  const _isOrgMember = isOrgMember({ user, org: currentOrganization });
  return (
    <div className={css(styles.container)}>
      <NotebookSidebar
        currentNoteId={noteId}
        currentOrg={currentOrganization}
        didInitialNotesLoad={didInitialNotesLoad}
        fetchAndSetOrg={fetchAndSetOrg}
        isOrgMember={_isOrgMember}
        notes={notes}
        onOrgChange={onOrgChange}
        orgSlug={orgSlug}
        noteCreated={noteCreated}
        orgs={organizations}
        redirectToNote={redirectToNote}
        refetchTemplates={fetchAndSetOrgTemplates}
        setTemplates={setTemplates}
        templates={templates}
        titles={titles}
      />
      {currentNote && (
        <div className={css(styles.editorContainer)}>
          <div className={css(styles.editorHeader)}>
            <NoteTypeSelector selectedType={noteType} onChange={setNoteType} />
          </div>
          <CommentEditor
            editorId={`notebook-${currentNote.id}`}
            content={currentNote.content}
            displayCurrentUser={false}
            isBig
            handleSubmit={async (updatedContent) => {
              // Implement your note update logic here
              // This should match the format expected by your API
            }}
            placeholder="Start writing your note..."
            allowCommentTypeSelection={false}
            allowPrivacySelection={false}
            author={user}
            showAuthorLine={true}
            editorStyleOverride={styles.editorOverride}
            // You may need to implement these handlers based on your requirements
            onChange={(content) => {
              // Handle content changes
            }}
            handleCancel={() => {
              // Handle cancel action if needed
            }}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  editorOverride: {
    flex: 1,
    margin: 20,
    border: "none",
    // Add any additional styling needed to match your design
  },
  editorContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  editorHeader: {
    padding: 20,
    maxWidth: 200,
  },
});

export default connect(mapStateToProps)(withWebSocket(Notebook));
