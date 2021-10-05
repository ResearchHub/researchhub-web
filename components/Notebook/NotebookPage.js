import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import { connect } from "react-redux";
import { fetchUserOrgs, fetchOrgNotes } from "~/config/fetch";
import Loader from "~/components/Loader/Loader";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import OrgSidebar from "~/components/Org/OrgSidebar";

/*
* TODO:
* Handle 404, 500s
*/

const NotebookPage = ({ user }) => {
  const router = useRouter();
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [currentNoteId, setCurrentNoteId] = useState(router.query.id);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needNoteFetch, setNeedNoteFetch] = useState(false);
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState({});

  useEffect(async () => {
    if (user?.id) {
      const userOrgs = await fetchUserOrgs({ user });
      const currOrg = await getCurrentOrgFromRouter(userOrgs);

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

  const onNoteCreate = (note) => {
    setNeedNoteFetch(true);
    setTitles({
      [note.id.toString()]: note.title,
      ...titles
    });
    router.push(`/notebook/${currentOrganization.slug}/${note.id}`);
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
              user={user}
              orgs={organizations}
              currentOrg={currentOrganization}
              currentNoteId={currentNoteId}
              isPrivateNotebook={false}
              setCurrentOrg={setCurrentOrganization}
              notes={notes}
              titles={titles}
              onNoteCreate={onNoteCreate}
              needNoteFetch={needNoteFetch}
              setNeedNoteFetch={setNeedNoteFetch}
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

export default connect(mapStateToProps)(NotebookPage);
