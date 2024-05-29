import colors from "~/config/themes/colors";
import { FullAuthorProfile } from "../lib/types";
import { getAchievmentDetails } from "../lib/utils";
import { css, StyleSheet } from "aphrodite";

const AuthorHeaderAchievements = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div className={css(styles.rootWrapper)}>
      {profile.achievements.map((achievement) => {
        const achivementDetails = getAchievmentDetails({ achievement, profile })
        return (
          <div key={achievement} className={css(styles.achievement)}>
            <div>{achivementDetails.icon}</div>
            <div>{achivementDetails.title}</div>
          </div>
        )
      })}
      <div className={css(styles.showMore)}>
        Show more
      </div>      
    </div>
  )
}

const styles = StyleSheet.create({
  rootWrapper: {
    rowGap: 10,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
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