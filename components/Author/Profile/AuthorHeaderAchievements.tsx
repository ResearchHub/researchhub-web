import colors from "~/config/themes/colors";
import { Achievement, AuthorSummaryStats, FullAuthorProfile } from "../lib/types";
import { getAchievmentDetails } from "../lib/utils";
import { css, StyleSheet } from "aphrodite";
import { Tooltip } from "@mui/material";
import { faCircleCheck, faTrophy, faTrophyStar } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const AuthorHeaderAchievements = ({ summaryStats, achievements }: { summaryStats: AuthorSummaryStats, achievements: Array<Achievement> }) => {

  const getTooltipContent = (achievement: string) => {
    if (achievement === "OPEN_ACCESS") {
      return (
        <div className={css(styles.tooltip)}>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={colors.GREEN()} />
            Published at least 2 papers
          </div>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={colors.GREEN()} />
            51% or papers or more are open access
          </div>          
        </div>
      )
    }
    else if (achievement === "CITED_AUTHOR") {
      return (
        <div className={css(styles.tooltip)}>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={colors.GREEN()} />
            Author on paper that received at least 1 citation
          </div>
        </div>
      )
    }
    else if (achievement === "OPEN_SCIENCE_SUPPORTER") {
      return (
        <div className={css(styles.tooltip)}>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={colors.GREEN()} />
            Funded open science using RSC
          </div>
        </div>
      )
    }    
    else if (achievement.includes("HIGHLY_UPVOTED")) {
      return (
        <div className={css(styles.tooltip)}>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={"#B9F2FF"} />
            Received at least 10 upvotes
          </div>
        </div>
      )
    }
    else if (achievement.includes("EXPERT_PEER_REVIEWER")) {
      return (
        <div className={css(styles.tooltip)}>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={"#B9F2FF"} />
            Peer reviewed at least 1 publication
          </div>
        </div>
      )
    }
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
          <Tooltip title={getTooltipContent(achievement)}>
            <div key={achievement} className={css(styles.achievement)}>
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
  rootWrapper: {
    rowGap: 5,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    flexGrow: 1,
  },
  tooltip: {
    padding: 6,
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",    
    gap: 5,
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