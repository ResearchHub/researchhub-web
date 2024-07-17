import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchAuthorPublications, parsePublicationResponse } from "~/components/Author/lib/api";
import { parseFullAuthorProfile } from "~/components/Author/lib/types";
import { css, StyleSheet } from "aphrodite";
import AuthorProfileHeader from "~/components/Author/Profile/AuthorProfileHeader";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector } from "react-redux";
import AuthorPublications from "~/components/Author/Profile/AuthorPublications";
import { AuthorProfileContextProvider } from "~/components/Author/lib/AuthorProfileContext";
import AuthorNavigation from "~/components/Author/Profile/AuthorNavigation";
import colors from "~/config/themes/colors";
import Button from "~/components/Form/Button";
import PendingBadge from "~/components/shared/PendingBadge";
import VerifyPublicationsModal from "~/components/Author/Profile/VerifyPublicationsModal";
import { useState } from "react";



type Args = {
  profile: any;
  publicationsResponse: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, publicationsResponse }) => {

  if (!profile || !publicationsResponse) {
    // TODO: Need a skeleton loading state
    return <div>Loading...</div>;
  }

  const fullAuthorProfile = parseFullAuthorProfile(profile);
  const parsedPublicationsResponse = parsePublicationResponse(publicationsResponse);
  const auth = useSelector((state: any) => state.auth);
  const [isPublicationsModalOpen, setIsPublicationsModalOpen] = useState(false);

  return (
    <AuthorProfileContextProvider fullAuthorProfile={fullAuthorProfile}>
      <VerifyPublicationsModal isOpen={isPublicationsModalOpen} setIsOpen={setIsPublicationsModalOpen} />
      <div className={css(styles.profilePage)}>
        <div className={css(styles.profileContent)}>
          <AuthorProfileHeader profile={fullAuthorProfile} />
        </div>            
        <AuthorNavigation />
        <div className={css(styles.mainContentWrapper)}>
          <div className={css(styles.mainContent)}>
            <div className={css(styles.verifyPublications)}>
              <div>
                <div className={css(styles.verifyPublicationsTitle)}>Is this accurate?</div>
                <div className={css(styles.verifyPublicationsDescription)}>Please confirm you have authored or co-authored the publications listed below. Once confirmed the <div style={{ display: "inline-flex", marginTop: 5,}}><PendingBadge /></div> will be removed.</div>
              </div>
              <div style={{ width: 150 }}>
                <Button onClick={() => setIsPublicationsModalOpen(true)} fullWidth>Looks good</Button>
              </div>
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
  verifyPublications: {
    border: `1px solid ${colors.YELLOW2()}`,
    borderRadius: 8,
    display: "flex",
    padding: "15px 20px",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: "100px",
  },
  verifyPublicationsTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 3
  },
  verifyPublicationsDescription: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 15,
    lineHeight: "18px"
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
