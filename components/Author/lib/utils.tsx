import {
  CitedAuthorAchievementIcon,
  OpenAccessAchievementIcon,
} from "~/config/icons/AchievementIcons";
import { Achievement, AuthorSummaryStats, FullAuthorProfile } from "./types";
import { ReactElement } from "react";
import { Tab } from "~/components/HorizontalTabBar";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/pro-solid-svg-icons";
import { faCircleStar, faCircleUp, faHandHoldingDollar } from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Tooltip from "@mui/material/Tooltip";


type Tier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export const getAchievmentDetails = ({
  achievement,
  summaryStats,
}: {
  achievement: Achievement;
  summaryStats: AuthorSummaryStats;
}): { icon: ReactElement; title: string; details: string } => {
  const tier = parseInt(achievement.charAt(achievement.length - 1).toUpperCase()) || 0;

  if (achievement === "OPEN_SCIENCE_SUPPORTER") {
    return {
      icon: <FontAwesomeIcon style={{ color: "black" }} icon={faHandHoldingDollar} fontSize={24} />,
      title: "Open Access Advocate",
      details: `Provided funding for open science`,
    };
  } else if (achievement === "CITED_AUTHOR") {
    return {
      icon: <CitedAuthorAchievementIcon height={24} width={24} />,
      title: "Cited Author",
      details: `Cited ${summaryStats.citationCount} times`,
    };
  } else if (achievement.includes("EXPERT_PEER_REVIEWER")) {
    return {
      icon: <FontAwesomeIcon style={{ color: "black" }} icon={faCircleStar} fontSize={24} />,
      title: "Peer Reviewer",
      details: `Peer reviewed at least 1 publication`,
    };
  } else if (achievement.includes("HIGHLY_UPVOTED")) {
    return {
      icon: <FontAwesomeIcon style={{ color: "black" }} icon={faCircleUp} fontSize={24} />,
      title: "Active user",
      details: `Received at least five upvotes on the platform`,
    };
  } else if (achievement.includes("OPEN_ACCESS")) {
    return {
      icon: <OpenAccessAchievementIcon height={24} width={24} />,
      title: "Open Access Advocate",
      details: `At least 50% of papers are open access`,
    };
  }

  return {
    icon: <></>,
    title: "",
    details: "",
  };
};

export const buildAuthorTabs = ({
  router,
  profile,
  summaryStats,
}: {
  router: any;
  profile: FullAuthorProfile;
  summaryStats: AuthorSummaryStats;
}): Tab[] => {

  return [
    {
      label: "Overview",
      value: "overview",
      href: `/author/${profile.id}`,
      isSelected: router.pathname === "/author/[authorId]",
    },
    {
      label: "Publications",
      value: "publications",
      href: `/author/${profile.id}/publications`,
      isSelected: router.pathname === "/author/[authorId]/publications",
      pillContentStyle: profile.hasVerifiedPublications
        ? undefined
        : styles.unverified,
      pillContent: profile.hasVerifiedPublications ? (
        summaryStats.worksCount.toLocaleString()
      ) : (
        <Tooltip
          title={"Publications have not yet been verified by author."}
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: 14,
                bgcolor: colors.YELLOW2(),
              },
            },
          }}
        >
          <FontAwesomeIcon icon={faQuestion} />
        </Tooltip>
      ),
    },
    {
      label: "Peer Reviews",
      value: "reviews",
      href: `/author/${profile.id}/reviews`,
      isSelected: router.pathname === "/author/[authorId]/reviews",
    },
    {
      label: "Comments",
      value: "comments",
      href: `/author/${profile.id}/comments`,
      isSelected: router.pathname === "/author/[authorId]/comments",
    },
    {
      label: "Bounties",
      value: "bounties",
      href: `/author/${profile.id}/bounties`,
      isSelected: router.pathname === "/author/[authorId]/bounties",
    },
  ];
};

const styles = StyleSheet.create({
  unverified: {
    background: colors.YELLOW2(),
    color: "white",
    borderRadius: 4,
    padding: "4px 8px",
  },
});
