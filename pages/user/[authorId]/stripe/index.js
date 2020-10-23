import { Fragment, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { redirect } from "~/config/utils";
import Router from "next/router";
import Error from "next/error";
import Loader from "~/components/Loader/Loader";
import StripeButton from "~/components/Stripe/StripeButton";

import { connect } from "react-redux";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const redirectPath = "contributions";

const StripeVerification = (props) => {
  const { auth } = props;
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (props.auth.isLoggedIn) {
      verifyStripe();
    }
  }, [props.auth.isLoggedIn]);

  function verifyStripe() {
    setFetching(true);

    if (props.auth.isLoggedIn) {
      if (props.queryId == props.user.author_profile.id) {
        fetch(API.VERIFY_STRIPE({ authorId: props.queryId }), API.GET_CONFIG)
          .then(Helpers.checkStatus)
          .then(Helpers.parseJSON)
          .then((res) => {
            setFetching(false);
            setSuccess(res);
          })
          .catch((err) => {
            setFetching(false);
            setSuccess(false);
          });
      }
    }
  }

  function renderHeader() {
    if (!props.auth.isLoggedIn) {
      return "Please login to continue";
    }
    if (props.queryId != props.user.author_profile.id) {
      return "Incorrect user page";
    }
    if (fetching) {
      return "Verifying Stripe Connection";
    }
    return success ? "Success!" : "Something went wrong.";
  }

  function renderText() {
    if (!props.auth.isLoggedIn) {
      return null;
    }
    if (props.queryId != props.user.author_profile.id) {
      return null;
    }
    if (fetching) {
      return <Loader key={"stripe-loader"} loading={true} />;
    }
    return success
      ? "Your Stripe Account is verified."
      : "Please try to connect your Stripe account again.";
  }

  return (
    <div className={css(styles.page)}>
      <div className={css(styles.content)}>
        <div className={css(styles.icons)}>
          <img
            className={css(styles.rhIcon)}
            src={"/static/ResearchHubLogo.png"}
            draggable={false}
          />
          <i className={css(styles.connectIcon) + " fas fa-link"} />
          <img
            className={css(styles.stripeLogo)}
            src={"/static/icons/stripe.png"}
          />
        </div>
        <div className={css(styles.headerContainer)}>
          <React.Fragment>
            <h1 className={css(styles.header, success && styles.green)}>
              {renderHeader()}
            </h1>
            <p className={css(styles.description)}>{renderText()}</p>
          </React.Fragment>
          {!fetching && !success && (
            <div className={css(styles.buttonContainer)}>
              <StripeButton authorId={props.queryId} auth={auth} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StripeVerification.getInitialProps = async (ctx) => {
  const { req, store, query, res } = ctx;
  let queryId = Number(query.authorId);

  return { queryId, store };
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    background: "url(/static/background/background-modal.png) #FCFCFC",
    backgroundSize: "cover",
    paddingTop: 50,
    height: "100vh",
    width: "100vw",
  },
  content: {
    padding: "30px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    border: "1px solid #E7E7E7",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  },
  headerContainer: {
    maringTop: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
  },
  green: {
    // color: colors.GREEN
  },
  description: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
    textAlign: "center",
    fontWeight: 400,
  },
  icons: {
    display: "flex",
    alignItems: "center",
  },
  rhIcon: {
    height: 25,
    paddingBottom: 9,
  },
  stripeLogo: {
    height: 28,
  },
  linkIcon: {
    margin: "0px 13px",
    color: colors.GREY(),
    fontSize: 14,
  },
  buttonWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  error: {
    marginTop: 0,
    marginBottom: 15,
    color: colors.RED(),
    fontSize: 13,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  errorIcon: {
    color: colors.RED(),
    fontSize: 14,
    marginRight: 5,
  },
  connectIcon: {
    paddingLeft: 10,
    paddingRight: 5,
    color: colors.BLACK(0.6),
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(StripeVerification);
