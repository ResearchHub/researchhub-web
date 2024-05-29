import { FullAuthorProfile } from "../lib/types";
import { getAchievmentDetails } from "../lib/utils";
import { css, StyleSheet } from "aphrodite";

const AuthorHeaderAchievements = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div>
      <div>Achievements</div>
      {profile.achievements.map((achievement) => {
        const achivementDetails = getAchievmentDetails({ achievement, profile })
        return (
          <div key={achievement}>
            <div>{achivementDetails.icon}</div>
            <div>{achivementDetails.title}</div>
          </div>
        )
      })}
    </div>
  )
}

const styles = StyleSheet.create({
});

export default AuthorHeaderAchievements;