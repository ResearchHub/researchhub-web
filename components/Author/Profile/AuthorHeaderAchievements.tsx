import colors from "~/config/themes/colors";
import { FullAuthorProfile } from "../lib/types";
import { getAchievmentDetails } from "../lib/utils";
import { css, StyleSheet } from "aphrodite";
import { Tooltip } from "@mui/material";
import { faCircleCheck, faTrophy, faTrophyStar } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const AuthorHeaderAchievements = ({ profile }: { profile: FullAuthorProfile }) => {

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
    else if (achievement.includes("EXPERT_PEER_REVIEWER")) {
      return (
        <div className={css(styles.tooltip)}>
          <div className={css(styles.tooltipLineItem)}>
            <FontAwesomeIcon icon={faCircleCheck} color={colors.GREEN()} />
            Peer reviewed at least 1 publication
          </div>
        </div>
      )
    }
  }

  return (
    <div className={css(styles.rootWrapper)}>
      {profile.achievements.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 15}}>
          <div style={{ display: "flex", justifyContent: "center"}}>
            <FontAwesomeIcon style={{ textAlign: "center"}} icon={faTrophyStar} fontSize={60} color={colors.GREY()} />
          </div>
          <div style={{ color: colors.MEDIUM_GREY2(), textAlign: "center"}}>This user has not unlocked any achievements yet.</div>
        </div>
      )}
      {profile.achievements.slice(0,3).map((achievement) => {
        const achivementDetails = getAchievmentDetails({ achievement, profile })
        return (
          <Tooltip title={getTooltipContent(achievement)}>
            <div key={achievement} className={css(styles.achievement)}>
              <div>{achivementDetails.icon}</div>
              <div>{achivementDetails.title}</div>
            </div>
          </Tooltip>
        )
      })}
      {profile.achievements.length > 3 && (
        <div className={css(styles.showMore)}>
          Show more
        </div>      
      )}
    </div>
  )
}

const styles = StyleSheet.create({
  rootWrapper: {
    rowGap: 10,
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