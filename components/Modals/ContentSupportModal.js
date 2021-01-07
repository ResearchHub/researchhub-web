import React, { Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import { withAlert } from "react-alert";

// Components
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import { AmountInput, RecipientInput } from "../Form/RSCForm";
import FormSelect from "../Form/FormSelect";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import { AuthActions } from "~/redux/auth";

// Config
import API from "~/config/api";
import { supportContent } from "../../config/fetch";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";
import { sanitizeNumber } from "~/config/utils";

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

  closeModal = () => {
    this.props.openContentSupportModal(false, { data: {}, metaData: {} });
    this.setState({ ...this.initialState });
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
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
    setMessage("ResearchCoin succesfully awarded!");
    showMessage({ show: true });
  };

  showErrorMessage = (err) => {
    const { setMessage, showMessage } = this.props;
    showMessage({ show: false });
    setMessage("Something went wrong. Please try again.");
    showMessage({ show: true, error: true });
  };

  handleTransaction = () => {
    const { showMessage, updateUser, modals, auth } = this.props;
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
    return (
      <Fragment>
        <div className={css(styles.row)}>
          <AmountInput value={this.state.amount} onChange={this.handleAmount} />
          <RecipientInput author={this.getAuthorProfile()} />
        </div>
        <div className={css(styles.column)}>
          <RecipientInput
            author={this.getAuthorProfile()}
            containerStyles={styles.recipientContainer}
            cardStyles={styles.recipientCard}
          />
          <AmountInput
            value={this.state.amount}
            onChange={this.handleAmount}
            containerStyles={styles.amountInputContainer}
            inputContainerStyles={styles.amountInput}
            inputStyles={styles.amountInput}
            rightAlignBalance={true}
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
        title={"Award ResearchCoin"}
        subtitle={
          <Fragment>
            Support the author, or contributor, by giving them ResearchCoin, or
            RSC.{" "}
            <a
              href={
                "https://www.notion.so/researchhub/RSC-Promotion-f3cb4ee4487046d88201062b1d6b1efa"
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
        <form className={css(styles.form)} onSubmit={this.confirmTransaction}>
          {this.renderInputs()}
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
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
)(withAlert()(ContentSupportModal));
