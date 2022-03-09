import FeedCard from "~/components/Author/Tabs/FeedCard";
import { ReactElement } from "react";
import { filterNull } from "~/config/utils/nullchecks";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";

export type UnifiedCard = ReactElement<typeof FeedCard> | null;

export function getDocumentCard({
  hasSubscribed,
  isLoggedIn,
  isOnMyHubsTab,
  setUnifiedDocuments,
  unifiedDocumentData,
  onBadgeClick,
}): UnifiedCard[] {
  return filterNull(unifiedDocumentData).map(
    (uniDoc: any, arrIndex: number): UnifiedCard => {
      const formattedDocType = getUnifiedDocType(uniDoc?.document_type ?? null);
      const targetDoc =
        formattedDocType !== "post" ? uniDoc.documents : uniDoc.documents[0];
      const docID = targetDoc.id;
      const shouldBlurMobile =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;
      const shouldBlurDesktop =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;

      return (
        <FeedCard
          {...targetDoc}
          formattedDocType={formattedDocType}
          index={arrIndex}
          key={`${formattedDocType}-${docID}-${arrIndex}`}
          onBadgeClick={onBadgeClick}
          paper={uniDoc.documents}
          vote={uniDoc.user_vote}
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
