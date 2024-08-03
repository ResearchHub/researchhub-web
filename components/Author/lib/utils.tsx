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
import { faCircleStar, faCircleUp } from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Tooltip from "@mui/material/Tooltip";

export const getAchievmentDetails = ({
  achievement,
  summaryStats,
}: {
  achievement: Achievement;
  summaryStats: AuthorSummaryStats;
}): { icon: ReactElement; title: string; details: string } => {
  if (achievement === "OPEN_SCIENCE_SUPPORTER") {
    return {
      icon: <OpenAccessAchievementIcon active height={30} width={30} />,
      title: "Open Access Advocate",
      details: `${summaryStats.openAccessPct}% of works are open access`,
    };
  } else if (achievement === "CITED_AUTHOR") {
    return {
      icon: <CitedAuthorAchievementIcon active height={30} width={30} />,
      title: "Cited Author",
      details: `Cited ${summaryStats.citationCount} times`,
    };
  } else if (achievement.includes("EXPERT_PEER_REVIEWER")) {
    return {
      icon: <FontAwesomeIcon style={{ color: "#e77600" }} icon={faCircleStar} fontSize={30} />,
      title: "Peer Reviewer",
      details: `Peer reviewed at least 1 publication`,
    };
  } else if (achievement.includes("HIGHLY_UPVOTED")) {
    return {
      icon: <FontAwesomeIcon style={{ color: colors.NEW_GREEN() }} icon={faCircleUp} fontSize={30} />,
      title: "Active user",
      details: `Received at least five upvotes on the platform`,
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
