import { ReactElement, useState, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import BaseModal from "../Modals/BaseModal";
import ReactTooltip from "react-tooltip";
import icons, { MedalIcon, ResearchCoinIcon } from "~/config/themes/icons";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";
import Bounty from "~/config/types/bounty";

const BOUNTY_DEFAULT_AMOUNT = 1000;
const BOUNTY_RH_PERCENTAGE = 7;
const MIN_RSC_REQUIRED = 50;
const MAX_RSC_REQUIRED = 1000000;

type Props = {
  isOpen: boolean;
  withPreview: boolean;
  closeModal: Function;
  handleBountyAdded: Function;
  removeBounty: Function;
  addBtnLabel?: string;
};

function BountyModal({
  isOpen,
  withPreview,
  closeModal,
  handleBountyAdded,
  removeBounty,
  addBtnLabel = "Add Bounty",
}: Props): ReactElement {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const [bountyAmount, setBountyAmount] = useState(BOUNTY_DEFAULT_AMOUNT);
  const [hasMinRscAlert, setHasMinRscAlert] = useState(false);
  const [hasMaxRscAlert, setHasMaxRscAlert] = useState(false);

  const handleClose = () => {
    closeModal();
  };

  const handleBountyInputChange = (event) => {
    setBountyAmount(event.target.value);
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

  const handleAddBounty = () => {
    if (!(hasMinRscAlert || hasMaxRscAlert)) {
      if (withPreview) {
        handleBountyAdded({
          grossBountyAmount: bountyAmount,
          netBountyAmount: bountyAmount - researchHubAmount,
        });
        closeModal();
      } else {
        Bounty.createAPI({ bountyAmount }).then((createdBounty) => {
          console.log(createdBounty);
        });
      }
    }
  };

  const showAlertText = hasMinRscAlert || hasMaxRscAlert || withPreview;
  const researchHubAmount = parseInt(
    ((BOUNTY_RH_PERCENTAGE / 100) * bountyAmount).toFixed(0)
  );
  return (
    <BaseModal
      closeModal={handleClose}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      // titleStyle={styles.title}
      title={
        <span className={css(styles.modalTitle)}>
          {" "}
          Add RSC Bounty{" "}
          <ResearchCoinIcon
            overrideStyle={styles.rscIcon}
            width={20}
            height={20}
          />
        </span>
      }
    >
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
            <div>• 5% of bounty amount will be paid to ResearchHub Inc</div>
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
            Actual amount bounty awardee(s) will receive
          </div>
        </div>
      </ReactTooltip>

      <div className={css(styles.rootContainer)}>
        <div className={css(styles.values)}>
          <div className={css(styles.offeringLine)}>
            <div className={css(styles.lineItem, styles.offeringLine)}>
              <div className={css(styles.lineItemText, styles.offeringText)}>
                I am offering
              </div>
              <div className={css(styles.lineItemValue, styles.offeringValue)}>
                <span className={css(styles.valueNumber, styles.valueInInput)}>
                  <input
                    className={css(styles.input)}
                    type="number"
                    onChange={handleBountyInputChange}
                    value={bountyAmount}
                  />
                </span>
                <span className={css(styles.rscText)}>RSC</span>
              </div>
            </div>

            <div className={css(styles.lineItem, styles.platformFeeLine)}>
              <div className={css(styles.lineItemText)}>
                Research Hub Platform Fee ({BOUNTY_RH_PERCENTAGE}%){` `}
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
                  <span>- {researchHubAmount.toLocaleString()}</span>
                </span>
                <span className={css(styles.rscText)}>RSC</span>
              </div>
            </div>

            <div className={css(styles.lineItem, styles.netAmountLine)}>
              <ReactTooltip effect="solid" />
              <div className={css(styles.lineItemText)}>
                Net Bounty Award
                <span
                  className={css(styles.tooltipIcon)}
                  data-tip={""}
                  data-for="net"
                >
                  {icons["info-circle-light"]}
                </span>
              </div>
              <div className={css(styles.lineItemValue, styles.netAmountValue)}>
                <span className={css(styles.valueNumber)}>
                  <span>
                    {(bountyAmount - researchHubAmount).toLocaleString()}
                  </span>
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
              Bounty will end in 30 days or as soon as you award a solution
            </span>
          </div>
          <div className={css(infoSectionStyles.infoRow)}>
            <span className={css(infoSectionStyles.infoIcon)}>
              {
                <MedalIcon
                  color={colors.DARKER_GREY()}
                  width={25}
                  height={25}
                />
              }
            </span>{" "}
            Award either partial or full bounty depending on whether solution
            satisfies your request
          </div>
          <div className={css(infoSectionStyles.infoRow)}>
            <span className={css(infoSectionStyles.infoIcon)}>
              {icons.undo}
            </span>{" "}
            If no solution satisfies your request, full bounty amount will be
            refunded to you
          </div>
        </div>

        <div className={css(styles.addBountyContainer)}>
          <div
            className={css(
              styles.buttonRow,
              hasMinRscAlert && styles.buttonRowWithText
            )}
          >
            {hasMinRscAlert ? (
              <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                Minimum bounty must be greater than 50 RSC
              </div>
            ) : hasMaxRscAlert ? (
              <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
                Bounty amount cannot exceed 1,000,000 RSC
              </div>
            ) : withPreview ? (
              <div className={css(alertStyles.alert, alertStyles.previewAlert)}>
                You will have a chance to review and cancel before bounty is
                created
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
    background: colors.LIGHTER_GREY_BACKGROUND,
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
    alignItems: "center",
    ":last-child": {
      marginBottom: 0,
    },
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
    width: 20,
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
    marginLeft: 8,
    marginTop: 5,
  },
  input: {
    width: 60,
    marginRight: 5,
    textAlign: "right",
    padding: "5px 7px",
    border: `2px solid rgb(229 229 230)`,
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
  removeBountyBtn: {
    color: colors.RED(),
    fontSize: 14,
    fontWeight: 400,
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
    background: colors.ORANGE_LIGHT(),
    borderRadius: "4px",
    width: 126,
    boxSizing: "border-box",
  },
  addBtnContainer: {},
  addButtonLabel: {
    color: colors.BLACK(),
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
  },
  lineItemValue: {
    display: "flex",
    marginLeft: "auto",
    width: 120,
    alignItems: "center",
  },
  lineItemText: {
    display: "flex",
    alignItems: "center",
  },
  offeringLine: {
    marginBottom: 7,
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
  },
  valueInInput: {
    paddingRight: 0,
  },
  platformFeeLine: {
    color: colors.DARKER_GREY(),
    marginBottom: 7,
  },
  netAmountLine: {
    paddingTop: 7,
    borderTop: `2px solid rgb(229 229 230)`,
    fontWeight: 500,
  },
  netAmountValue: {
    fontWeight: 500,
  },
});

export default BountyModal;
