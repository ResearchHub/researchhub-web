import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchProfileData } from "~/components/Author/lib/api";
import { parseAuthorAchievements, parseAuthorSummaryStats, parseFullAuthorProfile } from "~/components/Author/lib/types";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import AuthorWorks from "~/components/Author/Profile/AuthorWorks";
import { css, StyleSheet } from "aphrodite";
import AuthorActivity from "~/components/Author/Profile/AuthorActivity";
import { buildAuthorTabs } from "~/components/Author/lib/utils";
import { useRouter } from "next/router";
import AuthorProfileHeader from "~/components/Author/Profile/AuthorProfileHeader";
import { AuthorProfileContextProvider } from "~/components/Author/lib/AuthorProfileContext";
import AuthorComments from "~/components/Author/Profile/AuthorComments";
import CoAuthors from "~/components/Author/Profile/CoAuthors";
import ALink from "~/components/ALink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from "@fortawesome/pro-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

type Args = {
  profile: any;
  overview: any;
  summary: any;
  achievements: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, overview, summary, achievements }) => {
  const router = useRouter();

  if (!profile || !overview || !summary || !achievements) {
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
  const authorTabs = buildAuthorTabs({ profile: fullAuthorProfile, summaryStats: parsedSummaryStats, router });
  const hasActivity = fullAuthorProfile.activityByYear.some((a) => a.worksCount > 0)

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
        <div className={css(styles.tabsWrapper)}>
          <HorizontalTabBar tabs={authorTabs} />
        </div>
        <div className={css(styles.mainContentWrapper)}>
          <div className={css(styles.mainContent)}>
            <div className={css(styles.mainContentSubwrapper)}>
              <div className={css(styles.sectionsWrapper)}>
                  {overview.results.length > 0 && (
                    <div className={css(styles.section)}>
                      <AuthorWorks works={overview.results} />
                      <ALink theme="solidPrimary" href={`/author/${fullAuthorProfile.id}/publications`}>
                        <div className={css(styles.seeMoreLink)}>
                          See more
                          <FontAwesomeIcon icon={faLongArrowAltRight} />
                        </div>
                      </ALink>
                    </div>
                  )}
                  <div className={css(styles.section)}>
                    <div className={css(styles.sectionHeader)}>Recent Activity</div>
                  <AuthorComments
                    contentType="ALL"
                    authorId={profile.id}
                    limit={6}
                    withLoadMore={false}
                    loadMoreElement={
                      <ALink theme="solidPrimary" href={`/author/${fullAuthorProfile.id}/comments`}>
                        <div className={css(styles.seeMoreLink)}>
                          See more
                          <FontAwesomeIcon icon={faLongArrowAltRight} />
                        </div>
                      </ALink>
                    }
                  />

                  </div>
              </div>

              <div className={css(styles.miscSections)}>
                <div className={css(styles.coauthorsSection, styles.miscSection)}>
                  <CoAuthors coauthors={fullAuthorProfile.coauthors} />
                </div>
                {fullAuthorProfile.activityByYear.length > 0 && hasActivity && (
                  <div className={css(styles.miscSection, styles.activitySection)}>
                    <AuthorActivity activity={fullAuthorProfile.activityByYear} />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthorProfileContextProvider>
  );
};

const styles = StyleSheet.create({
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
  sectionsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
    width: "100%",
  },
  mainContentSubwrapper: {
    display: "flex",
    gap: 20,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      flexDirection: "column",
    },
  },
  section: {

  },
  seeMoreLink: {
    display: "flex",
    fontSize: 14,
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-end"
  },
  profilePage: {
    backgroundColor: "rgb(250, 250, 250)",
    paddingLeft: 15,
    paddingRight: 15,    
  },
  profileContent: {
    width: "1000px",
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },
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
  tabsWrapper: {
    width: "1000px",
    margin: "0 auto",
    marginTop: 20,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      width: "100%",
    },    
  },
  coauthorsSection: {
    backgroundColor: "rgb(250, 250, 250)",
    borderRadius: 20,
    border: "1px solid #F5F5F9",
    padding: 20,
    minWidth: 245,
    marginLeft: 20,
    height: "max-content",
    display: "flex",
    flexDirection: "column",
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      marginLeft: 0,
    }
  },
  activitySection: {
  },
  miscSections: {
    height: "max-content",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    // display: "none",
  },
  miscSection: {
    backgroundColor: "rgb(250, 250, 250)",
    borderRadius: 20,
    border: "1px solid #F5F5F9",
    padding: 20,
    minWidth: 245,
    marginLeft: 20,
    [`@media only screen and (max-width: ${breakpoints.desktop.str})`]: {
      marginLeft: 0,
    }
  },  
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const [profile, overview, summary, achievements] = await fetchProfileData({ authorId: ctx!.params!.authorId as string });

  return {
    props: {
      profile,
      overview,
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
