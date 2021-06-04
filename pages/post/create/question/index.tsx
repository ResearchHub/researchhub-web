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
          <AskQuestionForm />
          <div className={css(styles.row)}>
            {/* <AskQuestionForm /> */}
            {/* <AboutQuestionCard /> */}
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
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
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
  },
  content: {
    display: "flex",
    width: "100%",
    // maxWidth: "1278px",
    maxWidth: "951px",
    flexDirection: "column",
    "@media only screen and (max-width: 767px)": {
      alignItems: "center",
    },
  },
  row: {
    display: "flex",
  },
});
