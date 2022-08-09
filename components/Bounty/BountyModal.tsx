import {
  BOUNTY_DEFAULT_AMOUNT,
  BOUNTY_RH_PERCENTAGE,
  MAX_RSC_REQUIRED,
  MIN_RSC_REQUIRED,
} from "./config/constants";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState, useEffect } from "react";
import BaseModal from "../Modals/BaseModal";
import Bounty from "~/config/types/bounty";
import BountySuccessScreen from "./BountySuccessScreen";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import icons, { ResearchCoinIcon } from "~/config/themes/icons";
import ReactTooltip from "react-tooltip";

type Props = {
  isOpen: Boolean;
  withPreview: Boolean;
  closeModal: Function;
  handleBountyAdded: Function;
  addBtnLabel?: string;
  bountyText: string;
  postId: number;
  postSlug: string;
  unifiedDocId: number;
  showMessage: Function;
  setMessage: Function;
};

function BountyModal({
  isOpen,
  withPreview,
  closeModal,
  handleBountyAdded,
  unifiedDocId,
  postId,
  postSlug,
  bountyText,
  showMessage,
  setMessage,
  addBtnLabel = "Add Bounty",
}: Props): ReactElement {
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  const currentUserBalance = getCurrentUser()?.balance ?? 0;
  const [offeredAmount, setOfferedAmount] = useState<Number>(
    parseFloat(BOUNTY_DEFAULT_AMOUNT + "")
  );
  const [hasMinRscAlert, setHasMinRscAlert] = useState(false);
  const [hasMaxRscAlert, setHasMaxRscAlert] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect((): void => {
    setHasMinRscAlert(
      currentUserBalance <= MIN_RSC_REQUIRED ||
        offeredAmount <= MIN_RSC_REQUIRED ||
        currentUserBalance < offeredAmount
    );
  }, [currentUserBalance, offeredAmount]);

  const handleClose = () => {
    closeModal();
    setSuccess(false);
    setOfferedAmount(BOUNTY_DEFAULT_AMOUNT);
  };

  const handleBountyInputChange = (event) => {
    setOfferedAmount(parseFloat(event.target.value || "0"));
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
        closeModal();
      } else {
        Bounty.createAPI({
          bountyAmount: offeredAmount,
          itemObjectId: unifiedDocId,
        })
          .then((createdBounty) => {
            handleBountyAdded(createdBounty);
            setSuccess(true);
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
  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      title={
        success ? null : (
          <span className={css(styles.modalTitle)}> Add Bounty </span>
        )
      }
    >
      <>
        {success ? (
          <BountySuccessScreen
            bountyText={bountyText}
            postSlug={postSlug}
            postId={postId}
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

            <div className={css(styles.rootContainer)}>
              <div className={css(styles.values)}>
                <div className={css(styles.offeringLine)}>
                  <div className={css(styles.lineItem, styles.offeringLine)}>
                    <div
                      className={css(styles.lineItemText, styles.offeringText)}
                    >
                      I am offering
                    </div>
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
                        />
                      </span>
                      <span className={css(styles.rscText)}>RSC</span>
                    </div>
                  </div>

                  <div className={css(styles.lineItem, styles.platformFeeLine)}>
                    <div className={css(styles.lineItemText)}>
                      Platform Fee ({BOUNTY_RH_PERCENTAGE}%){` `}
                      <span
                        className={css(styles.tooltipIcon)}
                        data-tip={""}
                        data-for="commission"
                      >
                        {icons["info-circle-light"]}
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
                        {icons["info-circle-light"]}
                      </span>
                    </div>
                    <div
                      className={css(
                        styles.lineItemValue,
                        styles.netAmountValue
                      )}
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
                <div className={css(infoSectionStyles.infoRow)}>
                  <span className={css(infoSectionStyles.infoIcon)}>
                    {icons.clock}
                  </span>{" "}
                  <span className={css(infoSectionStyles.infoText)}>
                    The Bounty will end in 30 days or as soon as you award a
                    solution
                  </span>
                </div>
                {/* <div className={css(infoSectionStyles.infoRow)}>
                  <span className={css(infoSectionStyles.infoIcon)}>
                    {
                      <MedalIcon
                        color={colors.DARKER_GREY()}
                        width={20}
                        height={20}
                      />
                    }
                  </span>{" "}
                  Award either a partial or full bounty depending on whether the
                  solution satisfies your request
                </div> */}
                <div className={css(infoSectionStyles.infoRow)}>
                  <span className={css(infoSectionStyles.infoIcon)}>
                    {icons.undo}
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
                    <div
                      className={css(alertStyles.alert, alertStyles.rscAlert)}
                    >
                      {currentUserBalance < offeredAmount
                        ? `Your RSC balance is below offered amount ${offeredAmount}`
                        : `Minimum bounty must be greater than ${MIN_RSC_REQUIRED} RSC`}
                    </div>
                  ) : hasMaxRscAlert ? (
                    <div
                      className={css(alertStyles.alert, alertStyles.rscAlert)}
                    >
                      Bounty amount cannot exceed 1,000,000 RSC
                    </div>
                  ) : withPreview ? (
                    <div
                      className={css(
                        alertStyles.alert,
                        alertStyles.previewAlert
                      )}
                    >
                      You will have a chance to review and cancel before bounty
                      is created
                    </div>
                  ) : null}
                  <div className={css(styles.addBtnContainer)}>
                    <Button
                      label={addBtnLabel}
                      customButtonStyle={styles.addButton}
                      customLabelStyle={styles.addButtonLabel}
                      size={`small`}
                      disabled={hasMaxRscAlert || hasMinRscAlert}
                      onClick={handleAddBounty}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </BaseModal>
  );
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
  modalTitle: {
    // color: colors.ORANGE_DARK(),
    marginBottom: 25,
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 25,
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
  addBountyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingLeft: 30,
    paddingRight: 30,
  },
  buttonRow: {
    // marginLeft: "15px",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonRowWithText: {
    justifyContent: "space-between",
  },
  addButton: {
    // background: colors.ORANGE_LIGHT(),
    color: "#fff",
    borderRadius: "4px",
    width: 126,
    boxSizing: "border-box",
  },
  addBtnContainer: {},
  addButtonLabel: {
    // color: colors.BLACK(),
    fontWeight: 500,
  },
  values: {
    marginBottom: 25,
    padding: 30,
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
    borderTop: `2px solid rgb(229 229 230)`,
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

export default connect(null, mapDispatchToProps)(BountyModal);
