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
import { HubActions } from "~/redux/hub";

// Config
import API from "~/config/api";
import { supportContent } from "../../config/fetch";
import { Helpers } from "@quantfive/js-web-config";
import colors from "../../config/themes/colors";

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
    this.props.openContentSupportModal(false);
    this.setState({ ...this.initalState });
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
  };

  handleAmount = (e) => {
    this.setState({
      amount: e.target.value,
    });
  };

  handleTransaction = () => {
    const { setMessage, showMessage, modals, auth } = this.props;
    const { data, metaData, setCount } = modals.openContentSupportModal.props;

    supportContent({ ...metaData, amount: this.state.amount }).then((res) => {
      console.log("res", res);
      setCount(this.state.amount);
    });
  };

  confirmTransaction = (e) => {
    e && e.stopPropagation();
    e && e.preventDefault();

    const { alert, setMessage, showMessage } = this.props;
    const { amount } = this.state;

    alert.show({
      text: `Award ${amount} ResearchCoin to this post?`,
      buttonText: "Yes",
      onClick: () => this.handleTransaction(),
    });
  };

  renderInputs = () => {
    return (
      <Fragment>
        <div className={css(styles.row)}>
          <AmountInput value={this.state.amount} onChange={this.handleAmount} />
          <RecipientInput />
        </div>
        <div className={css(styles.column)}>
          <RecipientInput
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
          "Support the author, or contributor, by giving them RSC. Learn more about RSC and how it can be used."
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
});

const mapStateToProps = (state) => ({
  modals: state.modals,
  auth: state.auth,
});

const mapDispatchToProps = {
  openContentSupportModal: ModalActions.openContentSupportModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(ContentSupportModal));
