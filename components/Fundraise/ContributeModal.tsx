import { StyleSheet, css } from "aphrodite";
import numeral from "numeral";
import React, { ReactElement, cloneElement, useState } from "react";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import {
  FUND_DEFAULT_AMOUNT,
  FUND_MAX_RSC_REQUIRED,
  FUND_MIN_RSC_REQUIRED,
  FUND_RH_PERCENTAGE,
} from "./lib/constants";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import BaseModal from "../Modals/BaseModal";
import colors from "~/config/themes/colors";
import Button from "../Form/Button";
import { useExchangeRate } from "../contexts/ExchangeRateContext";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import ReactTooltip from "react-tooltip";
import {
  formatBalance,
  onKeyDownNumInput,
  onPasteNumInput,
} from "~/config/utils/form";
import { createFundraiseContributionApi } from "./api/contributions";
import { MessageActions } from "~/redux/message";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { breakpoints } from "~/config/themes/screen";
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons";
import { useRefreshUserBalance } from "~/config/hooks/useRefreshUserBalance";
import { Fundraise } from "./lib/types";
const { setMessage, showMessage } = MessageActions;

const calcResearchHubAmount = ({ offeredAmount }) => {
  if (offeredAmount === 0) {
    return 0;
  }
  return parseFloat(((FUND_RH_PERCENTAGE / 100) * offeredAmount).toFixed(10));
};

const calcTotalAmount = ({ offeredAmount }) => {
  if (isNullOrUndefined(offeredAmount) || isEmpty(offeredAmount)) {
    return 0;
  }
  return (
    parseFloat(offeredAmount + "") + calcResearchHubAmount({ offeredAmount })
  );
};

export type ContributeModalProps = {
  fundraise: Fundraise;
  triggerComponent: ReactElement;
  onUpdateFundraise: (fundraise: any) => void;
};

const FundraiseContributeModal = ({
  fundraise,
  triggerComponent,
  onUpdateFundraise,
}: ContributeModalProps): ReactElement => {
  const [value, setValue] = useState(FUND_DEFAULT_AMOUNT);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [updatedFundraise, setUpdatedFundraise] = useState<Fundraise | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState<"FORM" | "SUCCESS">("FORM");

  const dispatch = useDispatch();
  const user = useCurrentUser();
  const { rscToUSDDisplay } = useExchangeRate();
  const refreshBalance = useRefreshUserBalance();

  const researchHubAmount = calcResearchHubAmount({ offeredAmount: value });
  const totalAmount = calcTotalAmount({ offeredAmount: value });
  const hasMinRscError =
    value < 10 ||
    (!isNullOrUndefined(user) &&
      !isNullOrUndefined(user!.balance) &&
      user!.balance! < totalAmount);
  const hasMaxRscError = value > FUND_MAX_RSC_REQUIRED;

  const handleOpen = () => {
    // reset state
    setValue(FUND_DEFAULT_AMOUNT);
    setError(false);
    setIsSubmitting(false);
    setPage("FORM");
    setUpdatedFundraise(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (updatedFundraise) {
      // we got an updated fundraise object that we have yet to propogate to the parent
      // so do that now.

      // The reason why we don't do it right away after the successfuly API response is that
      // it causes the modal to close before seeing the success message.
      // And it also looks weird to have the page update in the background while the modal is still open.
      onUpdateFundraise(updatedFundraise);
    }
    setIsOpen(false);
  };

  const handleInput = (e) => {
    const { value } = e.target;
    if (value < 0) {
      setError(true);
    } else {
      setError(false);
    }
    setValue(value);
  };

  const confirmTransaction = () => {
    if (hasMinRscError || error) {
      dispatch(setMessage("Not enough coins in balance"));
      dispatch(
        showMessage({
          show: true,
          clickoff: true,
          error: true,
        } as any)
      );
    }
    if (value === 0) {
      dispatch(setMessage("Must spend at least 1 RSC"));
      dispatch(
        showMessage({
          show: true,
          clickoff: true,
          error: true,
        } as any)
      );
      return;
    }

    sendTransaction();
  };

  const sendTransaction = async () => {
    setIsSubmitting(true);

    try {
      const { fundraise: updated } = await createFundraiseContributionApi({
        fundraiseId: fundraise.id,
        amount: value,
      });
      if (!isNullOrUndefined(updated)) {
        setUpdatedFundraise(updated as Fundraise);
      }
      setPage("SUCCESS");
    } catch (err) {
      if (err && (err as any).message) {
        dispatch(setMessage((err as any).message));
      } else {
        dispatch(setMessage("Something went wrong."));
      }
      dispatch(showMessage({ show: true, error: true } as any));
    } finally {
      setIsSubmitting(false);
      try {
        await refreshBalance();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const triggerComponentWithOnClick = cloneElement(triggerComponent, {
    onClick: () => handleOpen(),
  });

  return (
    <>
      {triggerComponentWithOnClick}
      <BaseModal
        isOpen={isOpen}
        closeModal={handleClose}
        modalStyle={styles.modalStyle}
        modalContentStyle={styles.modalContentStyle}
        title={page === "FORM" ? `Support Fundraise` : null}
      >
        {page === "FORM" && (
          <div className={css(styles.content)}>
            <ReactTooltip
              id="commission"
              effect="solid"
              className={css(bountyTooltip.tooltipContainer)}
              delayShow={150}
            >
              <div className={css(bountyTooltip.bodyContainer)}>
                <div className={css(bountyTooltip.desc)}>
                  <div>
                    • 2% of bounty amount will be used to support the
                    ResearchHub Community
                  </div>
                  <div>
                    • 7% of bounty amount will be paid to ResearchHub Inc
                  </div>
                </div>
              </div>
            </ReactTooltip>
            <ReactTooltip
              id="net"
              effect="solid"
              className={css(
                bountyTooltip.tooltipContainer,
                bountyTooltip.tooltipContainerSmall
              )}
              delayShow={150}
            >
              <div className={css(bountyTooltip.bodyContainer)}>
                <div className={css(bountyTooltip.desc)}>
                  Amount including fees
                </div>
              </div>
            </ReactTooltip>
            <div className={css(styles.lineItem, styles.balanceLine)}>
              <div className={css(styles.lineItemText, styles.balanceText)}>
                Current Balance
              </div>
              <div className={css(styles.lineItemValue, styles.balanceValue)}>
                <span className={css(styles.valueNumber)}>
                  <span>
                    {formatBalance(
                      Math.floor(
                        !isNullOrUndefined(user) &&
                          !isNullOrUndefined(user!.balance)
                          ? user!.balance!
                          : 0
                      )
                    )}
                  </span>
                  <img
                    src={"/static/icons/coin-filled.png"}
                    draggable={false}
                    className={css(styles.coinIcon)}
                    alt="RSC Coin"
                  />
                </span>
              </div>
            </div>
            <div
              className={css(
                styles.lineItem,
                styles.balanceLine,
                styles.borderBottom
              )}
            >
              <div className={css(styles.lineItemText, styles.balanceText)}>
                Remaining until fundraise goal
              </div>
              <div className={css(styles.lineItemValue, styles.balanceValue)}>
                <span className={css(styles.valueNumber)}>
                  <span>
                    {formatBalance(
                      Math.ceil(
                        fundraise.goalAmount.rsc - fundraise.amountRaised.rsc
                      )
                    )}
                  </span>
                  <img
                    src={"/static/icons/coin-filled.png"}
                    draggable={false}
                    className={css(styles.coinIcon)}
                    alt="RSC Coin"
                  />
                </span>
              </div>
            </div>
            <div className={css(styles.lineItem, styles.offeringLine)}>
              <div className={css(styles.lineItemText, styles.offeringText)}>
                I am contributing
              </div>
              <div className={css(styles.lineItemValue, styles.offeringValue)}>
                <span className={css(styles.valueNumber, styles.valueInInput)}>
                  <input
                    className={css(styles.input, error && styles.error)}
                    type="number"
                    min={"0"}
                    value={value}
                    onChange={handleInput}
                    pattern="\d*"
                    onKeyDown={onKeyDownNumInput}
                    onPaste={onPasteNumInput}
                  />
                </span>
                <span className={css(styles.rscText)}>RSC</span>
              </div>
            </div>

            <div className={css(styles.lineItem, styles.platformFeeLine)}>
              <div className={css(styles.lineItemText)}>
                Platform Fee ({FUND_RH_PERCENTAGE}%){` `}
                <span
                  className={css(styles.tooltipIcon)}
                  data-tip={""}
                  data-for="commission"
                >
                  {<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>}
                </span>
              </div>
              <div className={css(styles.lineItemValue)}>
                <span className={css(styles.valueNumber)}>
                  <span>+ {researchHubAmount.toLocaleString()}</span>
                </span>
                <span className={css(styles.rscText)}>RSC</span>
              </div>
            </div>

            <div className={css(styles.lineItem, styles.netAmountLine)}>
              <ReactTooltip effect="solid" />
              <div className={css(styles.lineItemText)}>
                Total
                <span
                  className={css(styles.tooltipIcon)}
                  data-tip={""}
                  data-for="net"
                >
                  {<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>}
                </span>
              </div>
              <div className={css(styles.lineItemValue, styles.netAmountValue)}>
                <span className={css(styles.valueNumber)}>
                  <span>{totalAmount.toLocaleString()}</span>
                  <ResearchCoinIcon width={20} height={20} />
                </span>
                <span className={css(styles.rscText)}>RSC</span>
              </div>
            </div>
            <div className={css(styles.usdValue)}>
              ≈ {rscToUSDDisplay(totalAmount)}{" "}
              <span style={{ marginLeft: 22 }}>USD</span>
            </div>
            <div className={css(styles.buttonRow)}>
              {hasMinRscError ? (
                <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                  {!isNullOrUndefined(user) &&
                  !isNullOrUndefined(user!.balance) &&
                  user!.balance! < totalAmount
                    ? `Your RSC balance is below ${numeral(totalAmount).format(
                        "0[,]0[.]00"
                      )}`
                    : `Minimum fund amount is ${FUND_MIN_RSC_REQUIRED} RSC`}
                </div>
              ) : hasMaxRscError ? (
                <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                  Contribution amount cannot exceed 1,000,000 RSC
                </div>
              ) : (
                <div />
              )}
              <Button
                label={
                  isSubmitting ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: "28px",
                      }}
                    >
                      <ClipLoader
                        sizeUnit={"px"}
                        size={18}
                        color={"#fff"}
                        loading={true}
                      />
                    </div>
                  ) : (
                    "Submit"
                  )
                }
                onClick={confirmTransaction}
                disabled={isSubmitting || hasMinRscError || hasMaxRscError}
              />
            </div>
          </div>
        )}
        {page === "SUCCESS" && (
          <div className={css(styles.successContainer)}>
            <div className={css(styles.successHeader)}>
              <FontAwesomeIcon
                icon={faCircleCheck}
                fontSize={26}
                className={css(styles.successIcon)}
              />
              <h2 className={css(styles.successTitle)}>
                Contribution Submitted
              </h2>
            </div>
            <div className={css(styles.successSubtitle)}>
              Thank you for supporting open science on ResearchHub.
            </div>
            <div className={css(styles.successButtonContainer)}>
              <Button label="Close" variant="contained" onClick={handleClose} />
            </div>
          </div>
        )}
      </BaseModal>
    </>
  );
};

const alertStyles = StyleSheet.create({
  alert: {
    fontSize: 14,
    textAlign: "left",
    color: colors.DARKER_GREY(),
  },
  rscAlert: {
    color: colors.RED(),
  },
  previewAlert: {},
});

const bountyTooltip = StyleSheet.create({
  tooltipContainer: {
    textAlign: "left",
    width: 300,
    padding: 12,
  },
  tooltipContainerSmall: {
    width: "auto",
  },
  bodyContainer: {},
  title: {
    textAlign: "center",
    color: "white",
    fontWeight: 500,
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    lineHeight: "20px",
  },
});

const styles = StyleSheet.create({
  modalStyle: {
    maxWidth: 500,

    "@media only screen and (min-width: 768px)": {
      width: 500,
    },
  },
  modalContentStyle: {
    padding: 40,
    maxWidth: 550,
    "@media only screen and (max-width: 767px)": {
      padding: 40,
      minWidth: "unset",
      width: "100%",
    },
    "@media only screen and (max-width: 415px)": {
      padding: 40,
      paddingTop: 50,
    },
  },
  content: {
    width: "100%",
    opacity: 1,
    transition: "all ease-in-out 0.2s",
    position: "relative",
    paddingTop: 40,
    "@media only screen and (max-width: 557px)": {
      boxSizing: "border-box",
    },
  },
  transition: {
    opacity: 0,
  },
  description: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 22,
    width: "100%",
    fontWeight: 400,
    color: "#4f4d5f",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
    },
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxSizing: "border-box",
    padding: "20px 0",
  },
  networkContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    transition: "all ease-in-out 0.3s",
    marginTop: 20,
  },
  borderBottom: {
    borderBottom: ".1rem dotted #e7e6e4",
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 20,
    marginBottom: 16,
  },
  border: {
    borderBottom: ".1rem dotted #e7e6e4",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    boxSizing: "border-box",
    width: "100%",
  },
  left: {
    width: "80%",
  },
  right: {
    width: "40%",
    alignItems: "flex-end",
    height: "100%",
  },
  amountContainer: {
    justifyContent: "space-between",
    position: "relative",
    minHeight: 60,
  },
  mainHeader: {
    fontWeight: 500,
    fontSize: 22,
    color: "#000 ",
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  icon: {
    color: colors.GREEN(1),
    marginLeft: 5,
  },
  mobileCenter: {
    paddingTop: 10,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
  center: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  numbers: {
    alignItems: "flex-end",
  },
  input: {
    width: 80,
    marginRight: "-8px",
    textAlign: "right",
    padding: "5px 7px",
    borderRadius: 2,
    border: `1px solid rgb(229 229 230)`,
    background: "#FBFBFD",
    fontSize: 16,
    [`[type="number"]`]: {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  error: {
    borderColor: "red",
  },
  title: {
    fontSize: 19,
    color: "#2a2825",
    fontWeight: 500,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#82817d",
    display: "flex",
    alignItems: "center",
    // fontWeight: 500
  },
  instruction: {
    color: "#83817c",
    fontSize: 14,
    marginBottom: 25,
    fontFamily: "Roboto",
    textAlign: "center",
    whiteSpace: "pre-wrap",
  },
  label: {
    marginBottom: 0,
    marginRight: 5,
    fontSize: 18,
  },
  button: {
    width: "unset",
    height: "unset",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 16px",
    "@media only screen and (max-width: 767px)": {
      margin: "10px 0",
    },
  },
  buttonLabel: {
    display: "flex",
  },
  blue: {
    color: colors.BLUE(),
  },
  text: {
    fontSize: 18,
    color: "#82817d",
    fontWeight: 500,
  },
  userBalance: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  coinIcon: {
    height: 20,
    marginLeft: 5,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 15,
    cursor: "pointer",
    color: "#A5A5A5",
    fontSize: 20,
    ":hover": {
      color: "#000",
    },
  },
  connectStatus: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    margin: "15px 0",
  },
  dot: {
    height: 10,
    maxHeight: 10,
    minHeight: 10,
    width: 10,
    maxWidth: 10,
    minWidth: 10,
    borderRadius: "50%",
    marginRight: 5,
    backgroundColor: "#f9f4d3",
    border: "2px solid #f8de5a",
  },
  connected: {
    backgroundColor: "#d5f3d7",
    border: "2px solid #7ae9b1",
  },
  formInput: {
    width: "100%",
    margin: 0,
    minHeight: "unset",
    paddingBottom: 10,
  },
  infoIcon: {
    marginLeft: 5,
    cursor: "pointer",
    color: "#DFDFDF",
  },
  inputLabel: {
    paddingBottom: 10,
  },
  successIcon: {
    color: colors.NEW_GREEN(),
    fontSize: 26,
    marginRight: 8,
  },
  errorIcon: {
    color: colors.RED(1),
  },
  image: {
    objectFit: "contain",
    width: 250,
  },
  confirmation: {
    color: "#000",
    marginBottom: 10,
  },
  transactionHashLink: {
    cursor: "pointer",
    color: colors.BLUE(1),
    ":hover": {
      textDecoration: "underline",
    },
  },
  marginLeft: {
    marginLeft: 5,
    textDecoration: "unset",
  },
  toggleContainer: {
    width: "100%",
    display: "flex",
    // justifyContent: "flex-end",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  toggleContainerOnChain: {
    marginTop: 0,
  },
  toggle: {
    color: "rgba(36, 31, 58, 0.6)",
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: 14,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  toggleRight: {
    marginLeft: 5,
  },
  activeToggle: {
    background: "#eaebfe",
    borderRadius: 4,
    color: colors.BLUE(),
  },
  errorMsg: {
    fontSize: 14,
    color: colors.RED(),
  },

  lineItem: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  lineItemValue: {
    display: "flex",
    width: 150,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lineItemText: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
  },
  balanceLine: {
    paddingBottom: 20,
    marginBottom: 0,
  },
  balanceText: {
    // fontWeight: 500,
    color: colors.DARKER_GREY(),
  },
  balanceValue: {
    alignItems: "center",
    color: colors.DARKER_GREY(),
  },
  offeringLine: {
    // marginBottom: 7,
  },
  offeringText: {
    fontWeight: 500,
  },
  offeringValue: {
    alignItems: "center",
  },
  valueNumber: {
    width: 100,
    textAlign: "right",
    display: "flex",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  valueInInput: {
    paddingRight: 0,
  },
  platformFeeLine: {
    color: colors.DARKER_GREY(),
    marginBottom: 20,
  },
  netAmountLine: {
    paddingTop: 16,
    borderTop: `2px solid rgb(229 229 230)`,
    fontWeight: 500,
    marginBottom: 0,
  },
  netAmountValue: {
    fontWeight: 500,
  },
  usdValue: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
    color: colors.LIGHT_GREY_TEXT,
  },
  tooltipIcon: {
    fontSize: 16,
    color: colors.DARKER_GREY(),
    marginLeft: 5,
    cursor: "pointer",
  },
  rscText: {
    fontWeight: 500,
    marginLeft: 16,
    display: "block",
    color: colors.BLACK(),
  },

  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "unset",
    },
  },
  successHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 0,
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.MEDIUM_GREY(),
    marginTop: 16,
    textAlign: "left",
    width: "100%",
  },
  successButtonContainer: {
    marginTop: 16,
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    transform: "translateY(16px)",
  },
});

export default FundraiseContributeModal;
