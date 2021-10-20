import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import { Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { CollapsableSectionsCard } from "~/components/CollapsableSectionsCard";

const SUBMISSION_GUIDELINES = (
  <>
    <p>
      When submitting a paper to ResearchHub, please use the following
      guidelines:
    </p>

    <ul>
      <li>
        Use research that follows the scientific method
        <ul>
          <li>No anecdotes or opinions</li>
          <li>No biased or sensational headlines</li>
          <li>Use peer reviewed or in progress work</li>
        </ul>
      </li>
      <li>
        No illegal content
        <ul>
          <li>Upload pre-prints and public domain work only</li>
          <li>Link to paywalls on other sites where needed</li>
        </ul>
      </li>
      <li>No off-topic content (science only!)</li>
    </ul>

    <p>
      In addition, **we ask that all paper uploads be written in English**. We
      plan to add support for other languages in the future - but for the sake
      of building a unified early-stage community we will focus on English
      language papers while we grow.
    </p>
  </>
);

export default function Index() {
  return (
    <Fragment>
      <Head
        title={`Upload a Paper to ResearchHub`}
        description="Upload a Paper to ResearchHub"
      />
      <div className={css(styles.background)}>
        <div className={css(styles.content)}>
          <div className={css(styles.title)}>Upload a Paper</div>
          <CollapsableSectionsCard
            customStyle={styles.cardOnTop}
            isOpen={false}
            title="Uploading a Paper"
            before={SUBMISSION_GUIDELINES}
          />
          <div className={css(styles.row)}>
            <AskQuestionForm documentType={"post"} />
            <CollapsableSectionsCard
              customStyle={styles.cardOnSide}
              isOpen={true}
              title="Uploading a Paper"
              before={SUBMISSION_GUIDELINES}
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
