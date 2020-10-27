import { Fragment, useEffect, useState } from "react";
import { css, StyleSheet } from "aphrodite";
import { redirect } from "~/config/utils";
import { useRouter } from "next/router";
import { connect } from "react-redux";

// Component
import Loader from "~/components/Loader/Loader";
import StripeButton from "~/components/Stripe/StripeButton";
import StripeIntro from "~/components/Stripe/StripeIntro";

import { MessageActions } from "~/redux/message";

import API from "~/config/api";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";

const redirectPath = "contributions";

const StripeVerification = (props) => {
  const { auth, author } = props;
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (props.verify_stripe) {
      setPage(3);
      if (props.auth.isLoggedIn) {
        verifyStripe();
      }
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
            console.log("res", res);
            setFetching(false);
            setSuccess(res);
            setUrl(res.url);
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
    if (success && url) {
      return "Final Step!";
    }
    if (success) {
      return "Success!";
    } else {
      return "Something went wrong.";
    }
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
    return success && url ? (
      <span>
        Please verify your <a href={url}>Stripe Account.</a>
      </span>
    ) : (
      "Please try to connect your Stripe account again."
    );
  }

  function showLoader() {}

  function renderScreen() {
    switch (page) {
      case 1:
        return <StripeIntro onClick={() => setPage(2)} />;
      case 2:
        return (
          <div className={css(styles.content)}>
            <div className={css(styles.backButton)} onClick={() => setPage(1)}>
              {icons.longArrowLeft}
              <span className={css(styles.backButtonLabel)}>Back</span>
            </div>
            <div className={css(styles.titleContainer)}>
              <div className={css(styles.title)}>
                Connect with
                <img
                  className={css(styles.stripeLogo)}
                  src={"/static/icons/stripe.png"}
                />
              </div>
              <h3 className={css(styles.subtitle)}>
                A FAQ we've received is about the question "
                <b>Tell us about your business</b>".
              </h3>
            </div>
            <p className={css(styles.text)}>
              Here's an example that befits most users:
            </p>
            <div className={css(styles.exampleContainer)}>
              <img
                className={css(styles.example)}
                src="/static/stripe/example-one.png"
              />
              <img
                className={css(styles.example)}
                src="/static/stripe/example-two.png"
              />
            </div>
            <div className={css(styles.buttonContainer)} onClick={showLoader}>
              <StripeButton
                authorId={props.queryId}
                auth={auth}
                author={author}
                label={"Connect Stripe"}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={css(styles.content)}>
            <div className={css(styles.icons)}>
              <img
                className={css(styles.rhIcon)}
                src={"/static/ResearchHubLogo.png"}
                draggable={false}
              />
              <i className={css(styles.connectIcon) + " fas fa-link"} />
              <img
                className={css(styles.stripeIcon)}
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
                  <StripeButton
                    authorId={props.queryId}
                    auth={auth}
                    author={author}
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        break;
    }
  }

  return <div className={css(styles.page)}>{renderScreen()}</div>;
};

StripeVerification.getInitialProps = async ({ req, store, query, res }) => {
  const { authorId, verify_stripe } = query;
  let props = {
    queryId: Number(authorId),
    query,
  };

  if (verify_stripe) {
    props.verify_stripe = true;
  }

  return props;
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
    minHeight: "100vh",
    width: "100vw",
    overflow: "auto",
    paddingBottom: 50,
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
    position: "relative",
  },
  headerContainer: {
    maringTop: 20,
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
  exampleContainer: {
    marginBottom: 20,
    width: 300,
  },
  example: {
    width: 300,
  },
  titleContainer: {
    paddingTop: 20,
  },
  title: {
    margin: 0,
    padding: 0,
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
    margin: 0,
    padding: 0,
    marginTop: 15,
    fontSize: 16,
    minHeight: 22,
    maxWidth: 300,
    textAlign: "center",
    width: "100%",
    fontWeight: "400",
    color: "#4f4d5f",
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  text: {
    fontSize: 15,
    margin: "30px 0 10px",
    lineHeight: 1.4,
    // color: "#4f4d5f",
  },
  stripeLogo: {
    height: 40,
    paddingTop: 2,
    "@media only screen and (max-width: 415px)": {
      height: 35,
    },
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    color: colors.BLACK(0.5),
    textDecoration: "none",
    cursor: "pointer",
    fontSize: 14,
    ":hover": {
      color: colors.BLACK(1),
    },
    "@media only screen and (max-width: 767px)": {
      // top: -118,
      // left: 0,
    },
    "@media only screen and (max-width: 415px)": {
      // top: -90,
      // left: 20,
    },
  },
  backButtonLabel: {
    fontSize: 14,
    marginLeft: 8,
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  stripeIcon: {
    height: 25,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
  author: state.author,
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StripeVerification);
