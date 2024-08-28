import colors from "~/config/themes/colors";
import { Achievement, AuthorSummaryStats, FullAuthorProfile, TIER_COLORS, TIER_INDICES } from "../lib/types";
import { getAchievmentDetails } from "../lib/utils";
import { css, StyleSheet } from "aphrodite";
import { Tooltip } from "@mui/material";
import { faCircleCheck, faTrophy, faTrophyStar } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";


const AuthorHeaderAchievements = ({ summaryStats, achievements }: { summaryStats: AuthorSummaryStats, achievements: Array<Achievement> }) => {
  const getTooltipContent = (achievement: Achievement, achivementDetails: { icon: ReactElement, title: string } ) => {
  const filledColor = TIER_COLORS[achievement.currentMilestoneIndex + 1]
  const isTopTier = achievement.currentMilestoneIndex === achievement.milestones.length - 1
  
  let value = achievement.value;
  let displayValue = value.toLocaleString();
  let nextTierValue = achievement.milestones[achievement.currentMilestoneIndex + 1] || 0
  let nextTierDisplayValue = nextTierValue.toLocaleString();

  if (achievement.type === "OPEN_ACCESS") {
    value = Math.round(achievement.value * 100);
    nextTierValue = nextTierValue * 100;
    displayValue = value + "%";
    nextTierDisplayValue = nextTierValue + "%";
  }

  return (
    <div className={css(styles.tooltip)}>
      <div style={{ display: "flex", alignItems: "center", columnGap: 10, }}>
        {achivementDetails.icon} {achivementDetails.title} ({TIER_INDICES[achievement.currentMilestoneIndex]})
      </div>
      <div style={{ fontSize: 13, fontWeight: 400, marginBottom: 10 }}>
        {achievement.type === "OPEN_SCIENCE_SUPPORTER" ? `Funded open science using ${displayValue} RSC.` : achievement.type === "EXPERT_PEER_REVIEWER" ? `Peer reviewed ${displayValue} publications.`  : achievement.type === "HIGHLY_UPVOTED" ? ` Received ${displayValue} upvotes.` : achievement.type === "CITED_AUTHOR" ? `Author's publications Cited ${displayValue} times.` : achievement.type === "OPEN_ACCESS" ? `Published ${displayValue} of works as open access.` : ""}
      </div>
      {!isTopTier && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            Next tier: 

            <div style={{ fontSize: 12 }}>
              {displayValue} / {nextTierDisplayValue}
              {achievement.type === "OPEN_SCIENCE_SUPPORTER" ? " RSC" : achievement.type === "EXPERT_PEER_REVIEWER" ? " reviews" : achievement.type === "HIGHLY_UPVOTED" ? " upvotes" : achievement.type === "CITED_AUTHOR" ? " citations" : ""}
            </div>

          </div>
          <div className={css(styles.progressBar)}>
            <div style={{ position: "absolute", top: 2, paddingLeft: 5  }}>
              {TIER_INDICES[achievement.currentMilestoneIndex + 1]}
            </div>
            <div style={{ borderRadius: "4px 0 0 4px", background: filledColor, height: "100%", width: (achievement.pctProgress * 100) + "%" }}>
            </div>
          </div>
        </>
      )}
    </div>
  )
  }

  return (
    <div className={css(styles.rootWrapper)}>
      {achievements.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 15}}>
          <div style={{ display: "flex", justifyContent: "center"}}>
            <FontAwesomeIcon style={{ textAlign: "center"}} icon={faTrophyStar} fontSize={60} color={colors.GREY()} />
          </div>
          <div style={{ color: colors.MEDIUM_GREY2(), textAlign: "center"}}>This user has not unlocked any achievements yet.</div>
        </div>
      )}
      {achievements.map((achievement) => {
        const achivementDetails = getAchievmentDetails({ achievement, summaryStats, })

        return (
          <Tooltip
            title={getTooltipContent(achievement, achivementDetails)}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "rgba(36, 31, 58, 1)",
                },
              },
            }}            
          >
            <div key={achievement.type} className={css(styles.achievement)}>
              <div>{achivementDetails.icon}</div>
              <div>{achivementDetails.title}</div>
            </div>
          </Tooltip>
        )
      })}
      {/* {profile.achievements.length > 3 && (
        <div className={css(styles.showMore)}>
          Show more
        </div>      
      )} */}
    </div>
  )
}

const styles = StyleSheet.create({
  progressBar: {
    borderRadius: 4,
    width: "100%",
    height: 20,
    background: "rgba(124, 121, 137, 1)",
    position: "relative"
  },
  rootWrapper: {
    rowGap: 5,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    flexGrow: 1,
  },
  tooltip: {
    padding: 6,
    fontSize: 13,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",    
    gap: 5,
    width: 250,
  },
  tooltipLineItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 400,
  },
  achievement: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 30,
    fontSize: 14,
  },
  showMore: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    marginLeft: 5,
    fontSize: 14,
    marginTop: 10,
    ":hover": {
      textDecoration: "underline",
    }  
  }
});

export default AuthorHeaderAchievements;