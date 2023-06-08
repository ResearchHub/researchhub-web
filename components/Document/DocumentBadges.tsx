import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { StyleSheet, css } from "aphrodite";
import ContentBadge from "../ContentBadge";
import {
  DocumentMetadata,
  GenericDocument,
  isPaper,
  isPost,
} from "./lib/types";

type Props = {
  document: GenericDocument;
  metadata: DocumentMetadata | undefined;
};

const DocumentBadges = ({ document, metadata }: Props) => {
  const openBountyAmount = (metadata?.bounties || []).reduce(
    (total, bounty) => bounty.amount + total,
    0
  );
  const tippedAmount = (metadata?.purchases || []).reduce(
    (total, tip) => tip.amount + total,
    0
  );
  const type = isPaper(document)
    ? "paper"
    : isPost(document) && document.postType === "question"
    ? "question"
    : "post";

  return (
    <div className={css(styles.badges)}>
      <ContentBadge size="large" contentType={type} label={type} />
      {openBountyAmount > 0 && (
        <ContentBadge
          size="large"
          contentType={"bounty"}
          bountyAmount={openBountyAmount}
          label={`${formatBountyAmount({
            amount: openBountyAmount,
          })} Bounty`}
        />
      )}
      {tippedAmount > 0 && (
        <ContentBadge
          tooltip="ResearchCoin awarded to authors of this paper"
          size="large"
          contentType={"award"}
          label={`${formatBountyAmount({ amount: tippedAmount })} Tipped`}
        />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  badges: {
    display: "flex",
    columnGap: "8px",
  },
});

export default DocumentBadges;
