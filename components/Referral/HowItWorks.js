import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";

const Step = ({ text, icon, title }) => {
  return (
    <div className={css(styles.step)}>
      <div className={css(styles.icon)}>{icon}</div>
      <h4 className={css(styles.title)}>{title}</h4>
      <p className={css(styles.stepText)}>{text}</p>
    </div>
  );
};

const HowItWorks = (props) => {
  return (
    <div className={css(styles.steps)}>
      <Step
        text={
          "Send your referral link to fellow researchers, scientists, & friends."
        }
        title={"Send Invitation"}
        icon={<img src={"/static/referrals/first-step.svg"}></img>}
      />
      <img
        src={"/static/dotted-down.svg"}
        className={css(styles.dotted, styles.dottedDown)}
      />
      <Step
        text={
          "Upvote, comment, upload a paper, or add a key takeaway after signing up."
        }
        title={"Contribute"}
        icon={<img src={"/static/referrals/second-step.svg"}></img>}
      />
      <img
        src={"/static/dotted-up.svg"}
        className={css(styles.dotted, styles.dottedUp)}
      />
      <Step
        text={"After signing up & contributing, each of you earn 50 RSC."}
        title={"Earn RSC"}
        icon={<img src={"/static/referrals/third-step.svg"} />}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  steps: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: 900,
    margin: "0 auto",
    marginTop: 24,

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  step: {
    width: "25%",
    padding: 16,
    textAlign: "center",

    "@media only screen and (max-width: 767px)": {
      width: "unset",
    },
  },
  title: {
    margin: 0,
    marginTop: 16,
    letterSpacing: 0.4,
    fontWeight: 500,
    fontSize: 18,
  },
  stepText: {
    lineHeight: 1.4,
    opacity: 0.8,
  },
  icon: {},
  dotted: {
    width: 150,
    "@media only screen and (max-width: 767px)": {
      height: 20,
    },
  },
  dottedUp: {
    height: 150,
  },
  dottedDown: {
    height: 120,
  },
});

export default HowItWorks;
