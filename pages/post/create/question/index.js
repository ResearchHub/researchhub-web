import AskQuestionForm from "~/components/Paper/AskQuestionForm";
import Head from "~/components/Head";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/router";
import { css, StyleSheet } from "aphrodite";

export default function Index() {
  const router = useRouter();

  return (
    <Fragment>
      <Head
        title="Ask a Question on ResearchHub"
        description="Ask a Question on ResearchHub"
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
