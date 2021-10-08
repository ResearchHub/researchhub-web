import dynamic from "next/dynamic";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment, useCallback, useRef } from "react";

import { fetchUserOrgs, fetchOrgNotes, fetchNote } from "~/config/fetch";
import { getNotePathname } from "~/config/utils/org";
import ReactPlaceholder from "react-placeholder/lib";
import HubEntryPlaceholder from "../Placeholders/HubEntryPlaceholder";
import Loader from "~/components/Loader/Loader";
import NotebookSidebar from "~/components/Notebook/NotebookSidebar";
import colors from "~/config/themes/colors";

const ELNEditor = dynamic(() => import("~/components/CKEditor/ELNEditor"), {
  ssr: false,
});

const Notebook = ({ user }) => {
  const router = useRouter();
  const { orgSlug, noteId } = router.query;

  const [createNoteLoading, setCreateNoteLoading] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentOrgSlug, setCurrentOrgSlug] = useState(orgSlug);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [isCollaborativeReady, setIsCollaborativeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrivateNotebook, setIsPrivateNotebook] = useState(orgSlug === "me");
  const [needNoteFetch, setNeedNoteFetch] = useState(false);
  const [notes, setNotes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [readOnlyEditorInstance, setReadOnlyEditorInstance] = useState(null);
  const [refetchTemplates, setRefetchTemplates] = useState(false);
  const [titles, setTitles] = useState({});

  const orgsFetched = useRef();

  useEffect(() => {
    const _fetchUserOrgs = async () => {
      const userOrgs = await fetchUserOrgs({ user });
      const currOrg = getCurrentOrgFromRouter(userOrgs);

      setOrganizations(userOrgs);
      setCurrentOrganization(currOrg);
      setNeedNoteFetch(true);
      setIsLoading(false);
      orgsFetched.current = true;
    };

    if (user?.id && !orgsFetched.current) {
      _fetchUserOrgs();
    }
  }, [user]);

  useEffect(() => {
    const fetchNoteCallback = async () => {
      setIsCollaborativeReady(false);
      const note = await fetchNote({ noteId });
      setCurrentNote(note);
      readOnlyEditorInstance?.setData(note.latest_version?.src ?? "");
    };

    fetchNoteCallback();
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
        setNeedNoteFetch(true);
      } else {
        const currentOrg = getCurrentOrgFromRouter(organizations);
        if (!currentOrg) {
          return console.error("Org could not be found in user's orgs");
        }

        setCurrentOrganization(currentOrg);
        setCurrentOrgSlug(orgSlug);
        setNeedNoteFetch(true);
        setIsPrivateNotebook(false);
      }
    }
  }, [router.asPath, currentOrganization]);

  const onNoteCreate = (note) => {
    const noteId = note.id.toString();
    setNeedNoteFetch(true);
    setTitles({
      [noteId]: note.title,
      ...titles,
    });

    const path = getNotePathname({ noteId, org: currentOrganization });
    router.push(path);
  };

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

  const getCurrentOrgFromRouter = (orgs) => {
    return orgs.find((org) => org.slug === orgSlug);
  };

  const onCreateNote = () => {
    setCurrentNote({});
    setCreateNoteLoading(true);
  };

  const onCreateNoteComplete = () => {
    setCreateNoteLoading(false);
  };

  return (
    <div className={css(styles.container)}>
      <Fragment>
        <NotebookSidebar
          createNoteLoading={createNoteLoading}
          currentNoteId={noteId}
          currentOrg={currentOrganization}
          isPrivateNotebook={isPrivateNotebook}
          needNoteFetch={needNoteFetch}
          notes={notes}
          onCreateNote={onCreateNote}
          onCreateNoteComplete={onCreateNoteComplete}
          onNoteCreate={onNoteCreate}
          onOrgChange={onOrgChange}
          orgs={organizations}
          refetchTemplates={refetchTemplates}
          setNeedNoteFetch={setNeedNoteFetch}
          setNotes={setNotes}
          setRefetchTemplates={setRefetchTemplates}
          titles={titles}
          user={user}
        />
        {currentNote && !isLoading && (
          <ELNEditor
            currentNote={currentNote}
            currentNoteId={noteId}
            currentOrganizationId={currentOrganization?.id}
            isCollaborativeReady={isCollaborativeReady}
            notes={notes}
            orgSlug={orgSlug}
            setIsCollaborativeReady={setIsCollaborativeReady}
            setReadOnlyEditorInstance={setReadOnlyEditorInstance}
            setTitles={setTitles}
            titles={titles}
            user={user}
          />
        )}
      </Fragment>
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
