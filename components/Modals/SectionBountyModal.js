import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { withAlert } from "react-alert";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import { AmountInput } from "../Form/RSCForm";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { setSectionBounty } from "../../config/fetch";
import colors from "../../config/themes/colors";
import { doesNotExist, getBountyAmount, sanitizeNumber } from "~/config/utils";

class ContentSupportModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      amount: 0,
      error: false,
    };
    this.state = {
      ...this.initialState,
    };
  }

  componentDidMount = () => {
    this.configureInitialAmount();
  };

  componentDidUpdate = (prevProps) => {
    if (
      !prevProps.modals.openSectionBountyModal.isOpen &&
      this.props.modals.openSectionBountyModal.isOpen
    ) {
      return this.configureInitialAmount();
    }
  };

  closeModal = () => {
    this.props.openSectionBountyModal(false, {});
    this.setState({ ...this.initialState });
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
  };

  configureInitialAmount = () => {
    const { type, paper } = this.props.modals.openSectionBountyModal.props;

    this.setState({
      amount: getBountyAmount({ type, paper }),
    });
  };

  handleAmount = (e) => {
    const amount = sanitizeNumber(e.target.value);
    this.setState({
      amount: parseInt(amount, 10),
    });
  };

  showSuccessMessage = () => {
    const { setMessage, showMessage } = this.props;
    showMessage({ show: false });
    setMessage("Bounty succesfully set!");
    showMessage({ show: true });
  };

  showErrorMessage = (err) => {
    const { setMessage, showMessage } = this.props;
    showMessage({ show: false });
    setMessage("Something went wrong. Please try again.");
    showMessage({ show: true, error: true });
  };

  showConfirmation = (e) => {
    e && e.stopPropagation();
    e && e.preventDefault();
    const { alert, modals } = this.props;
    const { type } = modals.openSectionBountyModal.props;
    const { amount } = this.state;
    const sectionName = {
      takeaways: "Key Takeaways",
      summary: "Summary",
    };

    let text;

    if (amount === 0) {
      text = `Remove bounty for ${sectionName[type]}?`;
    } else {
      text = `Set a ${parseInt(amount, 10)} RSC bounty for ${
        sectionName[type]
      }?`;
    }

    alert.show({
      text,
      buttonText: "Yes",
      onClick: () => this.postBounty(),
    });
  };

  postBounty = () => {
    const { showMessage, modals } = this.props;
    const { amount } = this.state;
    const {
      type,
      paper,
      updatePaperState,
    } = modals.openSectionBountyModal.props;
    showMessage({ show: true, load: true });

    const params = {
      paperId: paper.id,
      type: type === "takeaways" ? "bulletpoint_bounty" : "summary_bounty",
      amount,
    };

    setSectionBounty(params)
      .then((res) => {
        this.showSuccessMessage();
        updatePaperState({ ...res });
        this.closeModal();
      })
      .catch(this.showErrorMessage);
  };

  renderSubtitle = () => {
    const { type } = this.props.modals.openSectionBountyModal.props;
    const sectionName = {
      takeaways: "Key Takeaways",
      summary: "Summary",
    };

    return `Select an amount to reward the first user who contributes content to the ${sectionName[type]}.`;
  };

  renderInput = () => {
    return (
      <div className={css(styles.column)}>
        <AmountInput
          value={this.state.amount}
          onChange={this.handleAmount}
          containerStyles={styles.amountInputContainer}
          inputContainerStyles={styles.amountInput}
          inputStyles={styles.amountInput}
          hideBalance={true}
          minValue={"0"}
          maxValue={Infinity}
        />
      </div>
    );
  };

  render() {
    const { modals } = this.props;
    const { amount } = this.state;
    return (
      <BaseModal
        isOpen={modals.openSectionBountyModal.isOpen}
        closeModal={this.closeModal}
        title={"Set Bounty"}
        subtitle={this.renderSubtitle()}
        modalContentStyle={styles.modalContentStyle}
        subtitleStyle={styles.subtitleStyle}
      >
        <form className={css(styles.form)} onSubmit={this.showConfirmation}>
          {this.renderInput()}
          <div className={css(styles.buttonContainer)}>
            <Button
              label="Confirm"
              customButtonStyle={styles.button}
              rippleClass={styles.button}
              type="submit"
            />
          </div>
        </form>
      </BaseModal>
    );
  }
}

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
  subtitleStyle: {
    lineHeight: 1.6,
    color: colors.BLACK(0.8),
    width: "100%",
    textAlign: "left",
    "@media only screen and (max-width: 557px)": {
      fontSize: 14,
      width: "100%",
    },
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
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  amountInputContainer: {
    width: "100%",
  },
  amountInput: {
    width: "100%",
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  openSectionBountyModal: ModalActions.openSectionBountyModal,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateUser: AuthActions.updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(ContentSupportModal));
