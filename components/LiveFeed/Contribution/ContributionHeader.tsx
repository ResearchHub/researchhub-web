import { css, StyleSheet } from "aphrodite";
import { ResearchCoinIcon } from "~/config/themes/icons";
import { BountyContributionItem, Contribution, RscSupportContributionItem } from "~/config/types/contribution";
import SubmissionDetails from "~/components/Document/SubmissionDetails";
import ContributionAuthor from "./ContributionAuthor";
import { ReactNode } from "react";
import ContentBadge from "~/components/ContentBadge";

type Args = {
  entry: Contribution;
}

const ContributionHeader = ({ entry }: Args) => {
  const { contentType, hubs } = entry;
  let { item }  = entry 
  const { createdBy, createdDate } = item;

  let contentBadgeLabel: ReactNode | string;
  let actionLabel = <>posted in</>;

  if (contentType.name === "bounty") {
    item = item as BountyContributionItem;
    actionLabel = 
      <>
        created <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC bounty in
      </>
    contentBadgeLabel = item.amount + " Bounty"
  }
  else if (contentType.name === "rsc_support") {
    item = item as RscSupportContributionItem;
    contentBadgeLabel = item.amount + " Supported";      
    if (item.source.contentType.name === "comment") {
      actionLabel = 
        <>
          supported <ContributionAuthor authorProfile={item.recipient?.authorProfile} />
          <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC for their comment
        </>
    }
    else {
      actionLabel = 
        <>
          supported authors
          <ResearchCoinIcon version={4} width={16} height={16} /> {item.amount} RSC for their {item.source?.contentType.name}
        </>
    }
  }

  // @ts-ignore
  const contentTypeForBadge = entry.contentType.name === "comment" ? entry.item.postType || POST_TYPES.DISCUSSION : entry.contentType.name;
  return (
    <div className={css(styles.header)}>
      <SubmissionDetails
        createdBy={createdBy}
        hubs={hubs}
        createdDate={createdDate}
        avatarSize={25}
        actionLabel={actionLabel}
      />
      <div className={`${css(styles.contentBadge)}`}>
        {/* @ts-ignore */}
        <ContentBadge label={contentBadgeLabel} contentType={contentTypeForBadge} />
      </div>
    </div>
  )
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },  
  contentBadge: {
    marginLeft: "auto",
    opacity: 1,
    display: "flex",
  },  
});

export default ContributionHeader;