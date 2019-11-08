import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";

import colors from "~/config/themes/colors";
const ReputationTooltip = (props) => {
  return (
    <ReactTooltip
      id="reputationTooltip"
      className={css(styles.tooltip)}
      place="right"
      effect="solid"
      delayShow={500}
    >
      <div className={css(styles.comingSoon)}>Coming Soon</div>
      <div className={css(styles.paragraph, styles.description)}>
        Earn research coins by participating in discussion, uploading papers,
        upvoting papers, and updating summaries / adding notes to papers.
      </div>
      <div className={css(styles.description)}>
        With the research coins, you can put them towards funding areas of
        research or pull them out to an exchange as needed.
      </div>
    </ReactTooltip>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    width: 348,
    padding: 15,
    fontSize: 14,
    background: colors.BLUE(1),
    opacity: 1,
  },
  paragraph: {
    marginBottom: 10,
  },
  description: {
    opacity: 0.8,
  },
  comingSoon: {
    fontSize: 25,
    fontWeight: 500,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ReputationTooltip;
