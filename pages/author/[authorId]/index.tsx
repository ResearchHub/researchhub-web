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

type Args = {
  profile: any;
  overview: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, overview }) => {

  const router = useRouter();

  if (!profile || !overview) {
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
            <AuthorWorks works={overview.results} coauthors={fullAuthorProfile.coauthors} />
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
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const profile = await fetchAuthorProfile({ authorId: ctx!.params!.authorId as string })
  const overview = await fetchAuthorOverview({ authorId: ctx!.params!.authorId as string })

  return {
    props: {
      profile,
      overview,
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
