import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/pro-solid-svg-icons";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { BOUNTY_RH_PERCENTAGE, MAX_RSC_REQUIRED, MIN_RSC_REQUIRED } from "./config/constants";
import { trackEvent } from "~/config/utils/analytics";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState, useEffect, SyntheticEvent } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import BountySuccessScreen from "./BountySuccessScreen";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import { WarningIcon } from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";
import numeral from "numeral";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { Hub } from "~/config/types/hub";

import "react-step-progress-bar/styles.css";

type ProgressBarCircleProps = {
  accomplished: boolean;
  label: string;
  progress: number;
  hoverProgress: number;
  onMouseEnter?: (event: SyntheticEvent) => void;
  onMouseLeave?: (event: SyntheticEvent) => void;
  onClick: (event: SyntheticEvent) => void;
};

const ProgressBarCircle = ({
  accomplished,
  label,
  progress,
  hoverProgress,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ProgressBarCircleProps) => {
  const transitionStyles = {
    entering: { transform: "scale(1.1)" },
    entered: { transform: "scale(1)" },
    exiting: { transform: "scale(1.1)" },
    exited: { transform: "scale(1)" },
  };
  return (
    <div className={css(progressStyles.container)}>
      <div className={css(progressStyles.label)}>{label}</div>
      <div
        className={css(
          progressStyles.outerCircle,
          accomplished && !hoverProgress && progressStyles.filled
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <div className={css(progressStyles.innerCircle)}></div>
      </div>
    </div>
  );
};

const progressStyles = StyleSheet.create({
  container: {
    position: "relative",
  },
  outerCircle: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "3px solid #E9EAEF",
    background: "#fff",
    cursor: "pointer",

    ":hover": {
      background: "#E5EDFF",
      border: "1px solid #fff",
    },
  },
  filled: {
    background: colors.NEW_BLUE(1),
    border: "1px solid #fff",

    ":hover": {
      background: colors.NEW_BLUE(1),
      border: "1px solid #fff",
    },
  },
  innerCircle: {
    background: "#fff",
    height: 18,
    width: 18,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
  },
  label: {
    position: "absolute",
    top: -36,
    background: "#F1F5FF",
    color: colors.NEW_BLUE(1),
    padding: "5px 10px",
    borderRadius: 6,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: "nowrap",
    letterSpacing: "1.2px",

    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
      letterSpacing: ".5px",
      maxWidth: 60,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

export const EFFORT_LEVEL_DESCRIPTIONS = {
  question: {
    casual: "30 minutes max. No need to add any references.",
    light:
      "About 1-3 hours. Typically a comment with a few relevant citations.",
    medium:
      "A full day's worth of work. A 1000-1500 word post that cites at least 5 references.",
    comprehensive:
      "Multiple days' worth of research. A narrative review on the topic worthy of publication.",
  },
  metastudy: {
    casual: "30 minutes max. 2-3 relevant citations with minimal context.",
    light: "About 1-3 hours. 5-10 citations with detailed context.",
    medium:
      "A full day's worth of work. Around 20 references with detailed context.",
    comprehensive:
      "Multiple days' worth of research. A complete collection of references with detailed context.",
  },
  somethingelse: {
    casual: "30 minutes max.",
    light: "About 1-3 hours.",
    medium: "A full day's worth of work.",
    comprehensive: "Multiple days' worth of effort.",
  },
};

type Props = {
  withPreview: boolean;
  handleBountyAdded: Function;
  addBtnLabel?: string;
  bountyText: string;
  postId: number;
  postSlug: string;
  unifiedDocId: number;
  showMessage: Function;
  setMessage: Function;
  isOriginalPoster: boolean;
  hubs?: Hub[];
  bountyType: string;
  otherButtons: any;
};

function BountyWizardRSCForm({
  withPreview,
  handleBountyAdded,
  unifiedDocId,
  postId,
  postSlug,
  bountyText,
  showMessage,
  setMessage,
  isOriginalPoster,
  hubs = [],
  otherButtons,
  bountyType,
  addBtnLabel = "Add Bounty",
}: Props): ReactElement {
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  const currentUser = getCurrentUser();
  const currentUserBalance = currentUser?.balance ?? 0;
  const [offeredAmount, setOfferedAmount] = useState<number>(
    parseFloat(100 + "")
  );
  const [hasMinRscAlert, setHasMinRscAlert] = useState(false);
  const [hasMaxRscAlert, setHasMaxRscAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [progressHover, setProgressHover] = useState(false);
  const [workAmount, setWorkAmount] = useState("light");

  useEffect((): void => {
    setHasMinRscAlert(
      currentUserBalance <= MIN_RSC_REQUIRED ||
        offeredAmount < MIN_RSC_REQUIRED ||
        currentUserBalance < offeredAmount
    );
  }, [currentUserBalance, offeredAmount]);

  const handleBountyInputChange = (event) => {
    setOfferedAmount(event.target.value ? parseInt(event.target.value) : "0");
    if (event.target.value < MIN_RSC_REQUIRED) {
      setHasMinRscAlert(true);
      setHasMaxRscAlert(false);
    } else if (event.target.value > MAX_RSC_REQUIRED) {
      setHasMaxRscAlert(true);
      setHasMinRscAlert(false);
    } else {
      setHasMinRscAlert(false);
      setHasMaxRscAlert(false);
    }
  };

  const calcResearchHubAmount = ({ offeredAmount }) => {
    return parseFloat(
      ((BOUNTY_RH_PERCENTAGE / 100) * offeredAmount).toFixed(10)
    );
  };

  const calcTotalAmount = ({ offeredAmount }) => {
    return (
      parseFloat(offeredAmount + "") + calcResearchHubAmount({ offeredAmount })
    );
  };

  const sendBountyCreateAmpEvent = ({ currentUser, createdBounty }) => {
    const rh_fee = createdBounty?.amount * 0.07;
    const dao_fee = createdBounty?.amount * 0.02;
    trackEvent({
      eventType: "create_bounty",
      vendor: "amp",
      user: currentUser,
      insertId: `bounty_${createdBounty?.id}`,
      data: {
        interaction: "Bounty created",
        expiration_date: createdBounty?.expiration_date,
        rh_fee: rh_fee,
        dao_fee: dao_fee,
        net_fee: rh_fee + dao_fee,
      },
    });
  };

  const handleAddBounty = () => {
    if (!(hasMinRscAlert || hasMaxRscAlert)) {
      const totalBountyAmount = calcTotalAmount({ offeredAmount });
      if (withPreview) {
        // handleBountyAdded({
        //   grossBountyAmount: bountyAmount,
        //   totalBountyAmount: totalBountyAmount,
        // });
        handleBountyAdded(
          new Bounty({
            amount: offeredAmount,
          })
        );
      } else {
        const effortLevelMap = {
          0: "CASUAL",
        };

        effortLevelMap["33.34"] = "LIGHT";

        effortLevelMap["66.67"] = "MEDIUM";
        effortLevelMap["100"] = "COMPREHENSIVE";

        Bounty.createAPI({
          bountyAmount: offeredAmount,
          itemObjectId: unifiedDocId,
          effortLevel: effortLevelMap[progress],
        })
          .then((createdBounty) => {
            sendBountyCreateAmpEvent({ currentUser, createdBounty });
            handleBountyAdded(createdBounty);
            // setSuccess(true);
          })
          .catch((error) => {
            console.log("error", error);
            setMessage("Failed to create bounty");
            showMessage({ show: true, error: true });
          });
      }
    }
  };

  const showAlertNextToBtn = hasMinRscAlert || hasMaxRscAlert || withPreview;
  const researchHubAmount = calcResearchHubAmount({ offeredAmount });
  const totalAmount = calcTotalAmount({ offeredAmount });

  const suggestedRSC = {
    question: {
      casual: 750,
      light: 3000,
      medium: 12000,
      comprehensive: 50000,
    },
    metastudy: {
      casual: 750,
      light: 3000,
      medium: 12000,
      comprehensive: 50000,
    },
    somethingelse: {
      casual: 500,
      light: 1500,
      medium: 12000,
      comprehensive: 50000,
    },
  };

  return (<>
    {success ? (
      <BountySuccessScreen
        bountyText={bountyText}
        postSlug={postSlug}
        postId={postId}
        hubs={hubs}
        bountyAmount={offeredAmount}
      />
    ) : (
      <>
        <ReactTooltip
          id="commission"
          effect="solid"
          className={css(bountyTooltip.tooltipContainer)}
          delayShow={150}
        >
          <div className={css(bountyTooltip.bodyContainer)}>
            <div className={css(bountyTooltip.desc)}>
              <div>
                • 2% of bounty amount will be used to support the ResearchHub
                Community
              </div>
              <div>• 7% of bounty amount will be paid to ResearchHub Inc</div>
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

        <div className={css(styles.rootContainer)}>
          <div className={css(styles.progressContainer)}>
            <h2 className={css(styles.progressTitle)}>
              What level of work are you looking for?
            </h2>
            <div className={css(styles.progressBar)}>
              <ProgressBar
                height={18}
                percent={hoverProgress ? hoverProgress : progress}
                filledBackground={
                  progressHover ? colors.NEW_BLUE(0.1) : colors.NEW_BLUE(1)
                }
              >
                <Step>
                  {({ accomplished }) => (
                    <ProgressBarCircle
                      accomplished={accomplished}
                      onClick={() => {
                        setProgress(0);
                        setHoverProgress(0);
                        setWorkAmount("casual");

                        setProgressHover(false);
                      }}
                      label="CASUAL"
                    />
                  )}
                </Step>
                <Step>
                  {({ accomplished }) => (
                    <ProgressBarCircle
                      accomplished={accomplished}
                      label="LIGHT"
                      progress={progress}
                      hoverProgress={hoverProgress}
                      onMouseEnter={() => {
                        setHoverProgress(33.34);
                        setProgressHover(true);
                      }}
                      onMouseLeave={() => {
                        setHoverProgress(0);
                        setProgressHover(false);
                      }}
                      onClick={() => {
                        setProgress(33.34);
                        setHoverProgress(0);
                        setWorkAmount("light");

                        setProgressHover(false);
                      }}
                    />
                  )}
                </Step>
                <Step>
                  {({ accomplished }) => (
                    <ProgressBarCircle
                      accomplished={accomplished}
                      label="MEDIUM"
                      progress={progress}
                      hoverProgress={hoverProgress}
                      onClick={() => {
                        setProgress(66.67);
                        setHoverProgress(0);
                        setWorkAmount("medium");

                        setProgressHover(false);
                      }}
                      onMouseEnter={() => {
                        setHoverProgress(66.67);
                        setProgressHover(true);
                      }}
                      onMouseLeave={() => {
                        setHoverProgress(0);
                        setProgressHover(false);
                      }}
                    />
                  )}
                </Step>
                <Step>
                  {({ accomplished }) => (
                    <ProgressBarCircle
                      accomplished={accomplished}
                      label="COMPREHENSIVE"
                      progress={progress}
                      hoverProgress={hoverProgress}
                      onMouseEnter={() => {
                        setHoverProgress(100);
                        setProgressHover(true);
                      }}
                      onMouseLeave={() => {
                        setHoverProgress(0);
                        setProgressHover(false);
                      }}
                      onClick={() => {
                        setProgress(100);
                        setWorkAmount("comprehensive");

                        setHoverProgress(0);
                        setProgressHover(false);
                      }}
                    />
                  )}
                </Step>
              </ProgressBar>
            </div>
            <div className={css(styles.progressDescription)}>
              {EFFORT_LEVEL_DESCRIPTIONS[bountyType][workAmount]}
              {"\n"}
              {"\n"}Suggested Offer Amount:{" "}
              {formatBountyAmount({
                amount: suggestedRSC[bountyType][workAmount],
              })}{" "}
              RSC
            </div>
          </div>
          <div className={css(styles.values)}>
            <div className={css(styles.offeringLine)}>
              <div className={css(styles.lineItem, styles.offeringLine)}>
                <div
                  className={css(styles.lineItemText, styles.offeringText)}
                >
                  <div>I am offering</div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <div
                    className={css(
                      styles.lineItemValue,
                      styles.offeringValue
                    )}
                  >
                    <span
                      className={css(styles.valueNumber, styles.valueInInput)}
                    >
                      <input
                        className={css(styles.input)}
                        type="number"
                        onChange={handleBountyInputChange}
                        value={offeredAmount + ""}
                        pattern="\d*"
                      />
                    </span>
                    <span className={css(styles.rscText)}>RSC</span>
                  </div>
                </div>
              </div>

              <div className={css(styles.lineItem, styles.platformFeeLine)}>
                <div
                  className={css(styles.lineItemText, styles.platformFeeText)}
                >
                  Platform Fee ({BOUNTY_RH_PERCENTAGE}%){` `}
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
                <div
                  className={css(styles.lineItemValue, styles.netAmountValue)}
                >
                  <span className={css(styles.valueNumber)}>
                    <span>{totalAmount.toLocaleString()}</span>
                    <ResearchCoinIcon
                      overrideStyle={styles.rscIcon}
                      width={20}
                      height={20}
                    />
                  </span>
                  <span className={css(styles.rscText)}>RSC</span>
                </div>
              </div>
            </div>
          </div>
          <div className={css(infoSectionStyles.bountyInfo)}>
            {isOriginalPoster ? null : (
              <div
                className={css(
                  infoSectionStyles.infoRow,
                  infoSectionStyles.specialInfoRow
                )}
              >
                <span className={css(infoSectionStyles.infoIcon)}>
                  {
                    <WarningIcon
                      color={colors.DARKER_GREY()}
                      width={20}
                      height={20}
                    />
                  }
                </span>{" "}
                By contributing to the open bounty, you are giving the
                original poster control to award your bounty.
              </div>
            )}

            <div className={css(infoSectionStyles.infoRow)}>
              <span className={css(infoSectionStyles.infoIcon)}>
                {<FontAwesomeIcon icon={faClock}></FontAwesomeIcon>}
              </span>{" "}
              <span className={css(infoSectionStyles.infoText)}>
                The Grant will end in 30 days or as soon as you award a
                solution
              </span>
            </div>
            <div className={css(infoSectionStyles.infoRow)}>
              <span className={css(infoSectionStyles.infoIcon)}>
                {<FontAwesomeIcon icon={faUndo}></FontAwesomeIcon>}
              </span>{" "}
              If no solution satisfies your request, the full bounty amount
              (excluding platform fee) will be refunded to you
            </div>
          </div>

          <div className={css(styles.addBountyContainer)}>
            <div
              className={css(
                styles.buttonRow,
                showAlertNextToBtn && styles.buttonRowWithText
              )}
            >
              {hasMinRscAlert ? (
                <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                  {currentUserBalance < offeredAmount
                    ? `Your RSC balance is below offered amount ${numeral(
                        offeredAmount
                      ).format("0[,]0")}`
                    : `Minimum bounty amount is ${MIN_RSC_REQUIRED} RSC`}
                </div>
              ) : hasMaxRscAlert ? (
                <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                  Bounty amount cannot exceed 1,000,000 RSC
                </div>
              ) : withPreview ? (
                <div
                  className={css(alertStyles.alert, alertStyles.previewAlert)}
                >
                  You will have a chance to review and cancel before bounty is
                  created
                </div>
              ) : null}
              <div className={css(styles.addBtnContainer)}>
                {otherButtons && otherButtons}
                <div style={{ marginLeft: "auto" }}>
                  <Button
                    label={addBtnLabel}
                    customButtonStyle={styles.addButton}
                    customLabelStyle={styles.addButtonLabel}
                    disabled={hasMaxRscAlert || hasMinRscAlert}
                    onClick={handleAddBounty}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </>);
}

const bountyTooltip = StyleSheet.create({
  tooltipContainer: {
    textAlign: "left",
    width: 450,
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

const infoSectionStyles = StyleSheet.create({
  specialInfoRow: {
    borderBottom: "1px solid rgb(232 232 242)",
    padding: 0,
    marginLeft: 30,
    marginRight: 30,
    paddingBottom: 8,
    // background: colors.YELLOW(0.1),
    // paddingTop: 8,
    // paddingBottom: 8,
  },
  bountyInfo: {
    textAlign: "left",
    fontSize: 16,
    background: "rgba(240, 240, 240, 0.3)",
    color: colors.DARKER_GREY(),
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 25,
  },
  infoRow: {
    marginBottom: 10,
    display: "flex",
    paddingRight: 30,
    paddingLeft: 30,
    fontSize: 14,
    lineHeight: "20px",
    alignItems: "flex-start",
    ":last-child": {
      marginBottom: 0,
    },
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 10,
    width: 14,
    boxSizing: "border-box",
  },
  infoText: {},
});

const styles = StyleSheet.create({
  rootContainer: {
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
  progressTitle: {
    fontSize: 18,
    marginTop: 38,
    marginBottom: 16,
    textAlign: "left",
    fontWeight: 500,
  },
  progressDescription: {
    color: "#7C7989",
    textAlign: "left",
    fontSize: 14,
    whiteSpace: "pre-wrap",
  },
  modalTitle: {
    // color: colors.ORANGE_DARK(),
    marginBottom: 25,
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 25,
  },
  progressBar: {
    padding: "30px 40px",
    paddingRight: 50,
    marginTop: 44,

    "@media only screen and (max-width: 767px)": {
      padding: "30px",
    },
  },
  rscIcon: {
    marginLeft: 5,
    marginTop: 2,
  },
  input: {
    width: 80,
    marginRight: -10,
    textAlign: "right",
    padding: "5px 7px",
    border: `2px solid rgb(229 229 230)`,
    background: "#FBFBFD",
    fontSize: 16,
    [`[type="number"]`]: {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  tooltipIcon: {
    fontSize: 16,
    color: colors.DARKER_GREY(),
    marginLeft: 5,
    cursor: "pointer",
  },
  rscText: {
    fontWeight: 500,
    // alignSelf: "flex-end",
    marginLeft: "auto",
    color: colors.BLACK(),
  },
  bountyIcon: {
    marginRight: 10,
  },
  modalStyle: {
    maxWidth: 500,
  },
  modalContentStyle: {
    padding: 0,
    paddingTop: 25,
    paddingBottom: 25,
  },
  buttonRow: {
    // marginLeft: "15px",
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  buttonRowWithText: {
    justifyContent: "space-between",
  },
  addButton: {
    // background: colors.ORANGE_LIGHT(),
    marginLeft: "auto",
  },
  addBtnContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  addButtonLabel: {
    // color: colors.BLACK(),
    fontWeight: 500,
  },
  values: {
    borderTop: `1px solid rgb(229 229 230)`,
    paddingTop: 16,
    marginTop: 16,
    marginBottom: 25,
    paddingBottom: 0,
  },
  lineItem: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  lineItemValue: {
    display: "flex",
    marginLeft: "auto",
    width: 150,
    alignItems: "center",
  },
  lineItemText: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
  },
  platformFeeText: {
    color: "#7C7989",
  },
  offeringLine: {
    // marginBottom: 7,
  },
  offeringText: {
    fontWeight: 500,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  suggestedAmount: {
    fontWeight: 400,
    fontSize: 16,
    color: "#7C7989",
    marginTop: 8,
  },
  offeringValue: {
    alignItems: "center",
  },
  valueNumber: {
    width: 100,
    textAlign: "right",
    paddingRight: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  valueInInput: {
    paddingRight: 0,
  },
  platformFeeLine: {
    color: colors.DARKER_GREY(),
  },
  netAmountLine: {
    paddingTop: 16,
    borderTop: `1px solid rgb(229 229 230)`,
    fontWeight: 500,
  },
  netAmountValue: {
    fontWeight: 500,
  },
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(BountyWizardRSCForm);
