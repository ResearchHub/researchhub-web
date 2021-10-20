import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import { Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { CollapsableSectionsCard } from "~/components/CollapsableSectionsCard";

const ABOUT_HYPOTHESIS_CARD = {
  title: "Creating a Hypothesis",
  sections: [
    {
      title: "What can you post here?",
      items: [
        "Make a hypothesis -- a proposed explanation for an observation.",
        "After you create the hypothesis, add relevant papers to support or reject the hypothesis",
      ],
    },
    {
      title: "Guidelines",
      items: ["Be civil", "Offer suggestions and corrections"],
    },
  ],
};

export default function Index() {
  return (
    <Fragment>
      <Head
        title={`Create a Hypothesis on ResearchHub`}
        description="Create a Hypothesis on ResearchHub"
      />
      <div className={css(styles.background)}>
        <div className={css(styles.content)}>
          <div className={css(styles.title)}>Create a Hypothesis</div>
          <CollapsableSectionsCard
            {...ABOUT_HYPOTHESIS_CARD}
            customStyle={styles.cardOnTop}
            isOpen={false}
          />
          <div className={css(styles.row)}>
            <AskQuestionForm documentType={"hypothesis"} />
            <CollapsableSectionsCard
              {...ABOUT_HYPOTHESIS_CARD}
              customStyle={styles.cardOnTop}
              isOpen={true}
            />
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
