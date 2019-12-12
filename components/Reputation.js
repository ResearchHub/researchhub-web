import { StyleSheet, css } from "aphrodite";
import numeral from "numeral";
import { useDispatch, useStore } from "react-redux";
import { ModalActions } from "~/redux/modals";

import ReputationTooltip from "./ReputationTooltip";

const Reputation = (props) => {
  const { reputation } = props;
  const dispatch = useDispatch();

  function openTransactionModal(e) {
    e.stopPropagation();
    dispatch(ModalActions.openTransactionModal(true));
  }

  return (
    <div
      className={css(styles.reputationContainer)}
      data-tip
      data-for="reputationTooltip"
      onClick={openTransactionModal}
    >
      <div className={css(styles.reputationValue)}>
        {numeral(reputation).format("0,0")}
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
