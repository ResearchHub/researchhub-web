import { Component, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { withAlert } from "react-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import ReactTooltip from "react-tooltip";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import numeral from "numeral";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";

// Config
import {
  SUPPORT_MIN_RSC_REQUIRED,
  SUPPORT_MAX_RSC_REQUIRED,
  SUPPORT_DEFAULT_AMOUNT,
  SUPPORT_RH_PERCENTAGE,
} from "./constants/SupportContent";
import { supportContent } from "../../config/fetch";
import colors from "../../config/themes/colors";
import {
  sanitizeNumber,
  formatBalance,
  onKeyDownNumInput,
  onPasteNumInput,
} from "~/config/utils/form";
import { breakpoints } from "~/config/themes/screen";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import ResearchCoinIcon from "../Icons/ResearchCoinIcon";
import { withExchangeRate } from "../contexts/ExchangeRateContext";

class ContentSupportModal extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      amount: SUPPORT_DEFAULT_AMOUNT,
      error: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  closeModal = () => {
    this.props.openContentSupportModal(false, { data: {}, metaData: {} });
    this.setState({ ...this.initialState });
  };

  handleAmount = (e) => {
    const inputValue = e.target.value.replace(/^0+/, "");
    const amount = inputValue ? parseInt(sanitizeNumber(inputValue)) : "";

    this.setState({
      amount,
    });
  };

  calcResearchHubAmount = ({ offeredAmount }) => {
    if (offeredAmount === 0) {
      return 0;
    }
    return parseFloat(
      ((SUPPORT_RH_PERCENTAGE / 100) * offeredAmount).toFixed(10)
    );
  };

  calcTotalAmount = ({ offeredAmount }) => {
    if (isNullOrUndefined(offeredAmount) || isEmpty(offeredAmount)) {
      return 0;
    }
    return (
      parseFloat(offeredAmount + "") +
      this.calcResearchHubAmount({ offeredAmount })
    );
  };

  showSuccessMessage = () => {
    const { setMessage, showMessage } = this.props;
    showMessage({ show: false });
    setMessage("ResearchCoin successfully awarded!");
    showMessage({ show: true });
  };

  showErrorMessage = (err) => {
    const { setMessage, showMessage } = this.props;
    showMessage({ show: false });
    setMessage("Something went wrong. Please try again.");
    showMessage({ show: true, error: true });
  };

  handleTransaction = () => {
    const { showMessage, updateUser, modals, auth, onSupport } = this.props;
    const { metaData, count, setCount } = modals.openContentSupportModal.props;
    showMessage({ show: true, load: true });
    supportContent({ ...metaData, amount: this.state.amount })
      .then((res) => {
        this.showSuccessMessage();
        const updatedCount = Number(count) + Number(this.state.amount);
        const balance = auth.user.balance - this.state.amount;
        setCount(updatedCount); // update promoted score
        updateUser({ balance }); // update user's RSC balance
        this.closeModal();
        if (typeof onSupport === "function") {
          onSupport(res);
        }
      })
      .catch(this.showErrorMessage);
  };

  confirmTransaction = (e) => {
    e && e.stopPropagation();
    e && e.preventDefault();

    const { alert } = this.props;
    const { amount } = this.state;

    alert.show({
      text: `Award ${parseInt(amount, 10)} RSC to this post?`,
      buttonText: "Yes",
      containerStyle: {
        zIndex: 20000,
      },
      onClick: () => this.handleTransaction(),
    });
  };

  getAuthorProfile = () => {
    const { data, metaData } = this.props.modals.openContentSupportModal.props;

    if (data && metaData) {
      return metaData.contentType === "summary"
        ? data.proposed_by.author_profile
        : data.created_by && data.created_by.author_profile;
    }
  };

  renderInputs = () => {
    const { user } = this.props;
    const { amount } = this.state;
    const recipient = this.getAuthorProfile();
    const researchHubAmount = this.calcResearchHubAmount({
      offeredAmount: amount,
    });
    const totalAmount = this.calcTotalAmount({
      offeredAmount: amount,
    });
    const hasMinRscError = amount < 10 || (user && user.balance < totalAmount);
    const hasMaxRscError = this.state.value > SUPPORT_MAX_RSC_REQUIRED;

    return (
      <Fragment>
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
            <div className={css(bountyTooltip.desc)}>Amount including fees</div>
          </div>
        </ReactTooltip>
        <div className={css(styles.lineItem, styles.balanceLine)}>
          <div className={css(styles.lineItemText, styles.balanceText)}>
            Recipient
          </div>
          <div className={css(styles.lineItemValue, styles.recipientValue)}>
            <span className={css(styles.valueNumber)}>
              <span>
                {recipient &&
                  `${recipient.first_name || ""} ${recipient.last_name || ""}`}
              </span>
            </span>
          </div>
        </div>
        <div
          className={css(
            styles.lineItem,
            styles.borderBottom,
            styles.balanceLine
          )}
        >
          <div className={css(styles.lineItemText, styles.balanceText)}>
            Current Balance
          </div>
          <div className={css(styles.lineItemValue, styles.balanceValue)}>
            <span className={css(styles.valueNumber)}>
              <span>
                {formatBalance(
                  Math.floor(this.props.user && this.props.user.balance)
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
            I am tipping
          </div>
          <div className={css(styles.lineItemValue, styles.offeringValue)}>
            <span className={css(styles.valueNumber, styles.valueInInput)}>
              <input
                className={css(styles.input, this.state.error && styles.error)}
                type="number"
                min={"0"}
                max={this.props.user && this.props.user.balance}
                value={amount}
                onChange={this.handleAmount}
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
            Platform Fee ({SUPPORT_RH_PERCENTAGE}%){` `}
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
          ≈ {this.props.rscToUSDDisplay(totalAmount)}{" "}
          <span style={{ marginLeft: 22 }}>USD</span>
        </div>
        <div className={css(styles.buttonRow)}>
          {hasMinRscError ? (
            <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
              {user && user.balance < totalAmount
                ? `Your RSC balance is below ${numeral(totalAmount).format(
                    "0[,]0[.]00"
                  )}`
                : `Minimum tip is ${SUPPORT_MIN_RSC_REQUIRED} RSC`}
            </div>
          ) : hasMaxRscError ? (
            <div className={css(alertStyles.alert, alertStyles.rscAlert)}>
              Tip amount cannot exceed 100,000 RSC
            </div>
          ) : (
            <div />
          )}
          <Button
            label="Confirm"
            onClick={this.confirmTransaction}
            disabled={hasMinRscError || hasMaxRscError}
          />
        </div>
      </Fragment>
    );
  };

  render() {
    const { modals } = this.props;

    return (
      <BaseModal
        isOpen={modals.openContentSupportModal.isOpen}
        closeModal={this.closeModal}
        title={"Tip ResearchCoin"}
        zIndex={1000001}
        subtitle={
          <Fragment>
            Support the author, or contributor, by giving them ResearchCoin, or
            RSC.{" "}
            <a
              href={
                "https://researchhub.notion.site/ResearchCoin-RSC-1e8e25b771ec4b92b9095e060c4095f6"
              }
              className={css(styles.link)}
              target="_blank"
              rel="noreferrer noopener"
            >
              Learn more about RSC and how it can be used.
            </a>
          </Fragment>
        }
        modalContentStyle={styles.modalContentStyle}
        subtitleStyle={styles.subtitleStyle}
      >
        {this.renderInputs()}
      </BaseModal>
    );
  }
}

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
    width: 350,
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
  amountWrapper: {
    width: "100%",
  },
  subtitleStyle: {
    lineHeight: 1.6,
    color: colors.BLACK(0.8),
    width: "100%",
    textAlign: "left",
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
      width: "100%",
    },
    marginBottom: 32,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  column: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 30,
    },
  },
  amountInputContainer: {
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  amountInput: {
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  recipientContainer: {
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      marginBottom: 20,
    },
  },
  recipientCard: {
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 40,
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 50,
    },
  },

  button: {
    width: "100%",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
      height: 50,
    },
  },
  link: {
    textDecoration: "unset",
    cursor: "pointer",
    color: colors.BLUE(),
    ":hover": {
      textDecoration: "underline",
    },
  },
  errorMsg: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      textAlign: "right",
    },
    fontSize: 14,
    color: colors.RED(),
    marginTop: 10,
  },

  buttonRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  coinIcon: {
    height: 20,
    marginLeft: 5,
  },
  lineItem: {
    display: "flex",
    fontSize: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
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
  borderBottom: {
    borderBottom: ".1rem dotted #e7e6e4",
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 20,
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
    // paddingBottom: 20,
  },
  balanceText: {
    // fontWeight: 500,
    color: colors.DARKER_GREY(),
  },
  balanceValue: {
    alignItems: "center",
    color: colors.DARKER_GREY(),
  },
  recipientValue: {
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
    minWidth: 100,
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
    width: "100%",
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
  user: state.auth.user,
});

const mapDispatchToProps = {
  openContentSupportModal: ModalActions.openContentSupportModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateUser: AuthActions.updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(withExchangeRate(ContentSupportModal)));
