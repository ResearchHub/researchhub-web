import { css, StyleSheet } from "aphrodite";
import {
  BountyContributionItem,
  CommentContributionItem,
  Contribution,
  RscSupportContributionItem,
} from "~/config/types/contribution";
import ContributionAuthor from "./ContributionAuthor";
import { ReactNode } from "react";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import colors from "~/config/themes/colors";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { breakpoints } from "~/config/themes/screen";
import RSCTooltip from "~/components/Tooltips/RSC/RSCTooltip";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import { timeSince } from "~/config/utils/dates";
import { UnifiedDocument } from "~/config/types/root_types";
import ContentBadge from "~/components/ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import { truncateText } from "~/config/utils/string";
import { COMMENT_TYPES } from "~/components/Comment/lib/types";
import { VerifiedBadge } from "~/components/Verification/VerificationModal";

type Args = {
  entry: Contribution;
};

const ContributionHeader = ({ entry }: Args) => {
  const { contentType } = entry;
  let { item, hubs } = entry;
  const { createdBy, createdDate } = item;

  let contentBadgeLabel: ReactNode | string;
  let actionLabel = <>{` posted `}</>;
  let unifiedDocument: UnifiedDocument;

  const badge = (
    <ContentBadge
      contentType="bounty"
      bountyAmount={item?.amount}
      badgeContainerOverride={styles.userTooltip}
      size={`small`}
      badgeOverride={styles.badgeOverride}
      label={
        <div style={{ display: "flex", whiteSpace: "pre" }}>
          <div style={{ flex: 1 }}>
            {formatBountyAmount({
              amount: item?.amount,
            })}{" "}
            RSC
          </div>
        </div>
      }
    />
  );

  if (contentType.name === "bounty") {
    item = item as BountyContributionItem;
    unifiedDocument = item.unifiedDocument;

    if (item.parent) {
      actionLabel = (
        <>
          {` contributed `}
          {badge}
          {` to a bounty on `}
        </>
      );
    } else {
      actionLabel = (
        <>
          {` opened `}
          {badge}
          {` bounty on `}
        </>
      );
    }

    contentBadgeLabel = item.amount + " RSC";
  } else if (contentType.name === "rsc_support") {
    item = item as RscSupportContributionItem;
    contentBadgeLabel = item.amount + " RSC";
    unifiedDocument = item.source.unifiedDocument;

    if (item.source.contentType.name === "comment") {
      actionLabel = (
        <>
          {` was tipped `}
          {badge}
          {" by "}
          <ContributionAuthor authorProfile={item.recipient?.authorProfile} />
          {` for their comment on `}
        </>
      );
    } else {
      actionLabel = (
        <>
          {` tipped `}
          <UserTooltip
            createdBy={item.recipient}
            overrideTargetStyle={styles.userTooltip}
            targetContent={
              <ALink
                href={`/user/${item.recipient.authorProfile?.id}/overview`}
                key={`/user/${item.recipient.authorProfile?.id}/overview-key`}
              >
                {item.recipient.firstName} {item.recipient.lastName}
              </ALink>
            }
          />{" "}
          {badge}
          {" for their "}
          <ALink
            overrideStyle={styles.link}
            href={getUrlToUniDoc(item.source.unifiedDocument)}
          >
            {item.source?.contentType.name + " "}
          </ALink>
        </>
      );
    }
  } else if (contentType.name === "comment") {
    item = item as CommentContributionItem;
    unifiedDocument = item.unifiedDocument;

    actionLabel = (
      <>
        {item.postType === COMMENT_TYPES.ANSWER ? (
          <>{` submitted answer `}</>
        ) : item.postType === COMMENT_TYPES.SUMMARY ? (
          <>{` submitted summary `}</>
        ) : item.postType === COMMENT_TYPES.REVIEW ? (
          <>{` peer reviewed `}</>
        ) : (
          <>
            {item.parent ? (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {` replied to `}
                <UserTooltip
                  createdBy={item.parent.createdBy}
                  overrideTargetStyle={styles.userTooltip}
                  targetContent={
                    <ALink
                      href={`/user/${item.parent.createdBy.authorProfile?.id}/overview`}
                      key={`/user/${item.parent.createdBy.authorProfile?.id}/overview-key`}
                    >
                      {item.parent.createdBy.firstName}{" "}
                      {item.parent.createdBy.lastName}
                    </ALink>
                  }
                />
              </div>
            ) : (
              <>{` commented`}</>
            )}

            {unifiedDocument && (
              <span className={css(styles.secondaryText)}>{` on `}</span>
            )}
          </>
        )}
      </>
    );
  } else {
    // @ts-ignore
    actionLabel = <>{` posted a ${item?.unifiedDocument?.documentType}`}</>;
  }

  return (
    <div className={css(styles.header)}>
      <div className={css(styles.avatarWrapper)}>
        <CommentAvatars size={25} people={[createdBy]} withTooltip={true} />
      </div>
      <div className={css(styles.metadataWrapper)}>
        <div className={css(styles.metadataRow)}>
          <div>
            <UserTooltip
              createdBy={createdBy}
              overrideTargetStyle={styles.userTooltip}
              targetContent={
                <ALink
                  href={`/user/${createdBy.authorProfile?.id}/overview`}
                  key={`/user/${createdBy.authorProfile?.id}/overview-key`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "5px",
                    }}
                  >
                    {createdBy.authorProfile.firstName}{" "}
                    {createdBy.authorProfile.lastName}
                    {createdBy.authorProfile.isVerified && (
                      <VerifiedBadge height={18} width={18} />
                    )}
                  </div>
                </ALink>
              }
            />

            {actionLabel}
            {/* @ts-ignore */}
            {unifiedDocument && (
              <span className={css(styles.unifiedDocument)}>
                <ALink
                  overrideStyle={styles.link}
                  href={getUrlToUniDoc(unifiedDocument)}
                >
                  {truncateText(unifiedDocument?.document?.title, 100)}
                </ALink>
              </span>
            )}
          </div>
        </div>
        <div className={css(styles.secondaryText, styles.date)}>
          {/* {" •  "} */}
          {timeSince(item.createdDate)}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 0,
    width: "100%",
    // @ts-ignore
    whiteSpace: "break-spaces",
  },
  userTooltip: {
    display: "inline-flex",
  },
  unifiedDocument: {
    fontWeight: 500,
    color: colors.BLACK(),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  metadataWrapper: {
    display: "flex",
    width: "100%",
    alignItems: "flex-start",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      alignItems: "unset",
    },
  },
  badgeOverride: {
    marginRight: 0,

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginRight: 0,
    },
  },
  avatarWrapper: {
    marginTop: 0,
    paddingRight: 10,
    marginLeft: 0,
  },
  metadataRow: {
    color: colors.BLACK(0.6),
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    lineHeight: "1.5em",
    whiteSpace: "pre-wrap",
  },
  contentBadge: {
    marginTop: 10,
    marginLeft: "0px",
    opacity: 1,
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  secondaryText: {
    color: colors.BLACK(0.6),
  },
  date: {
    display: "flex",
    alignItems: "flex-start",
    marginLeft: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 0,
      fontSize: 14,
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
