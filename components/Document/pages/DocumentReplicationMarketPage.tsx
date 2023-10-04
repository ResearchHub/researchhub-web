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

  if (!document || !documentMetadata) {
    captureEvent({
      msg: "[Document] Could not parse",
      data: { document, documentType, documentMetadata },
    });
    return <Error statusCode={500} />;
  }
  if (!documentMetadata.predictionMarket || !market) {
    captureEvent({
      msg: "[Prediction Market] Could not parse",
      data: { predictionMarket: documentMetadata.predictionMarket },
    });
    return <Error statusCode={500} />;
  }

  useEffect(() => {
    setMarket(documentMetadata.predictionMarket);
  }, [documentMetadata]);

  // Update the local state when a vote is created
  const handleVoteCreated = (vote: PredictionMarketVote) => {
    if (market) {
      const newMarket = {
        ...market,
        votes: {
          ...market.votes,
          total: market.votes.total + 1,
          yes: market.votes.yes + (vote.vote ? 1 : 0),
          no: market.votes.no + (!vote.vote ? 1 : 0),
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
            market.votes.yes + (newVote.vote ? 1 : 0) - (prevVote.vote ? 1 : 0),
          no:
            market.votes.no +
            (!newVote.vote ? 1 : 0) -
            (!prevVote.vote ? 1 : 0),
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
            />
          </div>

          <PredictionMarketVoteFeed marketId={market.id} includeVotes={votes} />
        </div>
      </DocumentPageLayout>
    </DocumentContext.Provider>
  );
};

const styles = StyleSheet.create({
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
