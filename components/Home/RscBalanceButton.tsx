import { StyleSheet, css } from "aphrodite";
import { useDispatch, connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useState, useEffect, SyntheticEvent, ReactElement } from "react";
import ReputationTooltip from "~/components/ReputationTooltip";

type Props = { auth?: any /* redux */; balance?: any /* redux */ };

const RscBalanceButton = ({ auth, balance }: Props): ReactElement => {
  const dispatch = useDispatch();
  const [_prevCount, _setPrevCount] = useState(balance);
  const [_count, setBalance] = useState(balance);
  const [_transition, setTransition] = useState(true);

  useEffect(() => {
    if (balance !== undefined && balance !== null) {
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
  }, [balance, auth]);

  return (
    <div
      className={css(styles.rscBalanceButtonContainer)}
      data-for="reputationTooltip"
      onClick={(event: SyntheticEvent): void => {
        event.stopPropagation();
        dispatch(ModalActions.openWithdrawalModal(true));
      }}
    >
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
  rscBalanceButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  blur: {
    filter: "blur(2px)",
  },
  coinIcon: {
    height: 20,
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

export default connect(mapStateToProps, null)(RscBalanceButton);
