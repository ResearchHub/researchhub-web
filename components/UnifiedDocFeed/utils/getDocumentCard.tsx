import FeedCard from "~/components/Author/Tabs/FeedCard";
import { ReactElement } from "react";
import { filterNull } from "~/config/utils/nullchecks";
import {
  getUnifiedDocType,
  RESEARCHHUB_POST_DOCUMENT_TYPES,
} from "~/config/utils/getUnifiedDocType";

export type UnifiedCard = ReactElement<typeof FeedCard> | null;

export function getDocumentCard({
  setUnifiedDocuments,
  unifiedDocumentData,
  onBadgeClick,
}): UnifiedCard[] {
  return filterNull(unifiedDocumentData).map(
    (uniDoc: any, arrIndex: number): UnifiedCard => {
      const formattedDocType = getUnifiedDocType(uniDoc?.document_type ?? null);
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
      return (
        <FeedCard
          {...targetDoc}
          formattedDocType={formattedDocType}
          formattedDocLabel={formattedDocLabel}
          index={arrIndex}
          key={`${formattedDocType}-${docID}-${arrIndex}`}
          onBadgeClick={onBadgeClick}
          paper={uniDoc.documents}
          vote={uniDoc.user_vote}
          featured={uniDoc.featured}
          reviews={uniDoc.reviews}
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
