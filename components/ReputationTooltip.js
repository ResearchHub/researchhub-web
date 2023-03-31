import { Fragment, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactTooltip from "react-tooltip";
import colors from "~/config/themes/colors";

const ReputationTooltip = (props) => {
  const [showReputationTooltip, setShowReputationTooltip] = useState(false);

  useEffect(() => {
    setShowReputationTooltip(true);
  }, []);
  return (
    <Fragment>
      {showReputationTooltip && (
        <ReactTooltip
          id="reputation-tool-tip"
          className={css(styles.tooltip)}
          place="bottom"
          effect="solid"
          delayShow={500}
        >
          <div className={css(styles.paragraph, styles.description)}>
            {
              "Earn ResearchCoin by discussing papers, answering bounties or referring contributors to our platform."
            }
          </div>
        </ReactTooltip>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    width: 250,
    padding: 15,
    fontSize: 14,
    // background: colors.BLUE(1),
    background: "rgba(0, 0, 0, 1)",
    opacity: 1,
    boxSizing: "border-box",
  },
  paragraph: {
    // marginBottom: 10,
  },
  description: {
    opacity: 1,
    lineHeight: 1.6,
  },
  center: {
    textAlign: "center",
  },
  comingSoon: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 10,
    display: "flex",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 5,
    height: 18,
  },
  settingsInfo: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    padding: 8,
    marginTop: 16,
    borderRadius: 4,
    width: "95%",
    background: "#fff",
    color: colors.BLACK(),
    fontWeight: 300,
    fontSize: 12,
  },
});

export default ReputationTooltip;
