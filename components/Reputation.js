import { StyleSheet, css } from "aphrodite";
import numeral from "numeral";
import { useDispatch, useStore, connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useState, useEffect } from "react";
import ReputationTooltip from "./ReputationTooltip";
import colors from "~/config/themes/colors";

const Reputation = (props) => {
  const { reputation, balance, showBalance } = props;
  const dispatch = useDispatch();
  const [count, setBalance] = useState(balance);

  useEffect(() => {
    setBalance(count);
  }, [balance]);

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
        {numeral(showBalance ? count : reputation).format("0,0")}
      </div>
      <img src={"/static/icons/coin.png"} draggable={false} />
      <ReputationTooltip />
    </div>
  );
};

const styles = StyleSheet.create({
  reputationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  reputationValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});

const mapStateToProps = (state) => {
  return {
    balance: state.auth.user.balance,
  };
};
export default connect(
  mapStateToProps,
  null
)(Reputation);
