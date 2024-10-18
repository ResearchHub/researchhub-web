import {
  CitedAuthorAchievementIcon,
  OpenAccessAchievementIcon,
} from "~/config/icons/AchievementIcons";
import { Achievement, AuthorSummaryStats, FullAuthorProfile, TIER_COLORS, TIER_INDICES } from "./types";
import { ReactElement } from "react";
import { Tab } from "~/components/HorizontalTabBar";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp, faQuestion, faHandHoldingDollar, faStar, faStarCircle, faUnlock, faLockOpen, faQuoteRight, faHandsHoldingDollar } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Tooltip from "@mui/material/Tooltip";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";


export const getAchievmentDetails = ({
  achievement,
  summaryStats,
}: {
  achievement: Achievement;
  summaryStats: AuthorSummaryStats;
}): { icon: ReactElement; title: string } => {
  const tierColor = TIER_COLORS[achievement.currentMilestoneIndex]

  if (achievement.type === "OPEN_SCIENCE_SUPPORTER") {
    return {
      icon: (
        <ResearchCoinIcon version={4} color={tierColor} height={25} width={25} />
      ),
      title: "Open Science Supporter",
    };
  } else if (achievement.type === "CITED_AUTHOR") {
    return {
      icon: (
        <div style={{ background: tierColor, borderRadius: "50%", padding: 3, width: 19, height: 19, display: "flex", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
          <FontAwesomeIcon style={{ color: "white" }} icon={faQuoteRight} fontSize={13} />
        </div>
      ),
      title: "Cited Author",
    };
  } else if (achievement.type === "EXPERT_PEER_REVIEWER") {
    return {
      icon: (
        <div style={{ background: "white", borderRadius: "50%", }}>
          <FontAwesomeIcon style={{ color: tierColor }} icon={faStarCircle} fontSize={25} />
        </div>
      ),
      title: "Peer Reviewer",
    };
  } else if (achievement.type === "HIGHLY_UPVOTED") {
    return {
      icon: (
        <div style={{ background: "white", borderRadius: "50%", }}>
          <FontAwesomeIcon style={{ color: tierColor }} icon={faCircleUp} fontSize={25} />
        </div>        
      ),
      title: "Active user",
    };
  } else if (achievement.type === "OPEN_ACCESS") {
    return {
      icon: (
        <div style={{ background: tierColor, borderRadius: "50%", padding: 3, width: 19, height: 19, display: "flex", alignContent: "center", flexDirection: "column", justifyContent: "center" }}>
          <FontAwesomeIcon style={{ color: "white" }} icon={faLockOpen} fontSize={12} />
        </div>
      ),

      title: "Open Access Advocate",
    };
  }

  return {
    icon: <></>,
    title: "",
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
      label: "Grants",
      value: "grants",
      href: `/author/${profile.id}/grants`,
      isSelected: router.pathname === "/author/[authorId]/grants",
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
