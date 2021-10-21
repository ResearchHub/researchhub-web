import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import { Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import { CollapsableSectionsCard } from "~/components/CollapsableSectionsCard";
import { ABOUT_POST_CARD } from "~/config/constants";

export default function Index() {
  return (
    <Fragment>
      <Head
        title={`Create a Post on ResearchHub`}
        description="Create a Post on ResearchHub"
      />
      <div className={css(styles.background)}>
        <div className={css(styles.content)}>
          <div className={css(styles.title)}>Create a Post</div>
          <CollapsableSectionsCard
            {...ABOUT_POST_CARD}
            customStyle={styles.cardOnTop}
            isOpen={false}
          />
          <div className={css(styles.row)}>
            <AskQuestionForm documentType={"post"} />
            <CollapsableSectionsCard
              {...ABOUT_POST_CARD}
              customStyle={styles.cardOnSide}
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
