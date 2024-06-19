import colors from "~/config/themes/colors";
import { FullAuthorProfile, Reputation } from "../lib/types";
import { css, StyleSheet } from "aphrodite";
import ReputationGauge from "../lib/ReputationGauge";

const AuthorHeaderExpertise = ({ profile }: { profile: FullAuthorProfile }) => {
  
  const REP_GAUGES_TO_SHOW = 3;

  return (
    <div>
      {profile.reputationList.slice(0, REP_GAUGES_TO_SHOW).map((rep, index) => (
        <div className={css(styles.reputation)}>
          <div className={css(styles.reputationHubLabel)}>{rep.hub.name}</div>
          <ReputationGauge reputation={rep} key={`reputation-` + index} />
        </div>
      ))}
      <div className={css(styles.showMore)}>
        Show more
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  reputation: {
    marginTop: 10,
  },
  reputationHubLabel: {
    fontSize: 14,
    marginBottom: 5,  
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



export default AuthorHeaderExpertise;