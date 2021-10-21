import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {
  fetchUserOrgs,
  fetchNotePermissions,
  fetchOrgNotes,
  fetchNote,
  fetchOrg,
} from "~/config/fetch";
import { getNotePathname } from "~/config/utils/org";
import NotebookSidebar from "~/components/Notebook/NotebookSidebar";
import { getUserNoteAccess } from "./utils/notePermissions";
import { Helpers } from "@quantfive/js-web-config";
import { captureError } from "~/config/utils/error";
import dynamic from "next/dynamic";
import Error from "next/error";
import gateKeepCurrentUser from "~/config/gatekeeper/gateKeepCurrentUser";

const ELNEditor = dynamic(() => import("~/components/CKEditor/ELNEditor"), {
  ssr: false,
});

const Notebook = ({ auth, user }) => {
  const router = useRouter();
  const { orgSlug, noteId } = router.query;

  const [ELNLoading, setELNLoading] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentNotePerms, setCurrentNotePerms] = useState(null);
  const [userNoteAccess, setUserNoteAccess] = useState(null);
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState({});
  const [didInitialNotesLoad, setDidInitialNotesLoad] = useState(false);

  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const orgsFetched = useRef();
  const isPrivateNotebook = orgSlug === "me" ? true : false;

  /* IMPORTANT */
  const _shouldShowELN = gateKeepCurrentUser({
    application: "ELN" /* application */,
    auth,
    shouldRedirect: true /* should redirect */,
  });

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
        userOrgs = await fetchUserOrgs({ user });
        currOrg = getCurrentOrgFromRouter(userOrgs);

        setOrganizations(userOrgs);
        setCurrentOrganization(currOrg);
        orgsFetched.current = true;

        return Promise.resolve();
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch user orgs",
          data: { noteId, orgSlug, userNoteAccess, userId: user.id },
        });
        setError({ statusCode: 500 });

        return Promise.reject();
      }
    };

    if (user?.id && !orgsFetched.current) {
      _fetchAndSetUserOrgs();
    }
  }, [user]);

  useEffect(() => {
    const _fetchAndSetCurrentNote = async () => {
      let note;
      let response;

      if (noteId) {
        try {
          response = await fetchNote({ noteId });

          if (response.ok) {
            note = await Helpers.parseJSON(response);
            setCurrentNote(note);
          } else {
            captureError({
              statusCode: response.status,
              msg: "could not fetch note",
              data: { noteId, orgSlug, userId: user?.id },
            });
            setError({ statusCode: response.status });
          }
        } catch (error) {
          console.log(error);
          captureError({
            statusCode: 500,
            msg: "Failed to fetch note",
            data: { noteId, orgSlug, userId: user?.id },
          });
          setError({ statusCode: 500 });
        }
      }
    };

    const _fetchAndSetCurrentNotePermissions = async () => {
      let response;
      let perms;

      if (noteId) {
        try {
          response = await fetchNotePermissions({ noteId });

          if (response.ok) {
            perms = await Helpers.parseJSON(response);
            setCurrentNotePerms({ forNote: noteId, perms });
          } else {
            captureError({
              msg: "Could not fetch note permissions",
              data: { noteId, orgSlug, userId: user?.id },
            });
            setError({ statusCode: response.status });
          }
        } catch (error) {
          captureError({
            error,
            msg: "Failed to fetch note permissions",
            data: { noteId, orgSlug, userId: user?.id },
          });
          setError({ statusCode: 500 });
        }
      }
    };

    setCurrentNote(null);
    setELNLoading(true);
    _fetchAndSetCurrentNote();
    _fetchAndSetCurrentNotePermissions();
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
        notePerms: currentNotePerms.perms,
      });

      setUserNoteAccess(access);
    }
  }, [currentNote, currentNotePerms, user]);

  useEffect(() => {
    const _fetchAndSetCurrentOrgNotes = async () => {
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
          captureError({
            error,
            msg: "Failed to fetch notes",
            data: { noteId, orgSlug, isPrivateNotebook, userId: user.id },
          });
        }
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch notes",
          data: { noteId, orgSlug, isPrivateNotebook, userId: user.id },
        });
        setError({ statusCode: 500 });
      } finally {
        setDidInitialNotesLoad(true);
      }
    };

    if (orgSlug !== currentOrganization?.slug) {
      const currentOrg = getCurrentOrgFromRouter(organizations);
      if (currentOrg) {
        setCurrentOrganization(currentOrg);
        _fetchAndSetCurrentOrgNotes();
        setDidInitialNotesLoad(false);
      }
    }
  }, [orgSlug, currentOrganization, organizations]);

  const fetchAndSetOrg = async ({ orgId }) => {
    try {
      const org = await fetchOrg({ orgId });
      updateUserOrgsLocalCache(org);

      if (orgId === currentOrganization?.id) {
        setCurrentOrganization(org);
      }
    } catch (error) {
      captureError({
        msg: "failed to fetch org",
        data: { noteId, orgSlug, orgId, isPrivateNotebook, userId: user.id },
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

  const onNoteDelete = (deletedNote) => {
    const newNotes = notes.filter((note) => note.id !== deletedNote.id);
    setNotes(newNotes);
    if (String(deletedNote.id) === noteId) {
      router.push(
        getNotePathname({ noteId: newNotes[0]?.id, org: currentOrganization })
      );
    }
  };

  const onNoteCreate = (note) => {
    setNotes([note, ...notes]);
    setTitles({
      [note.id]: note.title,
      ...titles,
    });
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
          ? editor.plugins.get("Title").getTitle().replace(/&nbsp;/g, ' ') || "Untitled"
          : titles[noteId];
    }
    setTitles(updatedTitles);
  };

  if (error) {
    return <Error {...error} />;
  }

  return (
    <div className={css(styles.container)}>
      <NotebookSidebar
        currentNoteId={noteId}
        currentOrg={currentOrganization}
        didInitialNotesLoad={didInitialNotesLoad}
        handleOrgSwitch={fetchAndSetOrg}
        isPrivateNotebook={isPrivateNotebook}
        notes={notes}
        onNoteCreate={onNoteCreate}
        onNoteDelete={onNoteDelete}
        onOrgChange={onOrgChange}
        orgSlug={orgSlug}
        orgs={organizations}
        setTitles={setTitles}
        titles={titles}
        user={user}
      />
      {currentNote && (
        <ELNEditor
          ELNLoading={ELNLoading}
          currentNote={currentNote}
          handleEditorInput={handleEditorInput}
          orgSlug={orgSlug}
          setELNLoading={setELNLoading}
        />
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
});

export default connect(mapStateToProps)(Notebook);
