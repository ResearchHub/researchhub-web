import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchProfileData } from "~/components/Author/lib/api";
import { parseAuthorAchievements, parseAuthorSummaryStats, parseFullAuthorProfile } from "~/components/Author/lib/types";
import { css, StyleSheet } from "aphrodite";
import AuthorProfileHeader from "~/components/Author/Profile/AuthorProfileHeader";
import { AuthorProfileContextProvider } from "~/components/Author/lib/AuthorProfileContext";
import AuthorNavigation from "~/components/Author/Profile/AuthorNavigation";
import AuthorComments from "~/components/Author/Profile/AuthorComments";
import { ClipLoader } from "react-spinners";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";


type Args = {
  profile: any;
  summary: any;
  achievements: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, summary, achievements }) => {

  if (!profile || !summary || !achievements) {
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

  const parsedAchievements = parseAuthorAchievements(achievements);
  const parsedSummaryStats = parseAuthorSummaryStats(summary);
  const fullAuthorProfile = parseFullAuthorProfile(profile);

  return (
    <AuthorProfileContextProvider
      fullAuthorProfile={fullAuthorProfile}
      achievements={parsedAchievements}
      summaryStats={parsedSummaryStats}
    >
      <div className={css(styles.profilePage)}>
        <div className={css(styles.profileContent)}>
          <AuthorProfileHeader />
        </div>
        <AuthorNavigation />
        <div className={css(styles.mainContentWrapper)}>
          <div className={css(styles.mainContent)}>
            <AuthorComments authorId={profile.id} contentType="REVIEW" />
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
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },
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
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },    
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
  const [profile, summary, achievements] = await fetchProfileData({
    authorId: ctx!.params!.authorId as string,
    fetchSummary: true,
    fetchAchievements: true,
  });

  return {
    props: {
      profile,
      summary,
      achievements,
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
