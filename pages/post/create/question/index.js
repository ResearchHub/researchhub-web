import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import React, { Fragment, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";

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
    width: "100%",
    marginBottom: "30px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
});
