import colors from "~/config/themes/colors";
import { DEMO_BINS, FullAuthorProfile, Reputation } from "../lib/types";
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import ExpertiseModal from "../lib/ExpertiseModal";
import AuthorReputationSection from "../lib/AuthorReputationSection";
import Tooltip from "@mui/material/Tooltip";
import RHLogo from "~/components/Home/RHLogo";

const REP_GAUGES_TO_SHOW = 3;

const getTooltipContent = () => {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <div>
        <div className={css(styles.tooltipRhLogo)}>
          <RHLogo withText={true} iconStyle={styles.rhIcon} />
        </div>
        <p className={css(styles.tooltipParagraph)}>
          Your reputation is based on <strong>various factors</strong> such as
          upvotes, citations, and peer reviews. You reputation will be improved
          by:
        </p>
        <ul className={css(styles.tooltipList)}>
          <li className={css(styles.tooltipListItem)}>
            Receiving more upvotes on your content
          </li>
          <li className={css(styles.tooltipListItem)}>
            Peer-reviewing publications
          </li>
          <li className={css(styles.tooltipListItem)}>
            Getting cited by other authors
          </li>
        </ul>
        <p className={css(styles.tooltipParagraph)}>
          We are regularly updating our reputation algorithm to make it fair and
          accurate.
        </p>
      </div>
    </div>
  );
};

const AuthorHeaderExpertise = ({ profile }: { profile: FullAuthorProfile }) => {
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);

  return (
    <div className={css(styles.sectionWrapper)}>
      <ExpertiseModal
        profile={profile}
        isModalOpen={isExpertiseModalOpen}
        handleModalClose={() => setIsExpertiseModalOpen(false)}
      />
      <div className={css(styles.repWrapper)}>
        <AuthorReputationSection
          limit={REP_GAUGES_TO_SHOW}
          reputationList={profile.reputationList}
        />
      </div>
      <div className={css(styles.links)}>
        <div
          className={css(styles.showMore, styles.link)}
          onClick={() => setIsExpertiseModalOpen(true)}
        >
          Show more
        </div>
        <div className={css(styles.divider)}></div>

        <Tooltip
          title={getTooltipContent()}
          componentsProps={{
            tooltip: {
              sx: {
                padding: "10px 20px",
                fontSize: 14,
                bgcolor: colors.LIGHTER_GREY(),
                fontWeight: 400,
                color: colors.BLACK(1.0),
              },
            },
          }}
        >
          <div className={css(styles.link)}>How is this calculated?</div>
        </Tooltip>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  tooltipParagraph: {
    fontSize: 14,
    lineHeight: "20px",
  },
  tooltipRhLogo: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${colors.BLACK(0.1)}`,
  },
  tooltipList: {
    fontSize: 14,
    lineHeight: "20px",
    listStylePosition: "outside",
    paddingLeft: 20,
  },
  tooltipListItem: {
    fontSize: 14,
    lineHeight: "20px",
  },
  rhIcon: {},
  sectionWrapper: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  repWrapper: {},
  links: {
    display: "flex",
    marginTop: 5,
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
    },
  },
  showMore: {
    marginTop: 10,
    marginLeft: 0,
  },
});

export default AuthorHeaderExpertise;
