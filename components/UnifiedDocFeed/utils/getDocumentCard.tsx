import FeedCard from "~/components/Author/Tabs/FeedCard";
import { ReactElement } from "react";
import { filterNull } from "~/config/utils/nullchecks";
import {
  getFEUnifiedDocType,
  RESEARCHHUB_POST_DOCUMENT_TYPES,
} from "~/config/utils/getUnifiedDocType";
import Bounty from "~/config/types/bounty";

export type UnifiedCard = ReactElement<typeof FeedCard> | null;

export function getDocumentCard({
  setUnifiedDocuments,
  unifiedDocumentData,
}): UnifiedCard[] {
  return filterNull(unifiedDocumentData).map(
    (uniDoc: any, arrIndex: number): UnifiedCard => {
      const formattedDocType = getFEUnifiedDocType(
        uniDoc?.document_type ?? null
      );
      const docTypeLabel = (uniDoc?.document_type ?? "").toLowerCase() ?? null;
      const formattedDocLabel =
        docTypeLabel === "hypothesis"
          ? "Meta-Study"
          : docTypeLabel === "discussion"
          ? "post"
          : docTypeLabel;
      const targetDoc = !RESEARCHHUB_POST_DOCUMENT_TYPES.includes(
        formattedDocType
      )
        ? uniDoc.documents
        : uniDoc.documents[0];
      const docID = targetDoc.id;
      const bounties = (uniDoc.bounties || [])
        .map((b) => new Bounty(b))
        .filter((b) => b.status === "OPEN");

      return (
        <FeedCard
          {...targetDoc}
          document={targetDoc}
          formattedDocType={formattedDocType}
          formattedDocLabel={formattedDocLabel}
          index={arrIndex}
          twitterScore={targetDoc.twitter_score}
          key={`${formattedDocType}-${docID}-${arrIndex}`}
          paper={uniDoc.documents}
          vote={uniDoc.user_vote}
          score={uniDoc.score}
          featured={uniDoc.featured}
          reviews={uniDoc.reviews}
          bounties={bounties}
          hasAcceptedAnswer={targetDoc.has_accepted_answer}
          voteCallback={(arrIndex: number, currPaper: any): void => {
            const [currUniDoc, newUniDocs] = [
              { ...uniDoc },
              [...unifiedDocumentData],
            ];
            currUniDoc.documents.user_vote = currPaper.user_vote;
            currUniDoc.documents.score = currPaper.score;
            newUniDocs[arrIndex] = currUniDoc;
            setUnifiedDocuments(newUniDocs);
          }}
        />
      );
    }
  );
}
