import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/pro-solid-svg-icons";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import {
  BOUNTY_DEFAULT_AMOUNT,
  BOUNTY_RH_PERCENTAGE,
  MAX_RSC_REQUIRED,
  MIN_RSC_REQUIRED,
} from "./config/constants";
import { captureEvent } from "@sentry/browser";
import { connect, useSelector } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { MessageActions } from "~/redux/message";
import { ReactElement, useState, useEffect } from "react";
import { trackEvent } from "~/config/utils/analytics";
import BaseModal from "../Modals/BaseModal";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import BountySuccessScreen from "./BountySuccessScreen";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import { WarningIcon } from "~/config/themes/icons";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { useExchangeRate } from "../contexts/ExchangeRateContext";
import ContentBadge from "../ContentBadge";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import { ID, parseUser } from "~/config/types/root_types";
import FormSelect from "../Form/FormSelect";
import { COMMENT_TYPES, COMMENT_TYPE_OPTIONS } from "../Comment/lib/types";

type Props = {
  isOpen: boolean;
  withPreview: boolean;
  closeModal: Function;
  originalBounty?: Bounty;
  handleBountyAdded: Function;
  addBtnLabel?: string;
  relatedItemId?: ID;
  relatedItemContentType?: string;
  showMessage: Function;
  setMessage: Function;
};

function BountyModal({
  isOpen,
  withPreview,
  closeModal,
  handleBountyAdded,
  showMessage,
  setMessage,
  relatedItemId,
  originalBounty,
  relatedItemContentType,
  addBtnLabel = "Add Bounty",
}: Props): ReactElement {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const currentUserBalance = currentUser?.balance ?? 0;

  const [offeredAmount, setOfferedAmount] = useState<number>(
    parseFloat(BOUNTY_DEFAULT_AMOUNT + "")
  );
  const [hasMinRscAlert, setHasMinRscAlert] = useState(false);
  const [hasMaxRscAlert, setHasMaxRscAlert] = useState(false);
  const [bountyType, setBountyType] = useState<COMMENT_TYPES | null>(null);
  const [success, setSuccess] = useState(false);

  const { rscToUSDDisplay } = useExchangeRate();

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
    setBountyType(null);
    setOfferedAmount(BOUNTY_DEFAULT_AMOUNT);
  };

  const handleBountyInputChange = (event) => {
    setOfferedAmount(event?.target?.value ? parseInt(event.target.value) : 0);
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
    if (!bountyType) {
      setMessage("Please select a bounty type before adding a bounty");
      showMessage({ show: true, error: true });
      return;
    }
    if (!(hasMinRscAlert || hasMaxRscAlert)) {
      const totalBountyAmount = calcTotalAmount({ offeredAmount });
      if (withPreview) {
        handleBountyAdded(
          new Bounty({
            amount: offeredAmount,
            bounty_type: bountyType,
          })
        );
        closeModal();
      } else {
        Bounty.createAPI({
          bountyAmount: offeredAmount,
          itemObjectId: relatedItemId,
          itemContentType: relatedItemContentType,
          bountyType,
        })
          .then((createdBounty) => {
            sendBountyCreateAmpEvent({ currentUser, createdBounty });
            handleBountyAdded(createdBounty);
            setSuccess(true);
          })
          .catch((error) => {
            console.log("error", error);
            captureEvent(error);
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
      zIndex={1000001}
      modalContentStyle={styles.modalContentStyle}
      title={
        success ? null : (
          <span className={css(styles.modalTitle)}>
            {" "}
            {originalBounty ? "Contribute to" : "Add"} Bounty{" "}
          </span>
        )
      }
    >
      <>
        {success ? (
          <BountySuccessScreen originalBounty={originalBounty} />
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
                  <div
                    className={css(styles.lineItemText, styles.offeringText)}
                  >
                    What type of bounty do you want to create?
                  </div>
                  <div className={css(styles.bountyTypes)}>
                    {COMMENT_TYPE_OPTIONS.map(
                      ({ value, label, icon }, index) => {
                        return (
                          <div
                            className={css(
                              styles.bountyTypeBadge,
                              value === bountyType && styles.bountyBadgeActive
                            )}
                            onClick={() => setBountyType(value)}
                          >
                            <span className={css(styles.bountyTypeIcon)}>
                              {icon}
                            </span>
                            {label}
                          </div>
                        );
                      }
                    )}
                  </div>

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
                          pattern="\d*"
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
                        {
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                          ></FontAwesomeIcon>
                        }
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
                        {
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                          ></FontAwesomeIcon>
                        }
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
                  <div className={css(styles.usdValue)}>
                    ≈ {rscToUSDDisplay(totalAmount)}{" "}
                    <span style={{ marginLeft: 22 }}>USD</span>
                  </div>
                </div>
              </div>
              <div className={css(infoSectionStyles.bountyInfo)}>
                {originalBounty && (
                  <div className={css(infoSectionStyles.infoRow)}>
                    <span className={css(infoSectionStyles.infoIcon)}>
                      {<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>}
                    </span>{" "}
                    The bounty creator will be able to award the full bounty
                    amount including your contribution to a solution they pick.
                  </div>
                )}
                {!originalBounty && (
                  <div className={css(infoSectionStyles.infoRow)}>
                    <span className={css(infoSectionStyles.infoIcon)}>
                      {<FontAwesomeIcon icon={faClock}></FontAwesomeIcon>}
                    </span>{" "}
                    <span className={css(infoSectionStyles.infoText)}>
                      The Bounty will end in 30 days or as soon as you award a
                      solution
                    </span>
                  </div>
                )}
                {!originalBounty && (
                  <div className={css(infoSectionStyles.infoRow)}>
                    <span className={css(infoSectionStyles.infoIcon)}>
                      {<FontAwesomeIcon icon={faUndo}></FontAwesomeIcon>}
                    </span>{" "}
                    If no solution satisfies your request, the full bounty
                    amount (excluding platform fee) will be refunded to you
                  </div>
                )}
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
                        ? `Your RSC balance is below offered amount ${numeral(
                            offeredAmount
                          ).format("0[,]0")}`
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
                      label={originalBounty ? "Contribute" : "Add bounty"}
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
    paddingBottom: 12,
    fontSize: 14,
    lineHeight: "20px",
    alignItems: "flex-start",
    // borderBottom: `1px solid ${colors.GREY_BORDER}`,
    ":last-child": {
      marginBottom: 0,
      borderBottom: 0,
      paddingBottom: 0,
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
  bountyTypes: {
    display: "flex",
    gap: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  bountyTypeBadge: {
    padding: "6px 10px",
    border: `1px solid #DEDEE6`,
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 16,
    lineHeight: "20px",

    ":hover": {
      opacity: 0.7,
    },
  },
  bountyTypeIcon: {
    color: colors.NEW_BLUE(),
    marginRight: 8,
  },
  bountyBadgeActive: {
    border: `2px solid ${colors.NEW_BLUE()}`,
    ":hover": {
      opacity: 1,
    },
  },
  modalTitle: {
    // color: colors.ORANGE_DARK(),
    marginBottom: 25,
    fontSize: 26,
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
    borderRadius: 2,
    border: `1px solid rgb(229 229 230)`,
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
    maxWidth: 550,

    "@media only screen and (min-width: 768px)": {
      width: 550,
    },
  },
  selectContainerStyle: {
    minHeight: "unset",
    margin: 0,
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
    minWidth: 140,
    paddingLeft: 8,
    paddingRight: 8,
    width: "unset",
    boxSizing: "border-box",
  },
  addBtnContainer: {
    paddingLeft: 8,
  },
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
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(null, mapDispatchToProps)(BountyModal);
