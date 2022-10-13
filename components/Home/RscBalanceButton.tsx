import { StyleSheet, css } from "aphrodite";
import { useDispatch, connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useState, useEffect, SyntheticEvent, ReactElement } from "react";
import ReputationTooltip from "~/components/ReputationTooltip";
import { getNumberWithCommas } from "~/config/utils/getNumberWithCommas";

/* intentionally using legacy redux wrap to ensure it make unintended behavior in server */
type Props = { auth?: any /* redux */ };

const RscBalanceButton = ({ auth }: Props): ReactElement => {
  const dispatch = useDispatch();
  const { balance, should_display_rsc_balance_home } = auth?.user ?? {};
  const [_prevCount, _setPrevCount] = useState(balance);
  const [_count, setBalance] = useState(balance);
  const [_transition, setTransition] = useState(true);
  const [shouldDisplayBalanceHome, setShouldDisplayBalanceHome] =
    useState<boolean>(should_display_rsc_balance_home ?? true);

  useEffect(() => {
    if (auth?.isFetchingUser) {
      setTransition(true);
    }
    if (!auth?.isFetchingUser && Boolean(balance)) {
      setBalance(balance);
      setTimeout(() => {
        setTransition(false);
      }, 200);
      setShouldDisplayBalanceHome(should_display_rsc_balance_home ?? true);
    }
  }, [auth, balance, should_display_rsc_balance_home]);

  return (
    <div
      className={css(styles.rscBalanceButtonContainer)}
      data-tip="" /* necessary for ReputationTooltip */
      data-for="reputation-tool-tip"
      onClick={(event: SyntheticEvent): void => {
        event.preventDefault();
        dispatch(ModalActions.openWithdrawalModal(true));
      }}
    >
      <ReputationTooltip />
      <img
        src={"/static/icons/coin-filled.png"}
        draggable={false}
        className={css(styles.coinIcon)}
        alt="RSC Coin"
      />
      {shouldDisplayBalanceHome && (
        <span className={css(styles.balanceText)}>
          {getNumberWithCommas(Math.floor(balance ?? 0))}
        </span>
      )}
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
  balanceText: { fontSize: 16, fontWeight: 400, marginLeft: 6 },
  blur: {
    filter: "blur(2px)",
  },
  coinIcon: {
    height: 17,
    width: 17,
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(RscBalanceButton);
