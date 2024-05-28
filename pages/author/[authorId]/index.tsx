import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchAuthorOverview } from "~/components/Author/lib/api";
import { Achievement, FullAuthorProfile, parseFullAuthorProfile } from "~/components/Author/lib/types";
import { parseAuthorProfile } from "~/config/types/root_types";
import { GoogleScholarIcon, LinkedInIcon, OrcidIcon, XIcon } from "~/config/icons/SocialMediaIcons";
import { CitedAuthorAchievementIcon, OpenAccessAchievementIcon } from "~/config/icons/AchievementIcons";
import { ReactElement } from 'react';

type Args = {
  profile: any;
  overview: any;
};

const getAchievmentDetails = ({ achievement, fullAuthorProfile }: { achievement: Achievement, fullAuthorProfile: FullAuthorProfile }): { icon: ReactElement, title: string, details: string } => {
  if (achievement === "CITED_AUTHOR") {
    return {
      icon: <CitedAuthorAchievementIcon active />,
      title: "Cited Author",
      details: `Cited ${fullAuthorProfile.summaryStats.citationCount} times`,
    };
  }
  else if (achievement === "OPEN_ACCESS") {
    return {
      icon: <OpenAccessAchievementIcon active />,
      title: "Open Access",
      details: `${fullAuthorProfile.openAccessPct}% of works are open access`,
    };
  }

  return {
    icon: <></>,
    title: "",
    details: "",
  };
}


const AuthorProfilePage: NextPage<Args> = ({ profile, overview }) => {

  if (!profile) {
    // TODO: Need a skeleton loading state
    return <div>Loading...</div>;
  }

  const fullAuthorProfile = parseFullAuthorProfile(profile);
  console.log(fullAuthorProfile)
  return (
    <div>
      <div>
        <div>{fullAuthorProfile.firstName} {fullAuthorProfile.lastName}</div>
        <div>{fullAuthorProfile.headline}</div>
      
        <div>
          Institutions:
          {fullAuthorProfile.institutions.map((institution) => (
            <div key={institution.id}>
              {institution.institution.displayName}
            </div>
          ))}
        </div>

        <div>{fullAuthorProfile.description}</div>

        <div>
          <OrcidIcon externalUrl={fullAuthorProfile.orcidUrl} width={35} height={35} />
          <LinkedInIcon externalUrl={fullAuthorProfile.linkedInUrl} width={35} height={35} />
          <XIcon externalUrl={fullAuthorProfile.xUrl} width={35} height={35} />
          <GoogleScholarIcon externalUrl={fullAuthorProfile.googleScholarUrl} width={35} height={35} />
        </div>
      </div>

      <div>
        {fullAuthorProfile.achievements.map((achievement) => {
          const achivementDetails = getAchievmentDetails({ achievement, fullAuthorProfile })
          return (
            <div key={achievement}>
              <div>{achivementDetails.icon}</div>
              <div>{achivementDetails.title}</div>
            </div>
          )
        })}
      </div>

    </div>
  );
};

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
