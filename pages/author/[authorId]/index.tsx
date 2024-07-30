import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchAuthorOverview } from "~/components/Author/lib/api";
import { parseFullAuthorProfile } from "~/components/Author/lib/types";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import AuthorWorks from "~/components/Author/Profile/AuthorWorks";
import { css, StyleSheet } from "aphrodite";
import AuthorActivity from "~/components/Author/Profile/AuthorActivity";
import { buildAuthorTabs } from "~/components/Author/lib/utils";
import { useRouter } from "next/router";
import AuthorProfileHeader from "~/components/Author/Profile/AuthorProfileHeader";
import { AuthorProfileContextProvider, authorProfileContext } from "~/components/Author/lib/AuthorProfileContext";
import fetchContributionsAPI from "~/components/LiveFeed/api/fetchContributionsAPI";
import AuthorComments from "~/components/Author/Profile/AuthorComments";
import CoAuthors from "~/components/Author/Profile/CoAuthors";
import ALink from "~/components/ALink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight } from "@fortawesome/pro-solid-svg-icons";

type Args = {
  profile: any;
  overview: any;
  commentApiResponse: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, overview, commentApiResponse }) => {

  const router = useRouter();

  if (!profile || !overview || !commentApiResponse) {
    // TODO: Need a skeleton loading state
    return <div>Loading...</div>;
  }

  const fullAuthorProfile = parseFullAuthorProfile(profile);
  const authorTabs = buildAuthorTabs({ profile: fullAuthorProfile, router });


  return (
    <AuthorProfileContextProvider fullAuthorProfile={fullAuthorProfile}>
      <div className={css(styles.profilePage)}>
        <div className={css(styles.profileContent)}>
          <AuthorProfileHeader />
        </div>
        <div className={css(styles.tabsWrapper)}>
          <HorizontalTabBar tabs={authorTabs} />
        </div>
        <div className={css(styles.mainContentWrapper)}>
          <div className={css(styles.mainContent)}>
            <div style={{ display: "flex",  }}>
              <div>
                <AuthorWorks works={overview.results} />
                <ALink theme="solidPrimary" href={`/author/${fullAuthorProfile.id}/publications`}>
                  <div className={css(styles.seeMoreLink)}>
                    See more
                    <FontAwesomeIcon icon={faLongArrowAltRight} />
                  </div>
                </ALink>
                <div className={css(styles.sectionHeader)}>Recent Activity</div>
                <AuthorComments commentApiResponse={commentApiResponse} withLoadMore={false} />
                <ALink theme="solidPrimary" href={`/author/${fullAuthorProfile.id}/comments`}>
                  <div className={css(styles.seeMoreLink)}>
                    See more
                    <FontAwesomeIcon icon={faLongArrowAltRight} />
                  </div>
                </ALink>                
              </div>

              <div className={css(styles.coauthorsSection)}>
                <CoAuthors coauthors={fullAuthorProfile.coauthors} />
              </div>
            </div>

            <div className={css(styles.activityWrapper)}>
              <AuthorActivity activity={fullAuthorProfile.activityByYear} />
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
  tabsWrapper: {
    width: "1000px",
    margin: "0 auto",
    marginTop: 20,
  },
  coauthorsSection: {
    backgroundColor: "rgb(250, 250, 250)",
    borderRadius: 20,
    border: "1px solid #F5F5F9",
    padding: 20,
    minWidth: 245,
    marginLeft: 20,
    height: "max-content",
  }  
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const profile = await fetchAuthorProfile({ authorId: ctx!.params!.authorId as string })
  const overview = await fetchAuthorOverview({ authorId: ctx!.params!.authorId as string })
  const commentApiResponse:any = await fetchContributionsAPI({
    filters: {
      contentType: "ALL",
    },
  });

  commentApiResponse.results = commentApiResponse.results.slice(0, 4);

  return {
    props: {
      profile,
      overview,
      commentApiResponse,
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
