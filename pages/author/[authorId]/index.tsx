import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchAuthorOverview } from "~/components/Author/lib/api";
import { FullAuthorProfile, parseFullAuthorProfile } from "~/components/Author/lib/types";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import HorizontalTabBar, { Tab } from "~/components/HorizontalTabBar";
import AuthorHeaderKeyStats from "~/components/Author/Profile/AuthorHeaderKeyStats";
import AuthorInstitutions from "~/components/Author/Profile/AuthorInstitutions";
import AuthorHeaderAchievements from "~/components/Author/Profile/AuthorHeaderAchievements";
import AuthorHeaderExpertise from "~/components/Author/Profile/AuthorHeaderExpertise";
import AuthorWorks from "~/components/Author/Profile/AuthorWorks";
import AuthorSocialMediaIcons from "~/components/Author/Profile/AuthorSocialMediaIcons";
import { css, StyleSheet } from "aphrodite";
import AuthorActivity from "~/components/Author/Profile/AuthorActivity";
import { buildAuthorTabs } from "~/components/Author/lib/utils";
import { useRouter } from "next/router";

type Args = {
  profile: any;
  overview: any;
};

const AuthorProfileHeader = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div>
      <Avatar src={profile.profileImage} sx={{ width: 128, height: 128, fontSize: 48 }}>
        {isEmpty(profile.profileImage) && profile.firstName?.[0] + profile.lastName?.[0]}
      </Avatar>

      <div>
        <div>{profile.firstName} {profile.lastName}</div>
        <div>{profile.headline}</div>

        <AuthorInstitutions institutions={profile.institutions} />

        <div>{profile.description}</div>

        <div>
          <AuthorSocialMediaIcons profile={profile} />
        </div>
      </div>

      <div>
        <AuthorHeaderKeyStats profile={profile} />
      </div>

      <div>
        <AuthorHeaderAchievements profile={profile} />
      </div>      

      <div>
        <AuthorHeaderExpertise profile={profile} />
      </div>
    </div>
  )
}


const AuthorProfilePage: NextPage<Args> = ({ profile, overview }) => {

  const router = useRouter();

  if (!profile || !overview) {
    // TODO: Need a skeleton loading state
    return <div>Loading...</div>;
  }

  const authorTabs = buildAuthorTabs({ profile, router });
  const fullAuthorProfile = parseFullAuthorProfile(profile);

  return (
    <div>
      <AuthorProfileHeader profile={fullAuthorProfile} />
      <HorizontalTabBar tabs={authorTabs} />
      <AuthorWorks works={overview.results} coauthors={fullAuthorProfile.coauthors} />
      <AuthorActivity activity={fullAuthorProfile.activityByYear} />
    </div>
  );
};

const styles = StyleSheet.create({
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
