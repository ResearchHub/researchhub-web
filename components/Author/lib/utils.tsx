import { CitedAuthorAchievementIcon, OpenAccessAchievementIcon } from "~/config/icons/AchievementIcons";
import { Achievement, FullAuthorProfile } from "./types";
import { ReactElement } from "react";
import { Tab } from "~/components/HorizontalTabBar";

export const getAchievmentDetails = ({ achievement, profile }: { achievement: Achievement, profile: FullAuthorProfile }): { icon: ReactElement, title: string, details: string } => {
  if (achievement === "OPEN_ACCESS") {
    return {
      icon: <OpenAccessAchievementIcon active height={30} width={30} />,
      title: "Open Access Advocate",
      details: `${profile.openAccessPct}% of works are open access`,
    };
  }
  else if (achievement === "CITED_AUTHOR") {
    return {
      icon: <CitedAuthorAchievementIcon active height={30} width={30} />,
      title: "Cited Author",
      details: `Cited ${profile.summaryStats.citationCount} times`,
    };
  }

  return {
    icon: <></>,
      title: "",
    details: "",
  };
}

export const buildAuthorTabs = ({ router, profile }: { router: any, profile: FullAuthorProfile }): Tab[] => {
  return [{
    label: "Overview",
    value: "overview",
    href: `/author/${profile.id}`,
    isSelected: true,
  },{
    label: "Works",
    value: "works",
    href: `/author/${profile.id}`,
    isSelected: false,
  }, {
    label: "Peer Reviews",
    value: "peer-reviews",
    href: `/author/${profile.id}`,
    isSelected: false,
  }, {
    label: "Comments",
    value: "comments",
    href: `/author/${profile.id}`,
    isSelected: false,
  }, {
    label: "Bounties",
    value: "bounties",
    href: `/author/${profile.id}`,
    isSelected: false,
  }]
}