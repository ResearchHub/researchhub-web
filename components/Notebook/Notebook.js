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
  fetchOrg,
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
import { captureError } from "~/config/utils/error";
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
      let userOrgs;
      let currOrg;
      try {
        userOrgs = await fetchUserOrgs({ user });
        currOrg = getCurrentOrgFromRouter(userOrgs);

        setOrganizations(userOrgs);
        setCurrentOrganization(currOrg);
        setNeedNoteFetch(true);
        orgsFetched.current = true;
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch user orgs",
          data: { noteId, orgSlug, userNoteAccess, userId: user.id },
        });
        setError({ statusCode: 500 });
      }
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
        } else {
          captureError({
            msg: "Failed to fetch note permissions",
            data: { noteId, orgSlug, userNoteAccess, userId: user.id },
          });
          setError({ statusCode: response.status });
        }
      } catch (error) {
        captureError({
          msg: "Failed to fetch note permissions",
          data: { noteId, orgSlug, userNoteAccess, userId: user.id },
        });
        setError({ statusCode: 500 });
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
        } else {
          captureError({
            statusCode: response.status,
            msg: "could not fetch note",
            data: { noteId, orgSlug, userId: user.id },
          });
          setError({ statusCode: response.status });
        }
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch note",
          data: { noteId, orgSlug, userId: user.id },
        });
        setError({ statusCode: 500 });
      }
    };

    _fetchNote();
  }, [noteId]);

  useEffect(() => {
    const _fetchOrgNotes = async () => {
      let response;
      let notes;

      try {
        const response = await fetchOrgNotes({
          orgSlug: isPrivateNotebook ? 0 : orgSlug,
        });
        const parsed = await Helpers.parseJSON(response);
        if (response.ok) {
          notes = parsed.results;
        } else {
          setError({ statusCode: response.status });
          captureError({
            error,
            msg: "Failed to fetch notes",
            data: { noteId, orgSlug, isPrivateNotebook, userId: user.id },
          });
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
      } catch (error) {
        captureError({
          error,
          msg: "Failed to fetch notes",
          data: { noteId, orgSlug, isPrivateNotebook, userId: user.id },
        });
        setError({ statusCode: 500 });
      } finally {
        setDidInitialNotesLoad(true);
        setNeedNoteFetch(false);
      }
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
          return captureError({
            msg: "Could not find org in user's orgs",
            data: {
              noteId,
              orgSlug,
              currentOrg,
              isPrivateNotebook,
              userId: user.id,
            },
          });
        }

        setCurrentOrganization(currentOrg);
        setCurrentOrgSlug(orgSlug);
        setIsPrivateNotebook(false);
      }

      setNeedNoteFetch(true);
      setDidInitialNotesLoad(false);
    }
  }, [router.asPath, currentOrganization]);

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
      setNeedNoteFetch(needNoteFetch);
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
    return <Error {...error} />;
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
            fetchAndSetOrg={fetchAndSetOrg}
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
