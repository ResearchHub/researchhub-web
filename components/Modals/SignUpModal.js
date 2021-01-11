import { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { useDispatch, useStore } from "react-redux";

// Component
import BaseModal from "./BaseModal";
import GoogleLoginButton from "../GoogleLoginButton";

// Redux
import { ModalActions } from "~/redux/modals";

// Config
import { RHLogo } from "~/config/themes/icons";

const SignUpModal = (props) => {
  const dispatch = useDispatch();
  const store = useStore();

  // const [offset, setOffset] = useState(props.paperCardRef.current && props.paperCardRef.current.clientHeight + 80)

  function closeModal() {
    dispatch(ModalActions.openSignUpModal(false));
    enableParentScroll();
  }

  function enableParentScroll() {
    document.body.style.overflow = "scroll";
  }

  function renderDivider() {
    return (
      <div className={css(styles.row, styles.divider)}>
        <div className={css(styles.line)} />
        <div className={css(styles.lineText)}>or</div>
        <div className={css(styles.line)} />
      </div>
    );
  }

  function calculateOffset(mobileState) {
    let offset =
      props.paperCardRef.current && props.paperCardRef.current.clientHeight;
    if (!mobileState) {
      offset += 80;
    }
    setOffset(offset);
  }

  return (
    <BaseModal
      isOpen={useStore().getState().modals.openSignUpModal}
      closeModal={closeModal}
      title={() => {
        return <RHLogo iconStyle={styles.logo} />;
      }}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      subtitle={() => {
        return (
          <div className={css(styles.title)}>Welcome to our community!</div>
        );
      }}
    >
      <div className={css(styles.modalBody)}>
        <div className={css(styles.subtitle)}>
          Join today and earn 50 RSC
          <img
            className={css(styles.coinIcon)}
            src={"/static/icons/coin-filled.png"}
            alt="RSC Coin"
          />
        </div>

        <div className={css(styles.googleButton)}>
          <GoogleLoginButton customLabel={"Sign in with Google"} />
        </div>
        {renderDivider()}
        <div className={css(styles.loginContainer)}>
          {"Already a member? "}
          <GoogleLoginButton customLabel={"Login"} hideButton={true} />
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    "@media only screen and (max-width: 665px)": {
      width: "unset",
    },
  },
  modalContentStyle: {
    overflow: "hidden",
    width: 400,
    boxSizing: "border-box",
    padding: 25,
  },
  title: {
    paddingTop: 15,
    fontSize: 24,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    width: "100%",
  },
  titleText: {},
  coinIcon: {
    height: 20,
    marginLeft: 8,
  },
  logo: {
    width: 120,
    objectFit: "contain",
  },
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  divider: {
    padding: "20px 15px",
    boxSizing: "border-box",
    justifyContent: "space-between",
  },
  line: {
    backgroundColor: "#DBDBDB",
    height: 1,
    width: "42%",
  },
  lineText: {
    color: "#8E8E8E",
    textTransform: "uppercase",
    fontSize: 13,
    fontWeight: 600,
  },
  modalBody: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    zIndex: 9999999,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    marginTop: 20,
  },
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 15,
    whiteSpace: "pre-wrap",
    cursor: "default",
  },
});

export default SignUpModal;
