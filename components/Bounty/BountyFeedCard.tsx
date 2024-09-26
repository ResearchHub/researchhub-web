import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTag } from '@fortawesome/pro-light-svg-icons';
import { formatDateStandard } from '~/config/utils/dates';
import { getUrlToUniDoc } from '~/config/utils/routing';
import CommentAvatars from '~/components/Comment/CommentAvatars';
import Button from '~/components/Form/Button';
import HubTag from '~/components/Hubs/HubTag';
import VerifiedBadge from '~/components/Verification/VerifiedBadge';
import colors from '~/config/themes/colors';
import ALink from '~/components/ALink';
import UserTooltip from '~/components/Tooltips/User/UserTooltip';
import { Hub } from '~/config/types/hub';
import ContentBadge from '~/components/ContentBadge';
import { formatBountyAmount } from '~/config/types/bounty';

type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: any;
  hubs: Hub[];
  bountyType: "REVIEW" | "GENERIC_COMMENT" | "ANSWER";
};

const bountyTypeLabels = {
  REVIEW: "Peer Review",
  ANSWER: "Answer",
  GENERIC_COMMENT: "Comment",
};

const BountyFeedCard: React.FC<{ bounty: SimpleBounty }> = ({ bounty }) => {
  const { createdBy, unifiedDocument, expirationDate, amount, hubs, bountyType } = bounty;
  const url = getUrlToUniDoc(unifiedDocument);

  const badge = (
    <ContentBadge
      contentType="bounty"
      bountyAmount={amount}
      badgeContainerOverride={styles.badgeContainer}
      size="small"
      badgeOverride={styles.badgeOverride}
      label={
        <div style={{ display: "flex", whiteSpace: "pre" }}>
          <div style={{ flex: 1 }}>
            {formatBountyAmount({
              amount: amount,
            })}{" "}
            RSC
          </div>
        </div>
      }
    />
  );

  const reputationHubs = hubs.filter(hub => hub.isUsedForRep);

  return (
    <div className={css(styles.card)}>
      <div className={css(styles.header)}>
        <div className={css(styles.userInfo)}>
          <CommentAvatars size={40} people={[createdBy]} withTooltip={true} />
          <div className={css(styles.userDetails)}>
            <UserTooltip
              createdBy={createdBy}
              targetContent={
                <ALink
                  href={`/author/${createdBy?.authorProfile?.id}`}
                  key={`/author/${createdBy?.authorProfile?.id}`}
                  className={css(styles.userName)}
                >
                  {createdBy?.authorProfile?.firstName}{" "}
                  {createdBy?.authorProfile?.lastName}
                  {createdBy?.authorProfile?.isVerified && (
                    <VerifiedBadge height={16} width={16} style={{ marginLeft: 4 }} />
                  )}
                </ALink>
              }
            />
            <div className={css(styles.bountyType)}>
              {bountyTypeLabels[bountyType]}
              {" opened "}
              {badge}
              {" bounty"}
            </div>
          </div>
        </div>
      </div>
      
      <h3 className={css(styles.title)}>{unifiedDocument.document.title}</h3>
      
      <div className={css(styles.metaInfo)}>
        <div className={css(styles.metaItem)}>
          <FontAwesomeIcon icon={faClock} className={css(styles.icon)} />
          Expires {formatDateStandard(expirationDate)}
        </div>
        <div className={css(styles.metaItem)}>
          <FontAwesomeIcon icon={faTag} className={css(styles.icon)} />
          {reputationHubs && reputationHubs.length > 0 ? (
            <div className={css(styles.hubTags)}>
              {reputationHubs.slice(0, 1).map((hub) => (
                <HubTag key={hub.id} hub={hub} overrideStyle={styles.hubTag} />
              ))}
              {reputationHubs.length > 1 && (
                <span className={css(styles.moreHubs)}>
                  +{reputationHubs.length - 1} more
                </span>
              )}
            </div>
          ) : (
            "Unknown Hubs"
          )}
        </div>
      </div>
      
      <div className={css(styles.ctaWrapper)}>
        <ALink href={`${url}/bounties`} className={css(styles.ctaLink)}>
          <Button customButtonStyle={styles.ctaButton}>Answer Bounty</Button>
        </ALink>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease-in-out",
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  bountyType: {
    fontSize: 14,
    color: colors.BLACK(0.6),
    marginTop: 2,
    display: "flex",
    alignItems: "center",
  },
  badgeContainer: {
    display: "inline-flex",
    marginLeft: 4,
    marginRight: 4,
  },
  badgeOverride: {
    marginRight: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    marginBottom: 16,
    lineHeight: 1.3,
  },
  metaInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: colors.BLACK(0.6),
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
    color: colors.BLACK(0.4),
  },
  hubTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  hubTag: {
    fontSize: 12,
    padding: "2px 8px",
  },
  moreHubs: {
    fontSize: 12,
    color: colors.BLACK(0.6),
  },
  ctaWrapper: {
    display: "flex",
    justifyContent: "flex-start",
  },
  ctaLink: {
    textDecoration: "none",
  },
  ctaButton: {
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: colors.NEW_BLUE(),
    color: "#ffffff",
    ":hover": {
      backgroundColor: colors.NEW_BLUE(0.8),
    },
  },
});

export default BountyFeedCard;