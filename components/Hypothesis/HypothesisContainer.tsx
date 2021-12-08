import { castUriID } from "~/config/utils/castUriID";
import { css, StyleSheet } from "aphrodite";
import { emptyFncWithMsg, isNullOrUndefined } from "~/config/utils/nullchecks";
import { fetchHypothesis } from "./api/fetchHypothesis";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import CitationCommentSidebarWithMedia from "./Citation/CitationCommentSidebar";
import CitationContainer from "./Citation/CitationContainer";
import DiscussionTab from "../Paper/Tabs/DiscussionTab";
import Head from "../Head";
import HypothesisCitationConsensusCard from "./HypothesisCitationConsensusCard";
import HypothesisPageCard from "./HypothesisPageCard";
import HypothesisUnduxStore from "./undux/HypothesisUnduxStore";
import PaperBanner from "../Paper/PaperBanner";
import AuthorStatsDropdown from "../Paper/Tabs/AuthorStatsDropdown";
import PaperSideColumn from "../Paper/SideColumn/PaperSideColumn";

type Props = {};

function HypothesisContainer(props: Props): ReactElement<"div"> | null {
  const router = useRouter();
  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [discussionCount, setDiscussionCount] = useState(0);
  const hypothesisID = castUriID(router.query.documentId);
  const targetCitationComment = hypothesisUnduxStore.get(
    "targetCitationComment"
  );
  const [hypothesis, setHypothesis] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchHypothesis({
      hypothesisID,
      onSuccess: (hypothesis: any): void => {
        setHypothesis(hypothesis);
        setIsLoading(false);
      },
      onError: emptyFncWithMsg,
    });
  }, [hypothesisID, lastFetchTime, setHypothesis]);

  const {
    aggregate_citation_consensus: aggreCitationCons,
    created_by = {},
    hubs,
    id,
    slug,
    title,
    is_removed: isHypoRemoved,
  } = hypothesis || {};
  const authors = [created_by?.author_profile ?? {}];
  return !isNullOrUndefined(hypothesis) ? (
    <div className={css(styles.hypothesisContainer)}>
      <PaperBanner
        paper={undefined}
        post={hypothesis}
        postType="hypothesis"
        fetchBullets={false}
        loadingPaper={false}
        lastFetchTime={lastFetchTime}
      />
      <Head
        title={title}
        description={title}
        noindex={Boolean(isHypoRemoved)}
        canonical={`https://www.researchhub.com/hypothesis/${id || ""}/${
          slug || ""
        }`}
      />
      <div className={css(styles.container)}>
        <HypothesisPageCard
          authors={authors}
          hubs={hubs}
          hypothesis={hypothesis}
          onUpdates={setLastFetchTime}
        />
        <HypothesisCitationConsensusCard
          aggregateCitationConsensus={{
            citationCount: aggreCitationCons?.citation_count ?? 0,
            neutralCount: aggreCitationCons?.neutral_count ?? 0,
            downCount: aggreCitationCons?.down_count ?? 0,
            upCount: aggreCitationCons?.up_count ?? 0,
          }}
          hypothesisID={hypothesisID}
          isLoading={isLoading}
          lastFetchTime={lastFetchTime}
          setLastFetchTime={setLastFetchTime}
          shouldShowUploadButton
        />
        <div className={css(styles.metaContainerMobile)}>
          <AuthorStatsDropdown
            authors={[created_by?.author_profile ?? {}]}
            hubs={hubs}
            paper={hypothesis}
            paperId={id}
          />
        </div>
        <CitationContainer
          lastFetchTime={lastFetchTime}
          onCitationUpdate={(): void => {
            setLastFetchTime(Date.now());
          }}
        />
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
        <CitationCommentSidebarWithMedia />
        <div className={css(styles.regSidebar)}>
          <PaperSideColumn
            authors={[created_by?.author_profile ?? {}]}
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

export default function HypothesisContainerWithUndux(
  props: Props
): ReactElement<typeof HypothesisUnduxStore.Container> {
  return (
    <HypothesisUnduxStore.Container>
      <HypothesisContainer {...props} />
    </HypothesisUnduxStore.Container>
  );
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
  regSidebar: {
    boxSizing: "border-box",
    display: "table-cell",
    position: "relative",
    verticalAlign: "top",
    width: 280,
    "@media only screen and (max-width: 1024px)": {
      display: "none",
    },
  },
  citationCommentSidebar: {
    boxSizing: "border-box",
    display: "table-cell",
    position: "relative",
    verticalAlign: "top",
    width: 280,
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
  hypothesisContainerWrap: {
    display: "flex",
    position: "relative",
  },
  citationcontainerWrap: {
    display: "flex",
    height: "100%",
    width: "100%",
  },
});
