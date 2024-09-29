import React, { useState, useEffect } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faChevronDown, 
  faChevronUp, 
} from '@fortawesome/pro-light-svg-icons';
import { formatDateStandard } from '~/config/utils/dates';
import { getUrlToUniDoc } from '~/config/utils/routing';
import CommentAvatars from '~/components/Comment/CommentAvatars';
import Button from '~/components/Form/Button';
import VerifiedBadge from '~/components/Verification/VerifiedBadge';
import colors from '~/config/themes/colors';
import ALink from '~/components/ALink';
import UserTooltip from '~/components/Tooltips/User/UserTooltip';
import ContentBadge from '~/components/ContentBadge';
import { formatBountyAmount } from '~/config/types/bounty';
import CommentReadOnly from '~/components/Comment/CommentReadOnly';
import HubTag from '~/components/Hubs/HubTag';
import { Hub } from '~/config/types/hub';
import { UnifiedDocument } from '~/config/types/root_types';
import fetchHubFromSlug from '~/pages/hubs/api/fetchHubFromSlug';

type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: UnifiedDocument;
  bountyType: "REVIEW" | "GENERIC_COMMENT" | "ANSWER";
};

const bountyTypeLabels = {
  REVIEW: "Peer Review",
  ANSWER: "Answer",
  GENERIC_COMMENT: "Comment",
};

const formatAuthors = (authors: Array<{ firstName: string; lastName: string }>): string => {
  const numAuthors = authors.length;
  if (numAuthors <= 2) {
    return authors.map(a => `${a.firstName} ${a.lastName}`).join(', ');
  } else {
    const firstAuthor = `${authors[0].firstName} ${authors[0].lastName}`;
    const lastAuthor = `${authors[numAuthors - 1].firstName} ${authors[numAuthors - 1].lastName}`;
    const middleCount = numAuthors - 2;
    return `${firstAuthor}, +${middleCount} authors, ${lastAuthor}`;
  }
};

const BountyFeedCard: React.FC<{ bounty: SimpleBounty }> = ({ bounty }) => {
  const { createdBy, unifiedDocument, expirationDate, amount, bountyType, content } = bounty;
  const url = getUrlToUniDoc(unifiedDocument);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [firstHub, setFirstHub] = useState<Hub | null>(null);

  useEffect(() => {
    if (unifiedDocument?.hubs && unifiedDocument.hubs.length > 0) {
      setFirstHub(unifiedDocument.hubs[0]);
    }
  }, [unifiedDocument]);

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

  const toggleDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <div className={css(styles.card)}>
      {/* Header Section */}
      <div className={css(styles.header)}>
        <div className={css(styles.userInfo)}>
          <CommentAvatars size={40} people={[createdBy]} withTooltip={true} />
          <div className={css(styles.userDetails)}>
            <div className={css(styles.nameAndGrant)}>
              <UserTooltip
                createdBy={createdBy}
                targetContent={
                  <ALink
                    href={`/author/${createdBy?.authorProfile?.id}`}
                    key={`/author/${createdBy?.authorProfile?.id}`}
                    className={css(styles.userName)}
                  >
                    {createdBy?.authorProfile?.firstName} {createdBy?.authorProfile?.lastName}
                  </ALink>
                }
              />
              {createdBy?.authorProfile?.isVerified && (
                <VerifiedBadge height={16} width={16} style={{ marginLeft: 4 }} />
              )}
              <span className={css(styles.openedGrant)}>
                opened a {badge} grant for <strong>{bountyTypeLabels[bountyType] || "expertise"}</strong> on:
              </span>
            </div>
            <div className={css(styles.bountyType)}>
              {bountyTypeLabels[bountyType] || "Unknown Type"}
            </div>
          </div>
        </div>
        <div className={css(styles.metaInfo)}>
          <div className={css(styles.metaItem)}>
            <FontAwesomeIcon icon={faClock} className={css(styles.icon)} />
            Expires {formatDateStandard(expirationDate)}
          </div>
        </div>
      </div>
      
      {/* Paper Details Section */}
      <ALink href={`${url}/bounties`} className={css(styles.paperWrapper)}>
        <div className={css(styles.paperDetails)}>
          <div className={css(styles.paperTitle)}>
            {unifiedDocument.document?.title || 'Untitled'}
          </div>
          <div className={css(styles.paperAuthors)}>
            {unifiedDocument.authors && unifiedDocument.authors.length > 0 && (
              formatAuthors(unifiedDocument.authors)
            )}
          </div>
        </div>
      </ALink>

      {/* Hubs Section */}
      <div className={css(styles.hubsContainer)}>
        {firstHub ? (
          <HubTag overrideStyle={styles.hubTag} hub={firstHub} key={firstHub.id} />
        ) : (
          <div>No Hub</div>
        )}
      </div>

      {/* Details Section */}
      <div className={css(styles.details)}>
        <div className={css(styles.detailsHeader)}>
          Details
          <div className={css(styles.readMoreToggle)} onClick={toggleDetails}>
            {isDetailsExpanded ? (
              <>
                Read Less
                <FontAwesomeIcon icon={faChevronUp} className={css(styles.toggleIcon)} />
              </>
            ) : (
              <>
                Read More
                <FontAwesomeIcon icon={faChevronDown} className={css(styles.toggleIcon)} />
              </>
            )}
          </div>
        </div>
        {isDetailsExpanded && (
          <div className={css(styles.detailsContent)}>
            <CommentReadOnly content={content} />
          </div>
        )}
      </div>
      
      {/* Call-to-Action Button */}
      <ALink href={`${url}/bounties`} className={css(styles.ctaLink)}>
        <Button customButtonStyle={styles.ctaButton}>View grant</Button>
      </ALink>
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
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between", // Ensures space between userInfo and metaInfo
    alignItems: "flex-start", // Align items at the top
    marginBottom: 5,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: 12,
    display: "flex",
    flexDirection: "column",
  },
  nameAndGrant: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    textDecoration: "none",
  },
  openedGrant: {
    fontSize: 14,
    color: colors.BLACK(0.6),
    marginLeft: 8,
  },
  bountyType: {
    fontSize: 14,
    color: colors.BLACK(0.6),
    marginTop: 2,
  },
  badgeContainer: {
    display: "inline-flex",
    marginLeft: 4,
    marginRight: 4,
  },
  badgeOverride: {
    marginRight: 0,
  },
  paperWrapper: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    marginTop: 2,
    background: "rgba(250, 250, 252, 0.4)",
    borderRadius: 2,
    padding: 20,
    ":hover": {
      transition: "0.2s",
      background: colors.LIGHTER_GREY(1.0),
    },    
  },
  paperIcon: {
    [`@media only screen and (max-width: 400px)`]: {
      display: "none",
    }
  },
  paperDetails: {
    display: "flex",
    flexDirection: "column",
  },
  paperTitle: {
    fontSize: 20,
    fontWeight: 500,
    color: colors.BLACK(0.9),
  },
  paperAuthors: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    marginTop: 3,
    display: "flex",
    flexDirection: "column",
  },
  condensedAuthorList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
  },
  paperHubs: {
    display: "flex",
    gap: 5,
    marginTop: 10,
    flexWrap: "wrap",
  },
  metaInfo: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: colors.BLACK(0.6),
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
    color: colors.BLACK(0.4),
  },
  hubsContainer: {
    marginTop: 10,
    marginBottom: 20,
    display: "flex",
    flexWrap: "wrap",
    gap: 5,
  },
  hubTag: {
    cursor: "pointer",
  },
  details: {
    marginBottom: 5,
  },
  detailsHeader: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
  },
  readMoreToggle: {
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    marginLeft: 8,
    display: "flex",
    alignItems: "center",
  },
  toggleIcon: {
    marginLeft: 4,
  },
  detailsContent: {
    fontSize: 14,
    lineHeight: 1.5,
    color: colors.BLACK(0.8),
  },
  ctaLink: {
    textDecoration: "none",
    marginTop: 20,
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
