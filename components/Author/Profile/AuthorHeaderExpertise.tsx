import colors from "~/config/themes/colors";
import { FullAuthorProfile } from "../lib/types";
import { css, StyleSheet } from "aphrodite";
import ReputationGauge from "../lib/ReputationGauge";
import { useState } from "react";
import ExpertiseModal from "../lib/ExpertiseModal";
import { toTitleCase } from "~/config/utils/string";

const REP_GAUGES_TO_SHOW = 3;

const AuthorHeaderExpertise = ({ profile }: { profile: FullAuthorProfile }) => {
  
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);

  return (
    <div>
      <ExpertiseModal profile={profile} isModalOpen={isExpertiseModalOpen} handleModalClose={() => setIsExpertiseModalOpen(false)} />
      {profile.reputationList.slice(0, REP_GAUGES_TO_SHOW).map((rep, index) => (
        <div className={css(styles.reputation)}>
          <div className={css(styles.reputationHubLabel)}>{rep.hub.name}</div>
          <ReputationGauge reputation={rep} key={`reputation-` + index} />
        </div>
      ))}
      <div className={css(styles.showMore)} onClick={() => setIsExpertiseModalOpen(true)}>
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
    textTransform: "capitalize",
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