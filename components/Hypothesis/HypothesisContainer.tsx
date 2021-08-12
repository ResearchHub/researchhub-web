import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { css, StyleSheet } from "aphrodite";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { isNullOrUndefined } from "~/config/utils/nullchecks";

// Components
import Head from "~/components/Head";
import HypothesisPageCard from "~/components/Hypothesis/HypothesisPageCard";
import CitationContainer from "./Citation/CitationContainer";
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import PaperSideColumn from "~/components/Paper/SideColumn/PaperSideColumn";

type Props = {};

function useFetchHypothesis() {
  const [hypothesis, setHypothesis] = useState(null);
  const router = useRouter();
  const hypothesisId = router.query.documentId;

  useEffect(() => {
    fetch(API.HYPOTHESIS({ hypothesis_id: hypothesisId }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        setHypothesis(data);
      });
  }, [hypothesisId]);

  return hypothesis;
}

export default function HypothesisContainer(props: Props): ReactElement<"div"> {
  const hypothesis = useFetchHypothesis();
  const [discussionCount, setDiscussionCount] = useState(0);

  return !isNullOrUndefined(hypothesis) ? (
    <div>
      <Head
        title={hypothesis.title}
        description={hypothesis.title}
        canonical={`https://www.researchhub.com/hypothesis/${hypothesis.id}/${hypothesis.slug}`}
      />
      <div className={css(styles.container)}>
        <HypothesisPageCard hypothesis={hypothesis} />
        <CitationContainer />
        <div className={css(styles.space)}>
          <a name="comments" />
          <DiscussionTab
            documentType={"hypothesis"}
            hypothesis={hypothesis}
            hypothesisId={hypothesis.id}
            calculatedCount={discussionCount}
            setCount={setDiscussionCount}
            isCollapsible={false}
          />
        </div>
        <div className={css(styles.sidebar)}>
          <PaperSideColumn
            authors={[hypothesis.created_by.author_profile]}
            paper={hypothesis}
            hubs={hypothesis.hubs}
            paperId={hypothesis.id}
            isPost={true}
          />
        </div>
      </div>
    </div>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box",
    borderCollapse: "separate",
    borderSpacing: "30px 40px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      borderSpacing: "0",
      display: "flex",
      flexDirection: "column",
    },
    "@media only screen and (min-width: 768px)": {
      display: "flex",
      marginTop: 16,
      width: "90%",
    },
    "@media only screen and (min-width: 1024px)": {
      width: "100%",
      display: "table",
    },
    "@media only screen and (min-width: 1200px)": {
      width: "90%",
    },
  },
  sidebar: {
    display: "table-cell",
    boxSizing: "border-box",
    verticalAlign: "top",
    position: "relative",
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
    "@media only screen and (min-width: 768px)": {
      width: "20%",
      marginLeft: 16,
    },
    "@media only screen and (min-width: 1024px)": {
      minWidth: 250,
      maxWidth: 280,
      width: 280,
      marginLeft: 0,
    },
  },
});
