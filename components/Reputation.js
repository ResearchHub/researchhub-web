import { StyleSheet, css } from "aphrodite";
import numeral from "numeral";

import ReputationTooltip from "./ReputationTooltip";

const Reputation = (props) => {
  const { reputation } = props;
  return (
    <div
      className={css(styles.reputationContainer)}
      data-tip
      data-for="reputationTooltip"
    >
      <div className={css(styles.reputationValue)}>
        {reputation < 1000 ? reputation : numeral(reputation).format("0.0A")}
      </div>
      <img src={"/static/icons/coin.png"} />
      <ReputationTooltip />
    </div>
  );
};

const styles = StyleSheet.create({
  reputationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  reputationValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default Reputation;
