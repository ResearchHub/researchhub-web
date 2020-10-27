import { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Confetti from "react-confetti";

// Component
import BaseModal from "./BaseModal";
import Button from "../Form/Button";
import StripeButton from "~/components/Stripe/StripeButton";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const StripeOnboardingModal = (props) => {
  const [userFirstVote, setFirstVote] = useState();
  // store.getState().auth.user.has_seen_first_coin_modal
  const [recycle, setRecycle] = useState(true);
  const [reveal, toggleReveal] = useState(false);
  const [showButton, toggleButton] = useState(false);

  useEffect(() => {
    toggleReveal(true);
  });

  function closeModal() {
    // toggleReveal(false)
    props.openStripeOnboardModal(false);
    enableParentScroll();
  }

  function enableParentScroll() {
    document.body.style.overflow = "scroll";
  }

  function openLinkInTab(e) {
    e.stopPropagation();
    let url = "https://www.stripe.com/about";
    let win = window.open(url, "_blank");
    win.focus();
  }

  return (
    <BaseModal
      isOpen={props.modals.openStripeOnboardModal}
      closeModal={closeModal}
      title={
        <div className={css(styles.container)}>
          Connect with
          <img
            className={css(styles.stripeLogo)}
            src={"/static/icons/stripe.png"}
          />
        </div>
      }
      modalContentStyle={styles.modalContentStyle}
      subtitle={() => {
        return (
          <div className={css(styles.row)}>
            Introducing another safe way to support research.
          </div>
        );
      }}
    >
      <div className={css(styles.modalBody)}>
        <Confetti
          // recycle={recycle}
          recycle={false}
          numberOfPieces={500}
          width={584}
          height={469}
        />
        <div className={css(styles.text)}>
          Stripe makes it easy to make safe and secure transactions online.{" "}
          <span className={css(styles.hyperlink)} onClick={openLinkInTab}>
            Click here to learn more.
          </span>
        </div>
        <div className={css(styles.body, reveal && styles.reveal)}>
          <StripeButton
            auth={props.auth}
            author={props.author}
            authorId={props.author.id}
            show={true}
            label="Connect Stripe"
          />
        </div>
      </div>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  coinIcon: {
    height: 20,
    marginLeft: 8,
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    zIndex: 9999999,
    padding: 16,
    boxSizing: "border-box",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    whiteSpace: "pre-wrap",
    marginTop: 20,
    transition: "all ease-in-out 0.3s",
  },
  hyperlink: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  reveal: {},
  text: {
    // marginTop: 10,
    marginBotttom: 30,
    lineHeight: 1.4,
  },
  button: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    transition: "all ease-in-out 0.3s",
    opacity: 0,
  },
  showButton: {
    opacity: 1,
  },
  modalContentStyle: {
    overflow: "hidden",
    maxWidth: 469,
  },
  stripeLogo: {
    height: 40,
    paddingTop: 2,
  },
});

const mapStateToProps = (state) => ({
  author: state.author,
  auth: state.auth,
  modals: state.modals,
});

const mapDispatchToProps = {
  openStripeOnboardModal: ModalActions.openStripeOnboardModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StripeOnboardingModal);
