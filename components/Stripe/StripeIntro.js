import { Fragment, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import Confetti from "react-confetti";

// Component
import StripeButton from "~/components/Stripe/StripeButton";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const StripeIntro = (props) => {
  const {
    removeHeader, // for modal,
    reveal,
  } = props;

  function openLinkInTab(e) {
    e.stopPropagation();
    let url = "https://www.stripe.com/about";
    let win = window.open(url, "_blank");
    win.focus();
  }

  function renderHeader() {
    return (
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.title)}>
          Connect with
          <img
            className={css(styles.stripeLogo)}
            src={"/static/icons/stripe.png"}
          />
        </div>
        <div className={css(styles.subtitle)}>
          Introducing another safe way to support research.
        </div>
      </div>
    );
  }

  return (
    <div className={css(styles.content)}>
      {!removeHeader && renderHeader()}
      <div className={css(styles.text)}>
        Stripe makes it easy to make safe and secure transactions online.{" "}
        <span className={css(styles.hyperlink)} onClick={openLinkInTab}>
          Click here to learn more.
        </span>
      </div>
      <div className={css(styles.buttonContainer)}>
        <StripeButton
          auth={props.auth}
          author={props.author}
          authorId={props.author.id}
          show={true}
          label={
            <span>
              Next
              <i className={css(styles.iconRight) + " far fa-arrow-right"} />
            </span>
          }
          onClick={props.onClick && props.onClick}
          hideIcon={true}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "30px 30px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    borderRadius: 10,
    border: "1px solid #E7E7E7",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    boxSizing: "border-box",
    marginBottom: 20,
  },
  title: {
    fontWeight: "500",
    height: 30,
    width: "100%",
    fontSize: 26,
    color: "#232038",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 22,
    },
  },
  subtitle: {
    marginTop: 15,
    fontSize: 16,
    minHeight: 22,
    width: "100%",
    fontWeight: "400",
    color: "#4f4d5f",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  hyperlink: {
    color: colors.BLUE(1),
    cursor: "pointer",
    ":hover": {
      textDecoration: "underline",
    },
  },
  stripeLogo: {
    height: 40,
    paddingTop: 2,
    "@media only screen and (max-width: 415px)": {
      height: 35,
    },
  },
  reveal: {},
  text: {
    maxWidth: 350,
    lineHeight: 1.4,
    textAlign: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  buttonContainer: {
    marginTop: 25,
  },
  iconRight: {
    color: "#FFF",
    fontSize: 14,
    marginLeft: 10,
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
)(StripeIntro);
