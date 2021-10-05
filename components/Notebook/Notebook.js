import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { connect } from "react-redux";
import { fetchUserOrgs, fetchOrgNotes } from "~/config/fetch";
import Loader from "~/components/Loader/Loader";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import OrgSidebar from "~/components/Org/OrgSidebar";
import ELNEditor from "~/components/CKEditor/ELNEditor";
import { getNotePathname } from '~/config/utils/org';

/*
* TODO:
* Handle 404, 500s
*/

const Notebook = ({ user, isPrivateNotebook }) => {
  const router = useRouter();
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [currentNoteId, setCurrentNoteId] = useState(router.query.noteId);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needNoteFetch, setNeedNoteFetch] = useState(false);
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(async () => {
    if (user?.id && !currentUser) {
      const userOrgs = await fetchUserOrgs({ user });
      const currOrg = await getCurrentOrgFromRouter(userOrgs);

      setCurrentUser(user);
      setOrganizations(userOrgs);
      setCurrentOrganization(currOrg);
      setNeedNoteFetch(true);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(async () => {
    if (needNoteFetch && currentOrganization) {
      const response = await fetchOrgNotes({ orgId: currentOrganization.id });
      const sortedNotes = response.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setNotes(sortedNotes);

      const updatedTitles = {};
      for (const note of sortedNotes) {
        updatedTitles[note.id.toString()] = note.title;
      }
      setTitles(updatedTitles);      
      setNeedNoteFetch(false);
    }
  }, [needNoteFetch, currentOrganization])

  useEffect(() => {
    const orgChanged = currentOrganization && router.query.orgSlug && router.query.orgSlug !== currentOrganization.slug
    if (orgChanged) {
      const currentOrg = getCurrentOrgFromRouter(organizations);
      if (!currentOrg) {
        return console.error("Org could not be found in user's orgs");
      }

      setCurrentOrganization(currentOrg);
      setNeedNoteFetch(true);
    }
  }, [router.asPath, currentOrganization])

  useEffect(() => {
    if (router.query.noteId !== currentNoteId) {
      setCurrentNoteId(router.query.noteId);
    }
  }, [router.query.noteId]);

  const onNoteCreate = (note) => {
    setNeedNoteFetch(true);
    setTitles({
      [note.id.toString()]: note.title,
      ...titles
    });

    const path = getNotePathname({ note, org: currentOrganization });
    router.push(path);
  }

  const onOrgChange = (org, needNoteFetch = false) => {
    setCurrentOrganization(org);
    setNeedNoteFetch(needNoteFetch);
  }

  const getCurrentOrgFromRouter = (orgs) => {
    const slug = router.query.orgSlug;
    return orgs.find(org => org.slug === slug);
  };  

  return (
    <div className={css(styles.pageWrapper)}>
      {isLoading
        ? (
          <div className={css(styles.loaderWrapper)}>
            <Loader
              key={"loader"}
              loading={true}
              size={35}
              color={colors.BLUE()}
            />
          </div>
        )
        : (
          <Fragment>
            <OrgSidebar
              user={currentUser}
              orgs={organizations}
              currentOrg={currentOrganization}
              currentNoteId={currentNoteId}
              isPrivateNotebook={isPrivateNotebook}
              notes={notes}
              titles={titles}
              onOrgChange={onOrgChange}
              onNoteCreate={onNoteCreate}
              needNoteFetch={needNoteFetch}
              setNeedNoteFetch={setNeedNoteFetch}
            />
            <ELNEditor
              user={currentUser}
              notes={notes}
              titles={titles}
              setTitles={setTitles}
              currentNoteId={currentNoteId}
            />
          </Fragment>
        )
      }
    </div>  
  )   

  return null;
}

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
    marginLeft:-12,
    marginTop:-12,
  }
});

export default connect(mapStateToProps)(Notebook);
