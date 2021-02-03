import { StyleSheet, css } from "aphrodite";
import numeral from "numeral";
import { useDispatch, connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useState, useEffect } from "react";
import ReputationTooltip from "./ReputationTooltip";

const Reputation = (props) => {
  const { reputation, balance, showBalance, auth } = props;
  const dispatch = useDispatch();
  const [prevCount, setPrevCount] = useState(balance);
  const [count, setBalance] = useState(balance);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    if (balance !== undefined && balance !== null) {
      let { auth } = props;
      if (auth.isFetchingUser) {
        setTransition(true);
      }
      if (!auth.isFetchingUser) {
        setBalance(balance);
        setTimeout(() => {
          setTransition(false);
        }, 200);
      }
    }
  }, [balance]);

  function openWithdrawalModal(e) {
    e.stopPropagation();
    dispatch(ModalActions.openWithdrawalModal(true));
  }

  return (
    <div
      className={css(styles.reputationContainer)}
      data-tip={""}
      data-for="reputationTooltip"
      onClick={openWithdrawalModal}
    >
      <div className={css(styles.reputationValue)}>
        {transition
          ? numeral(prevCount).format("0,0")
          : numeral(showBalance ? count : reputation).format("0,0")}
      </div>
      <img
        src={"/static/icons/coin-filled.png"}
        draggable={false}
        className={css(styles.coinIcon)}
        alt="RSC Coin"
      />
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
    minWidth: 18.5,
    textAlign: "right",
    "@media only screen and (max-width: 900px)": {
      fontSize: 14,
      marginRight: 5,
    },
  },
  blur: {
    filter: "blur(2px)",
  },
  coinIcon: {
    height: 25,
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
    "@media only screen and (max-width: 900px)": {
      height: 20,
    },
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  balance: state.auth.user.balance,
});

export default connect(
  mapStateToProps,
  null
)(Reputation);
