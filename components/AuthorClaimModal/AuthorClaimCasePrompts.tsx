import React from "react";
import { css, StyleSheet } from "aphrodite";
import FormInput from "../Form/FormInput";
import Button from "../Form/Button";
import CheckBox from "../Form/CheckBox";
import Loader from "../Loader/Loader";
import colors from "../../config/themes/colors";

export default {
  acceptRejectUser: (
    acceptReject: "accept" | "reject",
    handleContinue,
    handleSelect,
    requestorFaceImg,
    requestorName,
    isSubmitting: boolean,
    isSpammer = false
  ) => (
    <div className={css(acceptRejectStyles.rootContainer)}>
      <div className={css(acceptRejectStyles.titleContainer)}>
        <div className={css(acceptRejectStyles.title)}>
          {`Are you sure you want to ${acceptReject} the following user?`}
        </div>
      </div>
      <div className={css(acceptRejectStyles.userMediaContianer)}>
        <div className={css(acceptRejectStyles.requestorContainer)}>
          <img
            className={css(acceptRejectStyles.requestorFaceImg)}
            src={requestorFaceImg}
          />
          <span className={css(acceptRejectStyles.requestorName)}>
            {requestorName}
          </span>
        </div>
      </div>
      {acceptReject === "reject" && (
        <div className={css(acceptRejectStyles.checkboxContainer)}>
          <CheckBox
            active={isSpammer}
            isSquare={true}
            id="spammer"
            onChange={handleSelect}
            label="Mark this user as spammer"
            labelStyle={acceptRejectStyles.checkboxLabel}
          />
        </div>
      )}
      <div className={css(acceptRejectStyles.buttonContainer)}>
        <Button
          label={`${acceptReject} User`}
          disabled={isSubmitting}
          customButtonStyle={acceptRejectStyles.buttonCustomStyle}
          rippleClass={acceptRejectStyles.rippleClass}
          onClick={handleContinue}
        />
      </div>
    </div>
  ),
};

const acceptRejectStyles = StyleSheet.create({
  userMediaContianer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "525px",
    height: "110px",
    background: "#FAFAFA",
    border: "1.5px solid #F0F0F0",
    boxSizing: "border-box",
    borderRadius: "4px",

    marginTop: 52,
  },
  requestorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  requestorFaceImg: {
    borderRadius: "50%",
    height: 60,
    marginRight: 20,
    width: 60,
  },
  requestorName: {
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#241F3A",
  },
  checkboxContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",

    marginTop: 22,
  },
  checkboxLabel: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "22px",

    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#241F3A",
    opacity: 0.8,

    marginLeft: 16,
  },
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "40px 50px",
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
    marginTop: 32,
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
    textTransform: "capitalize",
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
    fontWeight: 500,
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
