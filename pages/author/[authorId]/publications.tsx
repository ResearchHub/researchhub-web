import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchAuthorPublications, parsePublicationResponse } from "~/components/Author/lib/api";
import { parseFullAuthorProfile } from "~/components/Author/lib/types";
import { css, StyleSheet } from "aphrodite";
import AuthorProfileHeader from "~/components/Author/Profile/AuthorProfileHeader";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector } from "react-redux";
import AuthorPublications from "~/components/Author/Profile/AuthorPublications";
import { AuthorProfileContextProvider, authorProfileContext } from "~/components/Author/lib/AuthorProfileContext";
import AuthorNavigation from "~/components/Author/Profile/AuthorNavigation";
import VerifyPublicationsSection from "~/components/Author/Profile/VerifyPublicationsSection";
import { ClipLoader } from "react-spinners";
import colors from "~/config/themes/colors";


type Args = {
  profile: any;
  publicationsResponse: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, publicationsResponse }) => {

  if (!profile || !publicationsResponse) {
    // TODO: Need a skeleton loading state
    return (
      <div style={{
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "height": "100%",
        "width": "100%",
      }}>
        <ClipLoader color={colors.NEW_BLUE()} loading={true} size={55} />
      </div>
    )
  }

  const fullAuthorProfile = parseFullAuthorProfile(profile);
  const parsedPublicationsResponse = parsePublicationResponse(publicationsResponse);
  const auth = useSelector((state: any) => state.auth);

  
  return (
    <AuthorProfileContextProvider fullAuthorProfile={fullAuthorProfile}>
      <div className={css(styles.profilePage)}>
        <div className={css(styles.profileContent)}>
          <AuthorProfileHeader />
        </div>            
        <AuthorNavigation />
        <div className={css(styles.mainContentWrapper)}>
          <div className={css(styles.mainContent)}>
            <div className={css(styles.addPublicationsWrapper)}>
              <VerifyPublicationsSection />
            </div>
            {/* @ts-ignore */}
            <AuthorPublications
              // @ts-ignore legacy
              wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
              // @ts-ignore legacy
              wsAuth
              initialPaginatedPublicationsResponse={parsedPublicationsResponse}
            />
          </div>
        </div>
      </div>
    </AuthorProfileContextProvider>
  );
};

const styles = StyleSheet.create({
  addPublicationsWrapper: {
    marginBottom: 20,
  },
  profilePage: {
    backgroundColor: "rgb(250, 250, 250)",
  },
  profileContent: {
    width: "1000px",
    margin: "0 auto",
  },
  activityWrapper: {
    width: 700,
    marginTop: 20,
  },
  mainContentWrapper: {
    margin: "0 auto",
    backgroundColor: "rgb(255, 255, 255)",
    borderTop: "1px solid #DEDEE6",
    border: "1px solid #F5F5F9",
    padding: 20,
  },
  mainContent: {
    width: "1000px",
    margin: "0 auto",
  },
  wrapper: {
  },
  contentWrapper: {
    display: "flex",
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    marginTop: 20,
  },    
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const profile = await fetchAuthorProfile({ authorId: ctx!.params!.authorId as string })
  const publicationsResponse = await fetchAuthorPublications({ authorId: ctx!.params!.authorId as string })

  return {
    props: {
      profile,
      publicationsResponse,
    },
    revalidate: 86000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default AuthorProfilePage;
