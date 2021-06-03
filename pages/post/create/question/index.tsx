import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import React, { Fragment, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import Collapsible from "../../../../components/Form/Collapsible";

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
          <div className={css(styles.row)}>
            <AskQuestionForm />
            {/* <div className={css(styles.aboutContainer)}>
              <div className={css(styles.aboutTitle)}>
                <img
                  src={"/static/ResearchHubIcon.png"}
                  className={css(styles.rhIcon)}
                />
                <div className={css(styles.aboutTitleText)}>
                  Posting to Research Hub
                </div>
              </div>
              <Collapsible
                className={css(styles.collapsibleSection)}
                openedClassName={css(
                  styles.collapsibleSection,
                  styles.sectionOpened
                )}
                triggerClassName={css(styles.maxWidth)}
                triggerOpenedClassName={css(styles.maxWidth)}
                contentInnerClassName={css(styles.collapsibleContent)}
                open={true}
                trigger="What can you post here?"
              >
              </Collapsible>
            </div> */}
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
    // justifyContent: "center",
    // alignItems: "flex-start",
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

  aboutContainer: {
    display: "flex",
    flexDirection: "column",
    // width: "100%",
    // maxWidth: "297px",
    marginLeft: "30px",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "24px 21px",
    alignSelf: "stretch",
  },
  aboutTitle: {
    display: "flex",
  },
  aboutTitleText: {
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "14px",
    letterSpacing: "1.2px",
    textTransform: "uppercase",

    margin: "auto 18px",
    color: "#241F3A",
    opacity: 0.4,
  },
  rhIcon: {
    width: "20px",
    height: "31px",
  },
});
