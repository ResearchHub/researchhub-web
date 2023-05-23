import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { StyleSheet, css } from "aphrodite";
import ContentBadge from "../ContentBadge";
import { GenericDocument } from "./lib/types";

type Props = {
  document: GenericDocument;
};

const DocumentBadges = ({ document }: Props) => {
  // FIXME: Replace from being hardcoded
  const openBountyAmount = 5000;
  const tippedAmount = 2500;

  return (
    <div className={css(styles.badges)}>
      <ContentBadge
        size="large"
        contentType={document.type}
        label={document.type}
      />
      {/* {openBountyAmount > 0 && (
        <ContentBadge
          contentType={"bounty"}
          label={`${formatBountyAmount({
            amount: openBountyAmount,
          })} RSC Bounty`}
        />
      )}
      {tippedAmount > 0 && (
        <ContentBadge
          contentType={"award"}
          label={`${formatBountyAmount({ amount: openBountyAmount })} Tipped`}
        />
      )} */}
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
