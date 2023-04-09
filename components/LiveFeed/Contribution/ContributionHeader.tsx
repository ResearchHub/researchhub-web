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
import { POST_TYPES } from "~/components/TextEditor/config/postTypes";
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

type Args = {
  entry: Contribution;
};

const ContributionHeader = ({ entry }: Args) => {
  const { contentType } = entry;
  let { item, hubs } = entry;
  const { createdBy, createdDate } = item;

  let contentBadgeLabel: ReactNode | string;
  let actionLabel = <>posted</>;
  let unifiedDocument:UnifiedDocument;
  
  
  if (contentType.name === "bounty") {
    item = item as BountyContributionItem;
    unifiedDocument = item.unifiedDocument
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
    unifiedDocument = item.source.unifiedDocument;

    if (item.source.contentType.name === "comment") {
      actionLabel = (
        <>
          {` was tipped `}
          <ContentBadge
            contentType="bounty"
            bountyAmount={item.amount}
            size={`small`}
            label={
              <div style={{ display: "flex", whiteSpace: "pre" }}>
                <div style={{ flex: 1 }}>
                  {formatBountyAmount({
                    amount: item.amount,
                  })}{" "}
                  RSC
                </div>
              </div>
            }
          />
          {" from "}
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
    unifiedDocument = item.unifiedDocument;

    actionLabel = (
      <>
        {item.postType === POST_TYPES.ANSWER ? (
          <>submitted answer</>
        ) : item.postType === POST_TYPES.SUMMARY ? (
          <>submitted summary</>
        ) : item.postType === POST_TYPES.REVIEW ? (
          <>submitted review</>
        ) : (
          <>
            {item.parent ? (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {` replied to `}
                <UserTooltip
                  createdBy={item.parent.createdBy}
                  targetContent={
                    <ALink
                      href={`/user/${item.parent.createdBy.authorProfile?.id}/overview`}
                      key={`/user/${item.parent.createdBy.authorProfile?.id}/overview-key`}
                    >
                      {item.parent.createdBy.firstName} {item.parent.createdBy.lastName}
                    </ALink>
                  }
                />
              </div>
            ) : (
              <>
                {` commented`}
              </>
            )}

            {unifiedDocument &&
              <span className={css(styles.secondaryText)}>
                {` in `}{unifiedDocument.documentType}
              </span>
            }

          </>
        )}
      </>
      



    )
  }



  return (
    <div className={css(styles.header)}>
      <div className={css(styles.avatarWrapper)}>
        <CommentAvatars people={[createdBy]} withTooltip={true} />
      </div>
      <div className={css(styles.metadataRow)}>
        <div className={css(styles.nameRow)}>
          <UserTooltip
            createdBy={createdBy}
            targetContent={
              <ALink
                href={`/user/${createdBy.authorProfile?.id}/overview`}
                key={`/user/${createdBy.authorProfile?.id}/overview-key`}
              >
                {createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}
              </ALink>
            }
          />

          <div className={css(styles.secondaryText)}>
            {` `}{actionLabel}
          </div>
        </div>
        {/* @ts-ignore */}
        {unifiedDocument &&
          <ALink
            overrideStyle={[styles.link, styles.unifiedDocument]}
            href={getUrlToUniDoc(unifiedDocument) + "#comments"}
          >
            {unifiedDocument?.document?.title}
          </ALink>
        }
        <div className={css(styles.secondaryText)}>{timeSince(item.createdDate)}</div>
      </div>
    </div>
  )
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    marginLeft: 0,
    // @ts-ignore
    whiteSpace: "break-spaces",
  },
  unifiedDocument: {
    fontWeight: 500,
  },
  nameRow: {
    display: "flex",
  },
  avatarWrapper: {
    marginTop: 0,
    paddingRight: 10,
    marginLeft: 0,
  },
  metadataRow: {

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
    display: "flex",
    alignItems: "flex-start",
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
