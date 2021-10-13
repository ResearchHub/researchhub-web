import dynamic from "next/dynamic";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment, useCallback, useRef } from "react";
import {
  fetchUserOrgs,
  fetchNotePermissions,
  fetchOrgNotes,
  fetchNote,
} from "~/config/fetch";
import { getNotePathname } from "~/config/utils/org";
import ReactPlaceholder from "react-placeholder/lib";
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";
import Loader from "~/components/Loader/Loader";
import NotebookSidebar from "~/components/Notebook/NotebookSidebar";
import colors from "~/config/themes/colors";
import { getUserNoteAccess } from "./utils/notePermissions";
import Error from "next/error";
import { Helpers } from "@quantfive/js-web-config";

const ELNEditor = dynamic(() => import("~/components/CKEditor/ELNEditor"), {
  ssr: false,
});

const Notebook = ({ user }) => {
  const router = useRouter();
  const { orgSlug, noteId } = router.query;

  const [currentNote, setCurrentNote] = useState(null);
  const [currentNotePerms, setCurrentNotePerms] = useState(null);
  const [userNoteAccess, setUserNoteAccess] = useState(null);
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState({});
  const [needNoteFetch, setNeedNoteFetch] = useState(false);
  const [needNotePermsFetch, setNeedNotePermsFetch] = useState(false);
  const [didInitialNotesLoad, setDidInitialNotesLoad] = useState(false);

  const [currentOrgSlug, setCurrentOrgSlug] = useState(orgSlug);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  const [isCollaborativeReady, setIsCollaborativeReady] = useState(false);
  const [isPrivateNotebook, setIsPrivateNotebook] = useState(orgSlug === "me");
  const [readOnlyEditorInstance, setReadOnlyEditorInstance] = useState(null);
  const [refetchTemplates, setRefetchTemplates] = useState(false);
  const [error, setError] = useState(null);
  const orgsFetched = useRef();

  useEffect(() => {
    const _fetchUserOrgs = async () => {
      const userOrgs = await fetchUserOrgs({ user });
      const currOrg = getCurrentOrgFromRouter(userOrgs);

      setOrganizations(userOrgs);
      setCurrentOrganization(currOrg);
      setNeedNoteFetch(true);
      orgsFetched.current = true;
    };

    if (user?.id && !orgsFetched.current) {
      _fetchUserOrgs();
    }
  }, [user]);

  useEffect(() => {
    const _fetchNotePermissions = async () => {
      let response;
      let perms;

      try {
        response = await fetchNotePermissions({ noteId });

        if (response.ok) {
          perms = await Helpers.parseJSON(response);
          setCurrentNotePerms(perms);

          const access = getUserNoteAccess({
            user,
            userOrgs: [currentNote.organization] || [],
            notePerms: perms,
          });

          setUserNoteAccess(access);
        } else if (response.status === 404) {
          setError({ code: 404 });
        } else {
          setError({ code: 500 });
        }
      } catch (err) {
        console.error("Failed to fetch note permissions", err);
        setError({ code: 500 });
      } finally {
        setNeedNotePermsFetch(false);
      }
    };

    if (noteId && user?.id && needNotePermsFetch) {
      _fetchNotePermissions();
    }
  }, [noteId, needNotePermsFetch, user]);

  useEffect(() => {
    const _fetchNote = async () => {
      let note;
      let response;

      try {
        response = await fetchNote({ noteId });

        if (response.ok) {
          note = await Helpers.parseJSON(response);

          setCurrentNote(note);
          setIsCollaborativeReady(false);
          readOnlyEditorInstance?.setData(note.latest_version?.src ?? "");
          setNeedNotePermsFetch(true);
        } else if (response.status === 404) {
          setError({ code: 404 });
        } else {
          setError({ code: 500 });
        }
      } catch (err) {
        console.error(`Error fetching note ${noteId}`, err);
        setError({ code: 500 });
      }
    };

    _fetchNote();
  }, [noteId]);

  useEffect(() => {
    const _fetchOrgNotes = async () => {
      let response;
      let notes;

      try {
        if (isPrivateNotebook) {
          response = await fetchOrgNotes({ orgSlug: 0 });
          notes = response.results;
        } else {
          response = await fetchOrgNotes({ orgSlug });
          notes = response.results;
        }

        const sortedNotes = notes.sort(
          (a, b) => new Date(b.created_date) - new Date(a.created_date)
        );

        setNotes(sortedNotes);

        const updatedTitles = {};
        for (const note of sortedNotes) {
          updatedTitles[note.id.toString()] = note.title;
        }
        setTitles(updatedTitles);
      } catch (err) {
        console.error("failed to fetch notes", err);
      }

      setDidInitialNotesLoad(true);
      setNeedNoteFetch(false);
    };

    if (needNoteFetch && (currentOrganization || isPrivateNotebook)) {
      _fetchOrgNotes();
    }
  }, [needNoteFetch, currentOrganization]);

  useEffect(() => {
    if (orgSlug !== currentOrgSlug) {
      if (orgSlug === "me") {
        setCurrentOrganization(null);
        setCurrentOrgSlug("me");
        setIsPrivateNotebook(true);
      } else {
        const currentOrg = getCurrentOrgFromRouter(organizations);
        if (!currentOrg) {
          return console.error("Org could not be found in user's orgs");
        }
        setCurrentOrganization(currentOrg);
        setCurrentOrgSlug(orgSlug);
        setIsPrivateNotebook(false);
      }

      setNeedNoteFetch(true);
      setDidInitialNotesLoad(false);
    }
  }, [router.asPath, currentOrganization]);

  const onOrgChange = (updatedOrg, changeType, needNoteFetch = false) => {
    const userOrganizations = organizations;
    if (changeType === "UPDATE") {
      const foundIdx = userOrganizations.findIndex(
        (o) => o.id === updatedOrg.id
      );
      if (foundIdx > -1) {
        userOrganizations[foundIdx] = updatedOrg;

        setCurrentOrganization(updatedOrg);
        setOrganizations(userOrganizations);
        setNeedNoteFetch(needNoteFetch);
      } else {
        console.error("Could not find org in user's orgs");
      }
    } else if (changeType === "CREATE") {
      userOrganizations.push(updatedOrg);
      setOrganizations(userOrganizations);
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

  if (error) {
    return <Error statusCode={error.code} />;
  }

  return (
    <div className={css(styles.container)}>
      {currentNote && (
        <>
          <NotebookSidebar
            didInitialNotesLoad={didInitialNotesLoad}
            currentNoteId={noteId}
            currentOrg={currentOrganization}
            isPrivateNotebook={isPrivateNotebook}
            needNoteFetch={needNoteFetch}
            notes={notes}
            onOrgChange={onOrgChange}
            onNoteCreate={onNoteCreate}
            orgSlug={orgSlug}
            orgs={organizations}
            readOnlyEditorInstance={readOnlyEditorInstance}
            refetchTemplates={refetchTemplates}
            setCurrentNote={setCurrentNote}
            setIsCollaborativeReady={setIsCollaborativeReady}
            setNeedNoteFetch={setNeedNoteFetch}
            setNotes={setNotes}
            setRefetchTemplates={setRefetchTemplates}
            setTitles={setTitles}
            titles={titles}
            user={user}
          />
          <ELNEditor
            currentNote={currentNote}
            currentOrganizationId={currentOrganization?.id}
            currentOrganization={currentOrganization}
            isCollaborativeReady={isCollaborativeReady}
            orgSlug={orgSlug}
            refetchTemplates={refetchTemplates}
            setIsCollaborativeReady={setIsCollaborativeReady}
            setTitles={setTitles}
            titles={titles}
            user={user}
          />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#fff",
    alignItems: "flex-start",
  },
  loaderWrapper: {
    width: 45,
    height: 45,
    margin: "0 auto",
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -12,
    marginTop: -12,
  },
});

export default connect(mapStateToProps)(Notebook);
