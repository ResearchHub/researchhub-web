import { ReactElement, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import BaseModal from "../Modals/BaseModal";
import ReactTooltip from "react-tooltip";
import icons, { MedalIcon } from "~/config/themes/icons";
import Button from "../Form/Button";
import colors from "~/config/themes/colors";


const BOUNTY_DEFAULT_AMOUNT = 1000;
const BOUNTY_RH_PERCENTAGE = 7;

type Props = {
  isOpen: Boolean;
  withPreview: Boolean;
  closeModal: Function;
  handleBountyAdded: Function;
  removeBounty: Function;
  addBtnLabel?: string;
  appliedBounty?: any;
};

function BountyModal({
    isOpen,
    withPreview,
    closeModal,
    handleBountyAdded,
    appliedBounty,
    removeBounty,
    addBtnLabel = "Add Bounty",
  }: Props): ReactElement {

    const [bountyAmount, setBountyAmount] = useState(appliedBounty?.grossBountyAmount || BOUNTY_DEFAULT_AMOUNT);

    const handleClose = () => {
      closeModal();
    }

    const handleBountyInputChange = (event) => {
      setBountyAmount(event.target.value);
    }

    const researchHubAmount = parseInt((BOUNTY_RH_PERCENTAGE/100 * bountyAmount).toFixed(0));
    return (
      <BaseModal
        closeModal={handleClose}
        isOpen={isOpen}
        modalStyle={styles.modalStyle}
        modalContentStyle={styles.modalContentStyle}
        titleStyle={styles.title}
        title={`Add ResearchCoin Bounty`}
      >

        <div className={css(styles.rootContainer)}>
          <div className={css(styles.values)}>
            <div className={css(styles.offeringLine)}>
              <div className={css(styles.lineItem, styles.offeringLine)}>
                <div className={css(styles.lineItemText, styles.offeringText)}>
                  I am offering
                </div>
                <div className={css(styles.lineItemValue, styles.offeringValue)}>
                  <span className={css(styles.valueNumber, styles.valueInInput)}>
                    <input className={css(styles.input)} type="number" onChange={handleBountyInputChange} value={bountyAmount} />
                  </span>
                  <span className={css(styles.rscText)}>RSC</span>
                </div>
              </div>

              <div className={css(styles.lineItem, styles.platformFeeLine)}>
                <ReactTooltip
                  effect="solid"
                  html={true}
                />                
                <div className={css(styles.lineItemText)} data-tip={`
                  <div style="text-align: left;">
                    • 5% of awarded amount will be paid to Research Hub. <br/>
                    • 2% of awarded amount will be paid to the Research Hub community.
                  </div>
                `}>
                  Research Hub Platform Fee ({BOUNTY_RH_PERCENTAGE}%)
                </div>
                <div className={css(styles.lineItemValue)}>
                  <span className={css(styles.valueNumber)}>
                    <span>- {researchHubAmount}</span>
                  </span>
                  <span className={css(styles.rscText)}>RSC</span>
                </div>
              </div>              

              <div className={css(styles.lineItem, styles.netAmountLine)}>
                <ReactTooltip
                  effect="solid"
                />
                <div className={css(styles.lineItemText)} data-tip={"Actual amount bounty winner will receive"}>
                  Net Bounty Award
                </div>
                <div className={css(styles.lineItemValue, styles.netAmountValue)}>
                  <span className={css(styles.valueNumber)}>
                    <span>{bountyAmount - researchHubAmount}</span>
                  </span>
                  <span className={css(styles.rscText)}>RSC</span>
                </div>
              </div>              
            </div>
          </div>
          <div className={css(infoSectionStyles.bountyInfo)}>
            <div className={css(infoSectionStyles.infoRow)}>
              <span className={css(infoSectionStyles.infoIcon)}>{icons.clock}</span> <span className={css(infoSectionStyles.infoText)}>Bounty will end in 30 days or as soon as you award a solution</span>
            </div>
            <div className={css(infoSectionStyles.infoRow)}>
              <span className={css(infoSectionStyles.infoIcon)}>{<MedalIcon color={colors.DARKER_GREY()} />}</span> Award either partial or full bounty depending on whether solution satisfies your request
            </div>
            <div className={css(infoSectionStyles.infoRow)}>
              <span className={css(infoSectionStyles.infoIcon)}>{icons.undo}</span> If no solution satisfies your request, full bounty amount will be refunded to you
            </div>
          </div>

          <div className={css(styles.addBountyContainer)}>
            {appliedBounty &&
              <div className={css(styles.removeBountyBtn)} onClick={() => {
                removeBounty();
                closeModal();
              }}>Remove Bounty</div>
            }
            <div className={css(styles.addBtnContainer)}>
              <Button
                label={addBtnLabel}
                customButtonStyle={styles.addButton}
                customLabelStyle={styles.addButtonLabel}
                size={`small`}
                onClick={() => {
                  handleBountyAdded({
                    grossBountyAmount: bountyAmount,
                    netBountyAmount: bountyAmount - researchHubAmount,
                  })
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      </BaseModal>
    )
}

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
    }
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {

  },
});

const styles = StyleSheet.create({
  rootContainer: {
    fontSize: 18,
    width: "100%",
    textAlign: "center",
  },
  title: {
    // color: colors.ORANGE_DARK(),
    marginBottom: 25,
    fontSize: 22,
    // paddingTop: 25,
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
      "margin": 0,
    }
  },
  rscText: {
    fontWeight: 500,
    // alignSelf: "flex-end",
    marginLeft: "auto",
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
  addBtnContainer: {
    marginLeft: "15px",
  },
  addButton: {
    background: colors.ORANGE(),
    borderRadius: "4px",
  },
  addButtonLabel: {
    color: colors.BLACK(),
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

  },
  offeringLine: {
    marginBottom: 15,
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
    marginBottom: 5,
  },
  netAmountLine: {
    paddingTop: 5,
    borderTop: `2px solid rgb(229 229 230)`,
  },
  netAmountValue: {
    color: colors.ORANGE_DARK(),
    fontWeight: 500,

  }
});

export default BountyModal;
