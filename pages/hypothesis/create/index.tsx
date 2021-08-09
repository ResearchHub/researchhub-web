import AboutQuestionCard from "./AboutQuestionCard";
import AskQuestionForm from "../../../components/Paper/AskQuestionForm";
import Head from "../../../components/Head";
import React, { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import killswitch from "../../../config/killswitch/killswitch";
import { css, StyleSheet } from "aphrodite";

export default function Index() {
  const router = useRouter();
  const enableHypothesis = killswitch("hypothesis");
  useEffect(() => {
    if (!enableHypothesis) {
      router.push("/all");
    }
  }, [enableHypothesis, router.pathname]);
  if (enableHypothesis) {
    return (
      <Fragment>
        <Head
          title={`New Post`}
          description="Create a Hypothesis on ResearchHub"
        />
        <div className={css(styles.background)}>
          <div className={css(styles.content)}>
            <div className={css(styles.title)}>Create a Hypothesis</div>
            <AboutQuestionCard customStyle={styles.cardOnTop} isOpen={false} />
            <div className={css(styles.row)}>
              <AskQuestionForm />
              <AboutQuestionCard
                customStyle={styles.cardOnSide}
                isOpen={true}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FCFCFC",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    scrollBehavior: "smooth",
    position: "relative",
    minHeight: "100vh",
    paddingTop: "45px",
    "@media only screen and (max-width: 1209px)": {
      marginRight: "5vw",
      marginLeft: "5vw",
    },
  },
  title: {
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "38px",
    marginBottom: "30px",
    "@media only screen and (max-width: 767px)": {
      alignItems: "center",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    marginBottom: "60px",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    // flexWrap: "wrap-reverse",
  },
  cardOnTop: {
    display: "none",
    "@media only screen and (max-width: 1209px)": {
      /* 1209px is cutoff when AboutQuestionCard no longer fits on the side and must go to top */
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      marginBottom: 30,
    },
  },
  cardOnSide: {
    width: "100%",
    maxWidth: "297px",
    marginLeft: "30px",
    "@media only screen and (max-width: 1209px)": {
      /* 1209px is cutoff when AboutQuestionCard has room to fit on the side */
      display: "none",
    },
  },
});
