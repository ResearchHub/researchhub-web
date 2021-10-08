import Loader from "~/components/Loader/Loader";
import NotebookSidebar from "~/components/Notebook/NotebookSidebar";
import colors from "~/config/themes/colors";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { fetchUserOrgs, fetchOrgNotes, fetchNote } from "~/config/fetch";
import { getNotePathname } from "~/config/utils/org";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const ELNEditor = dynamic(() => import("~/components/CKEditor/ELNEditor"), {
  ssr: false,
});

const Notebook = ({ user }) => {
  const router = useRouter();
  const { orgSlug, noteId } = router.query;

  const [currentOrgSlug, setCurrentOrgSlug] = useState(orgSlug);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needNoteFetch, setNeedNoteFetch] = useState(false);
  const [notes, setNotes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [refetchTemplates, setRefetchTemplates] = useState(false);
  const [titles, setTitles] = useState({});
  const [isPrivateNotebook, setIsPrivateNotebook] = useState(orgSlug === "me");
  const [currentNote, setCurrentNote] = useState(null);
  const [createNoteLoading, setCreateNoteLoading] = useState(false);
  const [disableELN, setDisableELN] = useState(false);
  const [disableELNSwap, setDisableELNSwap] = useState(false);
  const [noteLoading, setNoteLoading] = useState(true);

  useEffect(() => {
    const _fetchUserOrgs = async () => {
      const userOrgs = await fetchUserOrgs({ user });
      const currOrg = getCurrentOrgFromRouter(userOrgs);

      setCurrentUser(user);
      setOrganizations(userOrgs);
      setCurrentOrganization(currOrg);
      setNeedNoteFetch(true);
      setIsLoading(false);
    };

    if (user?.id && !currentUser) {
      _fetchUserOrgs();
    }
  }, [user]);

  useEffect(() => {
    const fetchNoteCallback = async () => {
      const note = await fetchNote({ noteId });
      setCurrentNote(note);
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

  useEffect(() => {
    if (disableELNSwap) {
      setDisableELNSwap(false);
    }
  }, [disableELNSwap]);

  useEffect(() => {
    const fetchNoteCallback = async () => {
      setDisableELN(true);
      const note = await fetchNote({ noteId });
      setDisableELN(false);
      setCurrentNote(note);
    };

    fetchNoteCallback();
  }, [noteId]);

  const switchNote = () => {
    setNoteLoading(true);
    setDisableELNSwap(true);
  };

  const setELNReady = () => {
    setNoteLoading(false);
    setCreateNoteLoading(false);
  };

  const onCreateNote = () => {
    setCurrentNote({});
    setDisableELN(true);
    setCreateNoteLoading(true);
  };

  const onCreateNoteComplete = () => {
    setDisableELN(false);
  };

  return (
    <div className={css(styles.container)}>
      {isLoading ? (
        <div className={css(styles.loaderWrapper)}>
          <Loader
            key={"loader"}
            loading={true}
            size={35}
            color={colors.BLUE()}
          />
        </div>
      ) : (
        <Fragment>
          <NotebookSidebar
            currentNoteId={noteId}
            currentOrg={currentOrganization}
            isPrivateNotebook={isPrivateNotebook}
            needNoteFetch={needNoteFetch}
            notes={notes}
            onNoteCreate={onNoteCreate}
            onOrgChange={onOrgChange}
            orgs={organizations}
            refetchTemplates={refetchTemplates}
            setNeedNoteFetch={setNeedNoteFetch}
            setNotes={setNotes}
            setRefetchTemplates={setRefetchTemplates}
            titles={titles}
            user={currentUser}
            onCreateNote={onCreateNote}
            createNoteLoading={createNoteLoading}
            onCreateNoteComplete={onCreateNoteComplete}
            onNoteClick={switchNote}
          />
          {currentNote && (
            <ELNEditor
              currentNoteId={noteId}
              currentOrganizationId={currentOrganization?.id}
              notes={notes}
              setTitles={setTitles}
              titles={titles}
              user={currentUser}
              currentNote={currentNote}
              onReady={setELNReady}
              disableELN={disableELN || disableELNSwap}
              noteLoading={noteLoading}
            />
          )}
        </Fragment>
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
