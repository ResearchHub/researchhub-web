import { filterNull } from "~/config/utils/nullchecks";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { StyleSheet } from "aphrodite";
import HypothesisCard from "../document_cards/HypothesisCard";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import React, { ReactElement } from "react";
import UserPostCard from "~/components/Author/Tabs/UserPostCard";

export type UnifiedCard = ReactElement<
  typeof PaperEntryCard | typeof UserPostCard
> | null;

export function getDocumentCard({
  hasSubscribed,
  isLoggedIn,
  isOnMyHubsTab,
  setUnifiedDocuments,
  unifiedDocumentData,
}): UnifiedCard[] {
  return filterNull(unifiedDocumentData).map(
    (uniDoc: any, arrIndex: number): UnifiedCard => {
      const formattedDocType = getUnifiedDocType(uniDoc?.document_type ?? null);
      const targetDoc =
        formattedDocType !== "posts" ? uniDoc.documents : uniDoc.documents[0];
      const docID = targetDoc.id;
      const shouldBlurMobile =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;
      const shouldBlurDesktop =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;

      switch (formattedDocType) {
        case "posts":
          return (
            <UserPostCard
              {...targetDoc}
              formattedDocType={formattedDocType}
              key={`${formattedDocType}-${docID}-${arrIndex}`}
              style={[
                styles.customUserPostCard,
                shouldBlurMobile && styles.mobileBlurCard,
                shouldBlurDesktop && styles.desktopBlurCard,
              ]}
            />
          );
        case "hypothesis":
          return (
            <HypothesisCard
              {...targetDoc}
              formattedDocType={formattedDocType}
              key={`${formattedDocType}-${docID}-${arrIndex}`}
              style={[
                styles.customUserPostCard,
                shouldBlurMobile && styles.mobileBlurCard,
                shouldBlurDesktop && styles.desktopBlurCard,
              ]}
            />
          );
        case "paper":
          return (
            <PaperEntryCard
              index={arrIndex}
              key={`${formattedDocType}-${docID}-${arrIndex}`}
              paper={uniDoc.documents}
              style={[
                shouldBlurMobile && styles.mobileBlurCard,
                shouldBlurDesktop && styles.desktopBlurCard,
              ]}
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
        default:
          return null;
      }
    }
  );
}

const styles = StyleSheet.create({
  customUserPostCard: {
    marginBottom: 12,
    marginTop: 12,
  },
  desktopBlurCard: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
  },
  mobileBlurCard: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
});
