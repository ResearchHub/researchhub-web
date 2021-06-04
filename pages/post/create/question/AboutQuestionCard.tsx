import React, { Fragment, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import Collapsible from "../../../../components/Form/Collapsible";

export default function AboutQuestionCard() {
  return (
    <div className={css(styles.aboutContainer)}>
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
        openedClassName={css(styles.collapsibleSection, styles.sectionOpened)}
        triggerClassName={css(styles.maxWidth)}
        triggerOpenedClassName={css(styles.maxWidth)}
        contentInnerClassName={css(styles.collapsibleContent)}
        open={true}
        trigger="What can you post here?"
      >
        <ol className={css(styles.orderedList)}>
          <li>Ask a question</li>
          <li>Start Discussion about a certain topic</li>
          <li>Post a relevant photo to a hub</li>
        </ol>
      </Collapsible>
      <Collapsible
        className={css(styles.collapsibleSection)}
        openedClassName={css(styles.collapsibleSection, styles.sectionOpened)}
        triggerClassName={css(styles.maxWidth)}
        triggerOpenedClassName={css(styles.maxWidth)}
        contentInnerClassName={css(styles.collapsibleContent)}
        open={true}
        trigger="Guidelines"
      >
        <ul className={css(styles.orderedList)}>
          <li>Ask a question</li>
          <li>Start Discussion about a certain topic</li>
          <li>Post a relevant photo to a hub</li>
        </ul>
      </Collapsible>
    </div>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "297px",
    marginLeft: "30px",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "24px 21px",
    alignSelf: "flex-end",
    justifySelf: "stretch",
    maxHeight: 455,
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
  collapsibleSection: {
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000000",
    marginTop: 24,
    cursor: "pointer",
  },
  collapsibleContent: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineheight: "26px",
    color: "#241F3A",
    marginLeft: "3px",
  },
});
