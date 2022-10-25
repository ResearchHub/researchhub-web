import { css, StyleSheet } from "aphrodite";
import { Fragment } from "react";
import AboutQuestionCard from "./AboutQuestionCard";
import Head from "~/components/Head";
import HypothesisSubmitForm from "~/components/Hypothesis/HypothesisSubmitForm";
import { useRouter } from "next/router";
import Link from "next/link";
import ALink from "~/components/ALink";

export default function Index() {
  const router = useRouter();
  return (
    <Fragment>
      <Head
        title={`Create a Meta-Study on ResearchHub`}
        description="Create a Meta-Study on ResearchHub"
      />
      <div className={css(styles.background)}>
        <div className={css(styles.content)}>
          <div className={css(styles.title)}>Create a Meta-Study</div>
          {router.query.from === "bounty" && (
            <div className={css(styles.description)}>
              After creating the Meta-Study, link it back as a comment in the
              bounty{" "}
              <ALink href={`/post/${router.query.id}/${router.query.slug}`}>
                {router.query.title}
              </ALink>
            </div>
          )}
          <div className={css(styles.contentSection)}>
            <AboutQuestionCard customStyle={styles.cardOnTop} isOpen={false} />
            <div className={css(styles.row)}>
              <HypothesisSubmitForm documentType={"hypothesis"} />
              <AboutQuestionCard
                customStyle={styles.cardOnSide}
                isOpen={true}
              />
            </div>
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
    paddingLeft: 16,
    paddingRight: 16,
    "@media only screen and (max-width: 1023px)": {
      paddingRight: "5vw",
      paddingLeft: "5vw",
    },
  },
  description: {
    marginTop: 8,
  },
  title: {
    display: "flex",
    justifyContent: "flex-start",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "38px",
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
  contentSection: {
    marginTop: 30,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    // flexWrap: "wrap-reverse",
  },
  cardOnTop: {
    display: "none",
    "@media only screen and (max-width: 1450px)": {
      /* 1209px is cutoff when AboutQuestionCard no longer fits on the side and must go to top */
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      marginBottom: 30,
    },
  },
  cardOnSide: {
    width: "100%",
    maxWidth: "260px",
    marginLeft: "30px",
    "@media only screen and (max-width: 1450px)": {
      /* 1209px is cutoff when AboutQuestionCard has room to fit on the side */
      display: "none",
    },
  },
});
