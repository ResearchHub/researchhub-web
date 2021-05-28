import Button from "../Form/Button";
import colors from "../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import FormInput from "../Form/FormInput";
import Loader from "../Loader/Loader";
import React from "react";

export default {
  enterEmail: (handleValidationAndSubmit, isSubmitting, onEmailChange) => (
    <div className={css(verifStyles.rootContainer)}>
      <div className={css(verifStyles.titleContainer)}>
        <div className={css(verifStyles.title)}>Enter your .edu email</div>
      </div>
      <div className={css(verifStyles.subTextContainer)}>
        <div className={css(verifStyles.subText)}>
          Verify your .edu email address
        </div>
      </div>
      <form
        encType="multipart/form-data"
        className={css(verifStyles.form)}
        onSubmit={handleValidationAndSubmit}
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
            label={
              isSubmitting ? (
                <Loader
                  size={8}
                  loading
                  containerStyle={modalBodyStyles.loaderStyle}
                  color="#fff"
                />
              ) : (
                "Verify Email"
              )
            }
            type="submit"
            customButtonStyle={verifStyles.buttonCustomStyle}
            rippleClass={verifStyles.rippleClass}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  ),
  success: (handleContinue) => (
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
          label="Got It"
          customButtonStyle={successStyles.buttonCustomStyle}
          rippleClass={successStyles.rippleClass}
          onClick={handleContinue}
        />
      </div>
    </div>
  ),
};
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

const modalBodyStyles = StyleSheet.create({
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
});
