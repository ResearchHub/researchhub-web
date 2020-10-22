import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";

// Helpers
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

// Components
import ComponentWrapper from "~/components/ComponentWrapper";
import CustomHead from "~/components/Head";
import GoogleLoginButton from "../../../components/GoogleLoginButton";
import HowItWorks from "../../../components/Referral/HowItWorks";

const Index = ({ code, user }) => {
  useEffect(() => {
    window.localStorage.setItem("referralCode", code);
  }, []);

  const loginCallback = () => {
    window.location.href = "/";
  };

  return (
    <div className={css(styles.container)}>
      <ComponentWrapper overrideStyle={styles.componentWrapper}>
        <div className={css(styles.componentContainer)}>
          <img
            className={css(styles.beakerImg)}
            src={"/static/about/about-hubs.png"}
          />
          <div className={css(styles.signinContainer)}>
            <h1 className={css(styles.title)}>
              {user.author_profile.first_name} has invited you to ResearchHub
            </h1>
            <p className={css(styles.text)}>
              Sign up for ResearchHub now and contribute to earn you and{" "}
              {user.author_profile.first_name} a referral bonus of 125 RSC.
            </p>
            <GoogleLoginButton
              customLabel={
                "Sign In With Google and contribute to receive 125 RSC"
              }
              rippleClass={styles.buttonClass}
              styles={[styles.buttonClass, styles.buttonContainer]}
              customLabelStyle={styles.customLabelStyle}
              loginCallback={loginCallback}
            />
          </div>
        </div>
        <div className={css(styles.howItWorksSection)}>
          <h2 className={css(styles.howItWorksTitle)}> How It Works </h2>
          <HowItWorks />
        </div>
      </ComponentWrapper>
      <CustomHead title="ResearchHub Referral Program" />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    color: "#241F3A",
  },
  text: {
    lineHeight: 1.4,
    fontSize: 18,
  },
  buttonClass: {
    width: "100%",
  },
  buttonContainer: {
    height: 65,
  },
  customLabelStyle: {
    fontSize: 18,
  },
  howItWorksSection: {
    marginTop: 55,
    paddingBottom: 55,
  },
  howItWorksTitle: {
    textAlign: "center",
    fontSize: 33,
    fontWeight: 500,

    "@media only screen and (max-width: 767px)": {
      marginTop: 50,
    },
  },
  title: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    color: "#241F3A",
    fontWeight: 400,
    fontSize: 33,
    flexWrap: "wrap",
    whiteSpace: "pre-wrap",
    width: "100%",
    textAlign: "center",
    padding: 0,
    margin: 0,
    "@media only screen and (min-width: 800px)": {
      textAlign: "left",
      paddingRight: 16,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 33,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 416px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  componentWrapper: {
    "@media only screen and (min-width: 1440px)": {
      width: 1050,
    },
  },
  beakerImg: {
    height: 550,
    paddingRight: 50,
  },
  componentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
  },
  signinContainer: {
    borderRadius: 16,
    // border: '1px solid #ddd',
    padding: 16,
    width: 550,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const fetchReferralUser = (referralCode) => {
  return fetch(API.USER({ referralCode }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res) => {
      return res.results[0];
    });
};

Index.getInitialProps = async (ctx) => {
  let { query } = ctx;
  let code = query.referralCode;

  let user = await fetchReferralUser(code);
  return { user, code, query };
};

export default connect(mapStateToProps)(Index);
