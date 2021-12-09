import Button from "../Form/Button";
import { css, StyleSheet } from "aphrodite";

export type AuthorClaimPromptSuccessProps = {
  handleContinue: Function;
};

export default function AuthorClaimPromptSuccess({
  handleContinue,
}: AuthorClaimPromptSuccessProps) {
  return (
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
        {/* @ts-ignore */}
        <Button
          label="Got It"
          customButtonStyle={successStyles.buttonCustomStyle}
          rippleClass={successStyles.rippleClass}
          onClick={handleContinue}
        />
      </div>
    </div>
  );
}

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
    fontWeight: 500,
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    "@media only screen and (max-width: 557px)": {
      fontSize: 24,
      width: 380,
    },
    "@media only screen and (max-width: 725px)": {
      width: 450,
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
