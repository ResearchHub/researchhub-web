import { css, StyleSheet } from "aphrodite";
import { Helpers } from "@quantfive/js-web-config";
import { isNullOrUndefined, nullthrows } from "../../config/utils/nullchecks";
import { useRouter } from "next/router";
import API from "../../config/api";
import colors from "../../config/themes/colors";
import React, { ReactElement, useEffect, useState } from "react";

// Components
import CitationContainer from "./citation/CitationContainer";
import DiscussionTab from "../Paper/Tabs/DiscussionTab";
import Head from "../Head";
import HypothesisPageCard from "./HypothesisPageCard";
import PaperPromotionIcon from "../Paper/PaperPromotionIcon";
import PaperSideColumn from "../Paper/SideColumn/PaperSideColumn";
import VoteWidget from "../VoteWidget";

type Props = {};

function useFetchHypothesis(): any {
  const [hypothesis, setHypothesis] = useState<any>(null);
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

export default function HypothesisContainer(
  props: Props
): ReactElement<"div"> | null {
  const hypothesis = useFetchHypothesis();
  const [discussionCount, setDiscussionCount] = useState(0);
  const { created_by = {}, hubs, id, slug, title } = hypothesis || {};
  return !isNullOrUndefined(hypothesis) ? (
    <div className={css(styles.hypothesisContainer)}>
      <Head
        title={title}
        description={title}
        canonical={`https://www.researchhub.com/hypothesis/${id || ""}/${slug ||
          ""}`}
      />
      <div className={css(styles.container)}>
        <HypothesisPageCard hypothesis={hypothesis} />
        <CitationContainer />
        <div className={css(styles.space)}>
          <DiscussionTab
            documentType={"hypothesis"}
            hypothesis={hypothesis}
            hypothesisId={id}
            calculatedCount={discussionCount}
            setCount={setDiscussionCount}
            isCollapsible={false}
          />
        </div>
        <div className={css(styles.sidebar)}>
          <PaperSideColumn
            authors={[created_by.author_profile]}
            paper={hypothesis}
            hubs={hubs}
            paperId={id}
            isPost={true}
          />
        </div>
      </div>
    </div>
  ) : null;
}

const styles = StyleSheet.create({
  hypothesisContainer: {
    height: "100%",
    width: "100%",
  },
  container: {
    flexDirection: "column",
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
  space: { marginTop: 30 },
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
