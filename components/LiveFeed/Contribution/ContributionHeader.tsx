import { css, StyleSheet } from "aphrodite";
import {
  BountyContributionItem,
  CommentContributionItem,
  Contribution,
  RscSupportContributionItem,
} from "~/config/types/contribution";
import SubmissionDetails from "~/components/Document/SubmissionDetails";
import ContributionAuthor from "./ContributionAuthor";
import { ReactNode } from "react";
import ContentBadge from "~/components/ContentBadge";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { POST_TYPES } from "~/components/TextEditor/config/postTypes";
import colors from "~/config/themes/colors";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { breakpoints } from "~/config/themes/screen";
import RSCTooltip from "~/components/Tooltips/RSC/RSCTooltip";

type Args = {
  entry: Contribution;
};

const ContributionHeader = ({ entry }: Args) => {
  const { contentType } = entry;
  let { item, hubs } = entry;
  const { createdBy, createdDate } = item;

  let contentBadgeLabel: ReactNode | string;
  let actionLabel = <>posted in</>;

  if (contentType.name === "bounty") {
    item = item as BountyContributionItem;
    actionLabel = (
      <RSCTooltip
        amount={item.amount}
        targetContent={
          <>
            created &nbsp;
            <ResearchCoinIcon
              overrideStyle={styles.rscIcon}
              version={4}
              width={16}
              height={16}
            />
            <span className={css(styles.rsc)}>
              {` `}
              {item.amount} RSC
            </span>
            &nbsp; bounty
            {hubs.length ? <>{` `}in</> : ""}
          </>
        }
      />
    );
    contentBadgeLabel = item.amount + " RSC";
  } else if (contentType.name === "rsc_support") {
    item = item as RscSupportContributionItem;
    contentBadgeLabel = item.amount + " RSC";
    if (item.source.contentType.name === "comment") {
      actionLabel = (
        <>
          received &nbsp;
          <ResearchCoinIcon
            overrideStyle={styles.rscIcon}
            version={4}
            width={16}
            height={16}
          />
          <span className={css(styles.rsc)}>
            {` `}
            {item.amount} RSC
          </span>{" "}
          from{" "}
          <ContributionAuthor authorProfile={item.recipient?.authorProfile} />
          &nbsp;for their{" "}
          <ALink
            overrideStyle={styles.link}
            href={getUrlToUniDoc(item.source.unifiedDocument) + "#comments"}
          >
            comment
          </ALink>
        </>
      );
    } else {
      actionLabel = (
        <>
          supported{` `}
          <ContributionAuthor authorProfile={item.recipient?.authorProfile} />
          &nbsp;
          <ResearchCoinIcon
            overrideStyle={styles.rscIcon}
            version={4}
            width={16}
            height={16}
          />
          <span className={css(styles.rsc)}>
            {` `}
            {item.amount} RSC
          </span>
          &nbsp; for their{" "}
          <ALink
            overrideStyle={styles.link}
            href={getUrlToUniDoc(item.source.unifiedDocument)}
          >
            {item.source?.contentType.name}
          </ALink>
        </>
      );
    }
  } else if (contentType.name === "comment") {
    item = item as CommentContributionItem;
    let action = "commented on";
    if (item.postType === POST_TYPES.ANSWER) {
      action = "submitted answer for";
    } else if (item.postType === POST_TYPES.SUMMARY) {
      action = "submitted summary for";
    } else if (item.postType === POST_TYPES.REVIEW) {
      action = "submitted review for";
    }

    actionLabel = (
      <>
        {action}{" "}
        <ALink
          overrideStyle={styles.link}
          href={getUrlToUniDoc(item.unifiedDocument) + "#comments"}
        >
          {item.unifiedDocument?.document?.title}
        </ALink>
        {hubs.length ? <>{` `}&nbsp;in</> : ""}
      </>
    );
  }

  // @ts-ignore
  const contentTypeForBadge =
    entry.contentType.name === "comment"
      ? entry.item.postType || POST_TYPES.DISCUSSION
      : entry.contentType.name;
  return (
    <div className={css(styles.header)}>
      <SubmissionDetails
        createdBy={createdBy}
        hubs={hubs}
        createdDate={createdDate}
        avatarSize={20}
        actionLabel={actionLabel}
        overrideSubmittedBy={styles.overrideSubmittedBy}
      />
      <div className={`${css(styles.contentBadge)}`}>
        {/* @ts-ignore */}
        {contentType.name === "rsc_support" || contentType.name === "bounty" ? (
          <RSCTooltip
            amount={item.amount}
            targetContent={
              <ContentBadge
                label={contentBadgeLabel}
                contentType={contentTypeForBadge}
              />
            }
          />
        ) : (
          <ContentBadge
            label={contentBadgeLabel}
            contentType={contentTypeForBadge}
          />
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  contentBadge: {
    marginLeft: "auto",
    opacity: 1,
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  overrideSubmittedBy: {
    alignItems: "unset",
  },
  link: {
    fontWeight: 400,
  },
  rsc: {
    color: colors.ORANGE_DARK2(),
  },
  rscIcon: {
    verticalAlign: "text-top",
  },
});

export default ContributionHeader;
