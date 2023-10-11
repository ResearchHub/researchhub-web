import { NextPage } from "next";
import DocumentPageLayout from "~/components/Document/pages/DocumentPageLayout";
import { useEffect, useMemo, useState } from "react";
import { captureEvent } from "~/config/utils/events";
import { DocumentType } from "~/components/Document/lib/types";
import Error from "next/error";
import { useRouter } from "next/router";
import DocumentPagePlaceholder from "~/components/Document/lib/Placeholders/DocumentPagePlaceholder";
import { DocumentContext } from "~/components/Document/lib/DocumentContext";
import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import useCacheControl from "~/config/hooks/useCacheControl";
import { useDocument, useDocumentMetadata } from "../lib/useHooks";
import PredictionMarketSummary from "~/components/PredictionMarket/PredictionMarketSummary";
import PredictionMarketVoteForm from "~/components/PredictionMarket/PredictionMarketVoteForm";
import {
  PredictionMarketDetails,
  PredictionMarketVote,
} from "~/components/PredictionMarket/lib/types";
import PredictionMarketVoteFeed from "~/components/PredictionMarket/PredictionMarketVoteFeed";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { parseUser } from "~/config/types/root_types";
import { isEmpty } from "~/config/utils/nullchecks";
import colors from "~/config/themes/colors";
import { COMMENT_TYPES, parseComment } from "~/components/Comment/lib/types";
import CommentFeed from "~/components/Comment/CommentFeed";
import getCommentFilterByTab from "../lib/getCommentFilterByTab";
import HorizontalTabBar from "~/components/HorizontalTabBar";

interface Args {
  documentData?: any;
  metadata?: any;
  errorCode?: number;
  documentType: DocumentType;
  tabName: string;
}

const DocumentReplicationMarketPage: NextPage<Args> = ({
  documentData,
  documentType,
  tabName,
  metadata,
  errorCode,
}) => {
  const router = useRouter();
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(
    config.width
  );
  const [tab, setTab] = useState<"COMMENTS" | "VOTES">("COMMENTS");
  const { revalidateDocument } = useCacheControl();

  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  });

  // local state for prediction market.
  // so that we can update the UI without having to refetch data from backend
  const [market, setMarket] = useState<PredictionMarketDetails | undefined>(
    documentMetadata?.predictionMarket
  );
  const [votes, setVotes] = useState<PredictionMarketVote[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [formRefreshKey, setFormRefreshKey] = useState<number>(0); // refresh key for the vote form

  // figure out if the current user is an author of the paper
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const isCurrentUserAuthor = useMemo(() => {
    if (!currentUser || !document || !currentUser.authorProfile) return false;

    return document.authors.some(
      (author) => author.id === currentUser.authorProfile.id
    );
  }, [document, currentUser]);

  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  if (
    !document ||
    !documentMetadata ||
    !documentMetadata.predictionMarket ||
    !market
  ) {
    captureEvent({
      msg: "[Document] Could not parse",
      data: {
        document,
        documentType,
        documentMetadata,
        predictionMarket: documentMetadata?.predictionMarket,
      },
    });
    return <Error statusCode={500} />;
  }

  useEffect(() => {
    setMarket(documentMetadata.predictionMarket);
  }, [documentMetadata]);

  // Update the local state when a vote is created
  const handleVoteCreated = (vote: PredictionMarketVote) => {
    if (market) {
      // this is a fallback in-case we fail to fetch the user's vote from the backend
      // double-check if there's an existing vote that matches the vote id,
      // in which case we should update the vote instead of creating a new one
      const existingVote = votes.find((v) => v.id === vote.id);
      if (existingVote) {
        handleVoteUpdated(vote, existingVote);
        return;
      }

      const newMarket = {
        ...market,
        votes: {
          ...market.votes,
          total: market.votes.total + 1,
          yes: market.votes.yes + (vote.vote === "YES" ? 1 : 0),
          no: market.votes.no + (vote.vote === "NO" ? 1 : 0),
        },
      };

      if (!newMarket.id) {
        // this is probably the first vote created, so let's init the new market's id
        newMarket.id = vote.predictionMarketId;
      }

      setMarket(newMarket);
      setVotes([vote, ...votes]);
      setDocumentMetadata({
        ...documentMetadata,
        predictionMarket: newMarket,
      });
    }
    revalidateDocument();
  };

  // Update the local state when a vote is updated
  const handleVoteUpdated = (
    newVote: PredictionMarketVote,
    prevVote: PredictionMarketVote
  ) => {
    if (market) {
      const newMarket = {
        ...market,
        votes: {
          ...market.votes,
          yes:
            market.votes.yes +
            (newVote.vote === "YES" ? 1 : 0) -
            (prevVote.vote === "YES" ? 1 : 0),
          no:
            market.votes.no +
            (newVote.vote === "NO" ? 1 : 0) -
            (prevVote.vote === "NO" ? 1 : 0),
        },
      };

      setMarket(newMarket);
      setVotes([newVote, ...votes.filter((v) => v.id !== newVote.id)]);
      setDocumentMetadata({
        ...documentMetadata,
        predictionMarket: newMarket,
      });
    }
    revalidateDocument();
  };

  const handleVoteRemoved = (vote: PredictionMarketVote) => {
    if (market) {
      const newMarket = {
        ...market,
        votes: {
          ...market.votes,
          total: market.votes.total - 1,
          yes: market.votes.yes - (vote.vote === "YES" ? 1 : 0),
          no: market.votes.no - (vote.vote === "NO" ? 1 : 0),
        },
      };

      setMarket(newMarket);
      setVotes([...votes.filter((v) => v.id !== vote.id)]);
      setDocumentMetadata({
        ...documentMetadata,
        predictionMarket: newMarket,
      });

      if (vote.createdBy.id === currentUser?.id) {
        // if the vote was created by the current user, we need to refresh the vote form
        // so that it doesn't have the user's "previos vote" cached.
        setFormRefreshKey(formRefreshKey + 1);
      }
    }
    revalidateDocument();
  };

  return (
    <DocumentContext.Provider
      value={{
        metadata: documentMetadata,
        documentType,
        tabName,
        updateMetadata: setDocumentMetadata,
        updateDocument: setDocument,
      }}
    >
      <DocumentPageLayout
        document={document}
        documentType={documentType}
        tabName={tabName}
        errorCode={errorCode}
        metadata={documentMetadata}
      >
        <div
          className={css(styles.bodyContentWrapper)}
          style={{ maxWidth: viewerWidth }}
        >
          <div className={css(styles.card)}>
            {market.votes.total > 0 && (
              <PredictionMarketSummary summary={market} />
            )}
            <PredictionMarketVoteForm
              paperId={document.id}
              predictionMarket={market}
              onVoteCreated={handleVoteCreated}
              onVoteUpdated={handleVoteUpdated}
              isCurrentUserAuthor={isCurrentUserAuthor}
              refreshKey={formRefreshKey}
            />
          </div>

          <div className={css(styles.tabsHeader)}>
            <HorizontalTabBar
              tabs={[
                {
                  label: "Comments",
                  value: "COMMENTS",
                  isSelected: tab === "COMMENTS",
                  pillContent: commentCount > 0 ? commentCount : undefined,
                },
                {
                  label: "Votes",
                  value: "VOTES",
                  isSelected: tab === "VOTES",
                  pillContent:
                    market.votes.total > 0 ? market.votes.total : undefined,
                },
              ]}
              onClick={(tab) => setTab(tab.value as "COMMENTS" | "VOTES")}
              tabStyle={styles.tab}
            />
          </div>

          {tab === "VOTES" && (
            <PredictionMarketVoteFeed
              marketId={market.id}
              includeVotes={votes}
              onVoteRemove={handleVoteRemoved}
            />
          )}
          {tab === "COMMENTS" && (
            <CommentFeed
              document={document}
              showFilters={false}
              initialFilter={getCommentFilterByTab(tabName)}
              editorType={COMMENT_TYPES.REPLICABILITY_COMMENT}
              allowBounty={false}
              allowCommentTypeSelection={false}
              // The primary reason for these callbacks is to "optimistically" update the metadata on the page and refresh the cache.
              // Not every use case is taken into account since many scenarios are uncommon. For those, a page refresh will be required.
              onCommentCreate={() => {
                revalidateDocument();
                setCommentCount(commentCount + 1);
              }}
              onCommentUpdate={() => {
                revalidateDocument();
              }}
              onCommentRemove={() => {
                revalidateDocument();
                setCommentCount(commentCount - 1);
              }}
              totalCommentCount={0}
            />
          )}
        </div>
      </DocumentPageLayout>
    </DocumentContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabsHeader: {
    margin: "45px 0 24px 0",
    borderBottom: `1px solid ${colors.GREY_BORDER}`,
  },
  tab: {
    fontSize: 14,
    fontWeight: 400,
    paddingBottom: 8,
    paddingTop: 8,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContentWrapper: {
    margin: "0 auto",
  },
  card: {
    display: "flex",
    marginTop: 24,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 4,
    flex: "none",
    flexDirection: "column",
    position: "relative",
    border: `1px solid ${colors.GREY_BORDER}`,
  },
});

export default DocumentReplicationMarketPage;
