import { StyleSheet, css } from "aphrodite";
import { useDispatch, connect } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useState, useEffect, SyntheticEvent, ReactElement } from "react";
import ReputationTooltip from "~/components/ReputationTooltip";
import { getNumberWithCommas } from "~/config/utils/getNumberWithCommas";
import { useRouter } from "next/router";
import { postLastTimeClickedRscTab } from "./api/postLastTimeClickedRscTab";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import { getCurrentUser } from "~/config/utils/getCurrentUser";

/* intentionally using legacy redux wrap to ensure it make unintended behavior in server */
type Props = { auth?: any /* redux */ };

const RscBalanceButton = ({ auth }: Props): ReactElement => {
  const dispatch = useDispatch();
  const router = useRouter();
  const tabname = router?.query?.tabName;
  const currentUser = getCurrentUser();
  const rscDeltaSinceSeen = currentUser?.balance_history ?? 0;
  const { balance, should_display_rsc_balance_home } = auth?.user ?? {};
  const [_prevCount, _setPrevCount] = useState(balance);
  const [_count, setBalance] = useState(balance);
  const [_transition, setTransition] = useState(true);
  const [shouldDisplayBalanceHome, setShouldDisplayBalanceHome] =
    useState<boolean>(should_display_rsc_balance_home ?? true);
  const [shouldDisplayRscDelta, setShouldDisplayRscDelta] = useState<boolean>(
    rscDeltaSinceSeen !== 0
  );

  useEffect((): void => {
    if (tabname?.includes("rsc")) {
      setShouldDisplayRscDelta(false);
      postLastTimeClickedRscTab({
        onSuccess: (): void => {
          setShouldDisplayRscDelta(false);
        },
        onError: emptyFncWithMsg,
      });
    } else {
      setShouldDisplayRscDelta(rscDeltaSinceSeen !== 0);
    }
  }, [tabname, rscDeltaSinceSeen]);

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
      {shouldDisplayRscDelta && (
        <div
          className={css(styles.rscDelta)}
          onClick={(event: SyntheticEvent): void => {
            event?.stopPropagation(); // prevents button click
            router.push(`/user/${currentUser.id}/rsc`);
          }}
        >{`+ ${getNumberWithCommas(Math.floor(rscDeltaSinceSeen))}`}</div>
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
  balanceText: { fontSize: 14, fontWeight: 400, marginLeft: 6 },
  blur: {
    filter: "blur(2px)",
  },
  coinIcon: {
    height: 18,
    width: 18,
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
  },
  rscDelta: {
    background: colors.LIGHT_GREEN(0.5),
    color: colors.PASTEL_GREEN_TEXT,
    padding: 4,
    top: -12,
    right: -24,
    fontSize: 12,
    fontWeight: 400,
    display: "flex",
    position: "absolute",
    borderRadius: 8,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(RscBalanceButton);
