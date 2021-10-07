import ELNEditor from "~/components/CKEditor/ELNEditor";
import Loader from "~/components/Loader/Loader";
import NotebookSidebar from "~/components/Notebook/NotebookSidebar";
import colors from "~/config/themes/colors";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { fetchUserOrgs, fetchOrgNotes } from "~/config/fetch";
import { getNotePathname } from "~/config/utils/org";
import { useRouter } from "next/router";
import { useState, useEffect, Fragment } from "react";

const Notebook = ({ user }) => {
  const router = useRouter();
  const [currentOrgSlug, setCurrentOrgSlug] = useState(router.query.orgSlug);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editorInstances, setEditorInstances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needNoteFetch, setNeedNoteFetch] = useState(false);
  const [notes, setNotes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [refetchTemplates, setRefetchTemplates] = useState(false);
  const [titles, setTitles] = useState({});
  const [isPrivateNotebook, setIsPrivateNotebook] = useState(
    router.query.orgSlug === "me"
  );

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
    const _fetchOrgNotes = async () => {
      let response;
      let notes;

      try {
        if (isPrivateNotebook) {
          response = await fetchOrgNotes({ orgId: 0 });
          notes = response;
        } else {
          response = await fetchOrgNotes({ orgId: currentOrganization.id });
          notes = response;
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
    if (router.query.orgSlug !== currentOrgSlug) {
      if (router.query.orgSlug === "me") {
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
        setCurrentOrgSlug(router.query.orgSlug);
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
    const slug = router.query.orgSlug;
    return orgs.find((org) => org.slug === slug);
  };

  return (
    <div className={css(styles.pageWrapper)}>
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
            currentNoteId={router.query.noteId}
            currentOrg={currentOrganization}
            editorInstances={editorInstances}
            isPrivateNotebook={isPrivateNotebook}
            needNoteFetch={needNoteFetch}
            notes={notes}
            onNoteCreate={onNoteCreate}
            onOrgChange={onOrgChange}
            orgs={organizations}
            refetchTemplates={refetchTemplates}
            setEditorInstances={setEditorInstances}
            setNeedNoteFetch={setNeedNoteFetch}
            setNotes={setNotes}
            setRefetchTemplates={setRefetchTemplates}
            titles={titles}
            user={currentUser}
          />
          <ELNEditor
            currentNoteId={router.query.noteId}
            currentOrganizationId={currentOrganization?.id}
            editorInstances={editorInstances}
            notes={notes}
            setEditorInstances={setEditorInstances}
            setTitles={setTitles}
            titles={titles}
            user={currentUser}
          />
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const styles = StyleSheet.create({
  pageWrapper: {
    display: "flex",
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
