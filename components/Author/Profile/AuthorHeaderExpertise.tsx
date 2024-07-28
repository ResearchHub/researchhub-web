import colors from "~/config/themes/colors";
import { FullAuthorProfile } from "../lib/types";
import { css, StyleSheet } from "aphrodite";
import ReputationGauge from "../lib/ReputationGauge";
import { useState } from "react";
import ExpertiseModal from "../lib/ExpertiseModal";

const REP_GAUGES_TO_SHOW = 3;

const AuthorHeaderExpertise = ({ profile }: { profile: FullAuthorProfile }) => {
  
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);

  return (
    <div>
      <ExpertiseModal profile={profile} isModalOpen={isExpertiseModalOpen} handleModalClose={() => setIsExpertiseModalOpen(false)} />
      {profile.reputationList.slice(0, REP_GAUGES_TO_SHOW).map((rep, index) => (
        <div className={css(styles.reputation)}>
          <div className={css(styles.reputationHubLabel)}>{rep.hub.name}</div>
          {/* {rep.percentile} */}
          <ReputationGauge reputation={rep} key={`reputation-` + index} />
        </div>
      ))}
      <div className={css(styles.links)}>
        <div className={css(styles.showMore, styles.link)} onClick={() => setIsExpertiseModalOpen(true)}>
          Show more
        </div>
        <div className={css(styles.divider)}></div>
        <div className={css(styles.link)} onClick={() => setIsExpertiseModalOpen(true)}>
          How is this calculated?
        </div>
      </div>      
    </div>
  )
}



const styles = StyleSheet.create({
  links: {
    display: "flex",
    marginTop: 0,
  
  },
  reputation: {
    marginTop: 10,
  },
  reputationHubLabel: {
    fontSize: 14,
    marginBottom: 5,  
    textTransform: "capitalize",
  },
  divider: {
    borderRight: "1px solid #999999",
    height: "16px",
    marginTop: 10,
    marginLeft: 5,
  },
  link: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    marginLeft: 5,
    fontSize: 14,
    marginTop: 10,
    ":hover": {
      textDecoration: "underline",
    }
  },
  showMore: {
      marginTop: 10,
      marginLeft: 0,
  }
});



export default AuthorHeaderExpertise;