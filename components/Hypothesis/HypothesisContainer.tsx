import { castUriID } from "../../config/utils/castUriID";
import { css, StyleSheet } from "aphrodite";
import {
  emptyFncWithMsg,
  isNullOrUndefined,
} from "../../config/utils/nullchecks";
import { fetchHypothesis } from "./api/fetchHypothesis";
import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Components
import AuthorStatsDropdown from "../Paper/Tabs/AuthorStatsDropdown";
import CitationContainer from "./Citation/CitationContainer";
import DiscussionTab from "../Paper/Tabs/DiscussionTab";
import Head from "../Head";
import HypothesisPageCard from "./HypothesisPageCard";
import PaperSideColumn from "../Paper/SideColumn/PaperSideColumn";
import HypothesisCitationConsensusCard from "./HypothesisCitationConsensusCard";

type Props = {};

export default function HypothesisContainer(
  props: Props
): ReactElement<"div"> | null {
  const router = useRouter();
  const [hypothesis, setHypothesis] = useState<any>(null);
  const [discussionCount, setDiscussionCount] = useState(0);
  const hypothesisID = castUriID(router.query.documentId);

  useEffect(() => {
    fetchHypothesis({
      hypothesisID,
      onSuccess: setHypothesis,
      onError: emptyFncWithMsg,
    });
  }, [hypothesisID, setHypothesis]);

  const {
    aggregate_citation_consensus: aggreCitationCons,
    created_by = {},
    hubs,
    id,
    slug,
    title,
  } = hypothesis || {};

  return !isNullOrUndefined(hypothesis) ? (
    <div className={css(styles.hypothesisContainer)}>
      <Head
        title={title}
        description={title}
        canonical={`https://www.researchhub.com/hypothesis/${id || ""}/${
          slug || ""
        }`}
      />
      <div className={css(styles.container)}>
        <HypothesisPageCard hypothesis={hypothesis} />
        <HypothesisCitationConsensusCard
          aggregateCitationConsensus={{
            citationCount: aggreCitationCons?.citation_count ?? 0,
            downCount: aggreCitationCons?.down_count ?? 0,
            upCount: aggreCitationCons?.up_count ?? 0,
          }}
        />
        <div className={css(styles.metaContainerMobile)}>
          <AuthorStatsDropdown
            authors={[created_by.author_profile]}
            hubs={hubs}
            paper={hypothesis}
            paperId={id}
          />
        </div>
        <CitationContainer />
        <div className={css(styles.space)}>
          <DiscussionTab
            calculatedCount={discussionCount}
            documentType={"hypothesis"}
            hypothesis={hypothesis}
            hypothesisId={id}
            isCollapsible={false}
            setCount={setDiscussionCount}
          />
        </div>
        <div className={css(styles.sidebar)}>
          <PaperSideColumn
            authors={[created_by.author_profile]}
            hubs={hubs}
            isPost={true}
            paper={hypothesis}
            paperId={id}
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
    borderCollapse: "separate",
    borderSpacing: "30px 40px",
    boxSizing: "border-box",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    "@media only screen and (max-width: 767px)": {
      borderSpacing: "0",
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    "@media only screen and (min-width: 768px)": {
      display: "flex",
      marginTop: 16,
      width: "90%",
    },
    "@media only screen and (min-width: 1024px)": {
      display: "table",
      width: "100%",
    },
    "@media only screen and (min-width: 1200px)": {
      width: "90%",
    },
  },
  sidebar: {
    boxSizing: "border-box",
    display: "table-cell",
    position: "relative",
    verticalAlign: "top",
    width: 280,
    "@media only screen and (max-width: 1024px)": {
      display: "none",
    },
  },
  metaContainerMobile: {
    display: "none",
    "@media only screen and (max-width: 1024px)": {
      display: "flex",
    },
  },
  space: {
    marginTop: 30,
  },
});
