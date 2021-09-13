import { Fragment, useEffect } from "react";
import { css, StyleSheet } from "aphrodite";
import Collapsible from "../../../components/Form/Collapsible";
import icons from "../../../config/themes/icons";

export type AboutQuestionCardProps = {
  customStyle: any;
  isOpen: boolean;
};

export default function AboutQuestionCard({
  customStyle,
  isOpen,
}: AboutQuestionCardProps) {
  return (
    <div className={css(styles.aboutContainer, customStyle)}>
      <div className={css(styles.aboutTitle)}>
        <img
          src={"/static/ResearchHubIcon.png"}
          className={css(styles.rhIcon)}
        />
        <div className={css(styles.aboutTitleText)}>Creating a Hypothesis</div>
      </div>
      <Collapsible
        className={css(styles.collapsibleSection)}
        contentInnerClassName={css(styles.collapsibleContent)}
        open={isOpen}
        openedClassName={css(styles.collapsibleSection)}
        trigger={
          <div className={css(styles.trigger)}>
            What can you post here?
            <span className={css(styles.chevronDown)}>
              {icons.chevronDownLeft}
            </span>
          </div>
        }
      >
        <ul>
          <li>
            Ask a relevant scientific question in order to start a discussion
          </li>
          <li>
            After you create the hypothesis, add relevant papers to support or reject the hypothesis
          </li>
        </ul>
      </Collapsible>
      <Collapsible
        className={css(styles.collapsibleSection)}
        contentInnerClassName={css(styles.collapsibleContent)}
        open={isOpen}
        openedClassName={css(styles.collapsibleSection)}
        trigger={
          <div className={css(styles.trigger)}>
            Guidelines
            <span className={css(styles.chevronDown)}>
              {icons.chevronDownLeft}
            </span>
          </div>
        }
      >
        <ul>
          <li>Be civil</li>
          <li>Offer suggestions and corrections</li>
        </ul>
      </Collapsible>
    </div>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    border: "1px solid #DEDEE6",
    borderRadius: "3px",
    padding: "24px 21px",
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
  },
  collapsibleContent: {
    marginLeft: "3px",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "26px",
    color: "#241F3A",
  },
  chevronDown: {
    marginLeft: "auto",
  },
  trigger: {
    display: "flex",
    cursor: "pointer",
  },
});
