import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import { StyleSheet, css } from "aphrodite";
import { TopLevelDocument } from "~/config/types/root_types";
import ContentBadge from "../ContentBadge";

type Props =  {
  document: TopLevelDocument;
}

const DocumentBadges = ({ document }: Props) => {

  // FIXME: Replace from being hardcoded
  const openBountyAmount = 5000
  const tippedAmount = 2500;

  return (
    <div className={css(styles.badges)}>
      <ContentBadge
        contentType={document.documentType}
        label={document.documentType}
      />
      {openBountyAmount > 0 &&
        <ContentBadge
          contentType={"bounty"}
          label={`${formatBountyAmount({amount: openBountyAmount})} RSC Bounty`}
        />      
      }
      {tippedAmount > 0 &&
        <ContentBadge
          contentType={"award"}
          label={`${formatBountyAmount({amount: openBountyAmount})} Tipped`}
        />      
      }      
    </div>
  )
}

const styles = StyleSheet.create({
  badges: {
    display: "flex",
    columnGap: "8px",
  }
})

export default DocumentBadges;