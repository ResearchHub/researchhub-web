import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { connect } from "react-redux";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { postLastTimeClickedRscTab } from "./api/postLastTimeClickedRscTab";
import { StyleSheet, css } from "aphrodite";
import { formatBalance } from "~/config/utils/form";
import { useRouter } from "next/router";
import { useState, useEffect, SyntheticEvent, ReactElement } from "react";
import colors, { mainNavIcons } from "~/config/themes/colors";

import ResearchHubPopover from "../ResearchHubPopover";
import RscBalanceHistoryDropContent from "./RscBalanceHistoryDropContent";
import { breakpoints } from "~/config/themes/screen";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";

/* intentionally using legacy redux wrap to ensure it make unintended behavior in server */
type Props = { auth?: any /* redux */ };

const RscBalanceButton = ({ auth }: Props): ReactElement => {
  const router = useRouter();
  const tabname = router?.query?.tabName;
  const currentUser = getCurrentUser();
  const rscDeltaSinceSeen = currentUser?.balance_history ?? 0;
  const { balance, should_display_rsc_balance_home } = auth?.user ?? {};

  const [_count, setBalance] = useState(balance);
  const [_prevCount, _setPrevCount] = useState(balance);
  const [_transition, setTransition] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [shouldDisplayBalanceHome, setShouldDisplayBalanceHome] =
    useState<boolean>(should_display_rsc_balance_home ?? true);
  const [shouldDisplayRscDelta, setShouldDisplayRscDelta] = useState<boolean>(
    rscDeltaSinceSeen > 0
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
      setShouldDisplayRscDelta(rscDeltaSinceSeen > 0);
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
    <ResearchHubPopover
      align="end"
      containerStyle={{
        zIndex: 6,
      }}
      isOpen={isPopoverOpen}
      onClickOutside={(_event): void => setIsPopoverOpen(false)}
      positions={["bottom"]}
      popoverContent={
        <RscBalanceHistoryDropContent
          closeDropdown={(): void => setIsPopoverOpen(false)}
        />
      }
      targetContent={
        <div
          className={css(styles.rscBalanceButtonContainer)}
          data-tip={""} /* necessary for ReputationTooltip */
          data-for={"reputation-tool-tip"}
          onClick={(_event: SyntheticEvent): void => {
            setIsPopoverOpen(!isPopoverOpen);
            postLastTimeClickedRscTab({
              onError: emptyFncWithMsg,
              onSuccess: (): void => setShouldDisplayRscDelta(false),
            });
          }}
        >
          {/* {!isPopoverOpen && <ReputationTooltip />} */}
          <ResearchCoinIcon
            version={4}
            height={20}
            width={20}
            color={colors.ORANGE_DARK()}
          />
          {shouldDisplayBalanceHome && (
            <div className={css(styles.balanceText)}>
              {formatBalance(Math.floor(balance ?? 0))} RSC
            </div>
          )}
          {shouldDisplayRscDelta && (
            <div className={css(styles.rscDelta)}>{`+ ${formatBalance(
              Math.floor(rscDeltaSinceSeen)
            )}`}</div>
          )}
          <div className={css(styles.caretDown)}>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
      }
    />
  );
};

const styles = StyleSheet.create({
  rscBalanceButtonContainer: {
    alignItems: "center",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    margin: "-1px 0px 0 0",
    padding: 7,
    userSelect: "none",
    position: "relative",
  },
  balanceText: {
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 6,
    whiteSpace: "nowrap",
    color: colors.ORANGE_DARK(),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  blur: {
    filter: "blur(2px)",
  },
  coinIcon: {
    height: 20,
    width: 20,
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(185, 185, 185, 0.25)",
  },
  rscDelta: {
    // background: colors.BLUE(1),
    // color: "white",
    background: colors.LIGHT_GREEN(0.5),
    color: colors.PASTEL_GREEN_TEXT,
    padding: 4,
    top: -6,
    right: -8,
    fontSize: 10,
    fontWeight: 600,
    zIndex: 2,
    display: "flex",
    position: "absolute",
    borderRadius: "50px",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.14)",
  },
  usdAmount: {
    fontSize: 12,
    color: colors.LIGHT_GREY_TEXT,
    position: "absolute",
    bottom: -8,
    right: 24,
  },
  caretDown: { marginLeft: 4, fontSize: 12, color: colors.ORANGE_DARK2() },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(RscBalanceButton);
