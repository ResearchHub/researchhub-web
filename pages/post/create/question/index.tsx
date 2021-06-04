import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import React, { Fragment, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import AboutQuestionCard from "./AboutQuestionCard";

export default function Index() {
  return (
    <Fragment>
      <Head
        title={`Ask a Question`}
        description="Ask a Question to ResearchHub"
      />
      <div className={css(styles.background)}>
        <div className={css(styles.content)}>
          <div className={css(styles.title)}>Ask a Question</div>
          <AboutQuestionCard isOpen={false} customStyle={styles.cardOnTop} />
          <div className={css(styles.row)}>
            <AskQuestionForm />
            <AboutQuestionCard isOpen={true} customStyle={styles.cardOnSide} />
          </div>
        </div>
      </div>
    </Fragment>
  );
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
      paddingLeft: 50,
      minWidth: 0,
    },
  },
  cardOnSide: {
    width: "100%",
    maxWidth: "297px",
    marginLeft: "30px",
    maxHeight: 455,
    "@media only screen and (max-width: 1209px)": {
      /* 1209px is cutoff when AboutQuestionCard has room to fit on the side */
      display: "none",
    },
  },
});
