import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";
import { Fragment } from "react";

const ReputationTooltip = (props) => {
  return (
    <Fragment>
      {process.browser && (
        <ReactTooltip
          id="reputationTooltip"
          className={css(styles.tooltip)}
          place="bottom"
          effect="solid"
          delayShow={500}
        >
          <div className={css(styles.comingSoon)}>
            Currently on Testnet
            <img
              className={css(styles.icon)}
              src={"/static/icons/coin-filled.png"}
            />
          </div>
          <div className={css(styles.paragraph, styles.description)}>
            Earn research coins by participating in discussion, uploading
            papers, upvoting papers, and updating summaries / adding notes to
            papers.
          </div>
          <div className={css(styles.description)}>
            With the research coins, you can put them towards funding areas of
            research or pull them out to an exchange as needed.
          </div>
        </ReactTooltip>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    width: 345,
    padding: 15,
    fontSize: 14,
    // background: colors.BLUE(1),
    background: "rgba(0, 0, 0, 0.7)",
    opacity: 1,
  },
  paragraph: {
    marginBottom: 10,
  },
  description: {
    opacity: 1,
    lineHeight: 1.6,
  },
  comingSoon: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginLeft: 5,
    height: 20,
  },
});

export default ReputationTooltip;
