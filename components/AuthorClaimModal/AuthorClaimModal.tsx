import { createAuthorClaimCase } from "./api/authorClaimCaseCreate";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";

import colors from "../../config/themes/colors";
import Loader from "../Loader/Loader";
import Modal from "react-modal";
import React, { Fragment, ReactElement, SyntheticEvent, useState } from "react";

// Components
import Button from "../Form/Button";
import FormInput from "../Form/FormInput";
import BaseModal from "../Modals/BaseModal";

// Redux
import { ModalActions } from "../../redux/modals";

function validateEmail(email: string): boolean {
  // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // const splitted = email.split(".");
  // return (
  //   re.test(String(email).toLowerCase()) &&
  //   splitted[splitted.length - 1] === ".edu"
  // );
  return true;
}

class AuthorClaimModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eduEmail: "",
    };

    // Temporary
    const isSubmitting = false;
    const shouldDisplayError = false;
    const onEmailChange = (fieldID: string, value: string): void => {
      this.setState({
        eduEmail: value,
      });
      // setFormErrors({
      //   ...formErrors,
      //   [fieldID]: validateFormField(fieldID, value),
      // });
    };

    this.prompts = [
      // First Prompt (0)
      <div className={css(verifStyles.rootContainer)}>
        <div className={css(verifStyles.titleContainer)}>
          <div className={css(verifStyles.title)}>
            {"Enter your .edu email"}
          </div>
        </div>
        <div className={css(verifStyles.subTextContainer)}>
          <div className={css(verifStyles.subText)}>
            Verify your .edu email address
          </div>
        </div>
        <form
          encType="multipart/form-data"
          className={css(verifStyles.form)}
          onSubmit={this.handleValidationAndSubmit}
        >
          <FormInput
            containerStyle={modalBodyStyles.containerStyle}
            disable={isSubmitting}
            id="eduEmail"
            label="Email"
            labelStyle={verifStyles.labelStyle}
            // inputStyle={shouldDisplayError && modalBodyStyles.error}
            onChange={onEmailChange}
            placeholder="Academic .edu email address"
            required
          />
          <div className={css(verifStyles.buttonContainer)}>
            <Button
              label="Verify Email"
              type="Submit"
              customButtonStyle={verifStyles.buttonCustomStyle}
              rippleClass={verifStyles.rippleClass}
            />
          </div>
        </form>
      </div>,
      // Second Prompt (1)
      <div className={css(successStyles.rootContainer)}>
        <img
          src={"/static/icons/success2.png"}
          className={css(successStyles.successImg)}
          draggable={false}
        />
        <div className={css(successStyles.titleContainer)}>
          <div className={css(successStyles.title)}>{"Thank you!"}</div>
        </div>
        <div className={css(successStyles.subTextContainer)}>
          <div className={css(successStyles.subText)}>
            Your request has been submitted. We will send you an email
            confirmation with a link to verify your identity.
          </div>
        </div>
        <div className={css(successStyles.buttonContainer)}>
          <Button
            label={"Got It"}
            customButtonStyle={successStyles.buttonCustomStyle}
            rippleClass={successStyles.rippleClass}
            onClick={this.handleContinue}
          />
        </div>
      </div>,
    ];
  }

  handleValidationAndSubmit = (e) => {
    e && e.preventDefault();

    const { author, auth } = this.props;

    if (validateEmail(this.state.eduEmail)) {
      createAuthorClaimCase({
        eduEmail: this.state.eduEmail,
        onError: (): void => {},
        onSuccess: (): void => {
          this.handleContinue();
        },
        targetAuthorID: author.id,
        userID: auth.user.id,
      });
    } else {
    }
  };

  saveAndCloseModal = (e) => {
    e && e.preventDefault();
    this.props.openAuthorClaimModal(false);
  };

  handleContinue = (e) => {
    // Advance to next step
    e && e.preventDefault();
    const { openAuthorClaimModal, step } = this.props;
    if (step >= this.prompts.length - 1) {
      openAuthorClaimModal(false, step);
    } else {
      openAuthorClaimModal(true, step + 1);
    }
  };

  render() {
    const { modals, step } = this.props;

    return (
      <BaseModal
        isOpen={modals.openAuthorClaimModal}
        closeModal={this.saveAndCloseModal}
        modalStyle={styles.modalStyle}
        title="Select your post type"
        textAlign="left"
        removeDefault={true}
        modalContentStyle={styles.modalContentStyles}
      >
        <img
          src="/static/icons/close.png"
          className={css(styles.closeButton)}
          onClick={this.saveAndCloseModal}
          draggable={false}
          alt="Close Button"
        />
        {this.prompts[step]}
      </BaseModal>
    );
  }
}
const mapStateToProps = (state) => ({
  modals: state.modals,
  step: state.modals.authorClaimStep,
});

const mapDispatchToProps = {
  openAuthorClaimModal: ModalActions.openAuthorClaimModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorClaimModal);

const modalBodyStyles = StyleSheet.create({
  buttonStyle: {
    height: 45,
    width: 140,
  },
  cancelButtonStyle: {
    backgroundColor: colors.RED(1),
    height: 45,
    marginLeft: 16,
    width: 140,
    ":hover": {
      backgroundColor: colors.RED(1),
    },
  },
  containerStyle: {
    "@media only screen and (max-width: 665px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 338,
    },
    "@media only screen and (max-width: 321px)": {
      width: 270,
      marginBottom: 5,
    },
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  form: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontSize: 13,
    },
  },
  loaderStyle: {
    display: "unset",
  },
  modalBody: {
    alignItems: "center",
    backgroundColor: "#fff",
    border: `1px solid ${colors.GREY(1)}`,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    width: 640,
    padding: "16px 0",
    "@media only screen and (max-width: 665px)": {
      width: 420,
    },
    "@media only screen and (max-width: 415px)": {
      width: 360,
    },
    "@media only screen and (max-width: 321px)": {
      width: 320,
    },
  },
});

const styles = StyleSheet.create({
  modalStyle: {
    maxHeight: "95vh",
    // overflowY: "scroll",
    width: "625px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  rippleClass: {
    width: "100%",
  },
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  modalContentStyles: {
    padding: 0,
  },
});

const verifStyles = StyleSheet.create({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "51px 90px 40px 90px",
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (min-width: 768px)": {
      overflowY: "auto",
    },
  },
  form: {
    width: "auto",
    position: "relative",
  },
  labelStyle: {
    "@media only screen and (max-width: 321px)": {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#241F3A",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "auto",
    zIndex: 2,
    marginTop: 40,
  },
  buttonCustomStyle: {
    padding: "18px 21px",
    width: "258px",
    height: "55px",
    fontSize: "16px",
    lineHeight: "19px",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  rippleClass: {},
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    marginBottom: "7px",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  subTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
  },
  subText: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "22px",

    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#241F3A",
    opacity: 0.8,
  },
  modalContentStyles: {},
});

const successStyles = StyleSheet.create({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "46px 90px 40px 90px",
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (min-width: 768px)": {
      overflowY: "auto",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    width: "auto",
    zIndex: 2,
    marginTop: 25,
  },
  buttonCustomStyle: {
    padding: "18px 21px",
    width: "258px",
    height: "55px",
    fontSize: "16px",
    lineHeight: "19px",
    "@media only screen and (max-width: 415px)": {
      width: "100%",
    },
  },
  rippleClass: {},
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    marginBottom: "7px",
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
  subTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
  },
  subText: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "22px",

    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#241F3A",
    opacity: 0.8,
  },
  modalContentStyles: {},
  successImg: {
    marginBottom: 25,
  },
});
