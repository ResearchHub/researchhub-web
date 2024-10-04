import React, { useEffect, useState } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faReply,
} from '@fortawesome/pro-light-svg-icons';
import { formatDateStandard, timeTo } from '~/config/utils/dates';
import { getUrlToUniDoc } from '~/config/utils/routing';
import AuthorAvatar from '~/components/AuthorAvatar';
import UserTooltip from '~/components/Tooltips/User/UserTooltip';
import Button from '~/components/Form/Button';
import VerifiedBadge from '~/components/Verification/VerifiedBadge';
import colors from '~/config/themes/colors';
import ALink from '~/components/ALink';
import ContentBadge from '~/components/ContentBadge';
import { formatBountyAmount } from '~/config/types/bounty';
import CommentReadOnly from '~/components/Comment/CommentReadOnly';
import HubTag from '~/components/Hubs/HubTag';
import { Hub } from '~/config/types/hub';
import { UnifiedDocument } from '~/config/types/root_types';
import { fetchUnifiedDocFeed } from '~/config/fetch';
import VoteWidget from '~/components/VoteWidget';
import { parseSimpleBounty } from '~/config/utils/parsers';

// Updated SimpleBounty type to include more fields from unifiedDocument
type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: UnifiedDocument;
  hubs: Hub[];
  bountyType: "REVIEW" | "GENERIC_COMMENT" | "ANSWER";
  score: number; // Added score to properly handle voting mechanism
};

const bountyTypeLabels = {
  REVIEW: "Peer Review",
  ANSWER: "Answer",
  GENERIC_COMMENT: "Comment",
};

const BountyFeedCard: React.FC<{ bounty: SimpleBounty }> = ({ bounty }) => {
  const { createdBy, amount, expirationDate, unifiedDocument, hubs, bountyType, score } = bounty;
  const [documentData, setDocumentData] = useState<UnifiedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        const fetchedData: any = await fetchUnifiedDocFeed({
          selectedFilters: { type: unifiedDocument?.documentType },
          hubId: hubs.length > 0 ? hubs[0].id : null,
          page: 1,
        });
        const parsedData = (fetchedData?.results || []).map((doc) => {
          try {
            return parseSimpleBounty(doc);
          } catch (e) {
            console.error('Error parsing document data', doc, e);
          }
        }).filter((doc) => doc !== undefined);

        if (parsedData.length > 0) {
          setDocumentData(parsedData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch unified document data", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [unifiedDocument, hubs]);

  const firstAuthor = useMemo(() => {
    if (!unifiedDocument.authors || unifiedDocument.authors.length === 0) return null;
    const first = unifiedDocument.authors.find((a) => a.sequence === "first");
    if (first) return first;
    return unifiedDocument.authors[0];
  }, [unifiedDocument.authors]);

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error message if document data failed to load
  if (!documentData) {
    return <div>Failed to load document data.</div>;
  }

  return (
    <div className={css(styles.card)}>
      {/* Header section displaying author and bounty details */}
      <div className={css(styles.header)}>
        <div className={css(styles.leftContent)}>
          {firstAuthor && (
            <>
              <AuthorAvatar author={firstAuthor} size={24} />
              <UserTooltip
                createdBy={null}
                targetContent={
                  <ALink
                    href={`/author/${firstAuthor?.id}`}
                    key={`/author/${firstAuthor?.id}`}
                  >
                    {firstAuthor?.firstName}
                    {firstAuthor?.lastName && " "}
                    {firstAuthor?.lastName}
                    {unifiedDocument.authors && unifiedDocument.authors.length > 1 && " et al."}
                  </ALink>
                }
              />
            </>
          )}
          <span className={css(styles.actionText)}>
            is offering
            <ContentBadge
              contentType="bounty"
              bountyAmount={amount}
              size="small"
              badgeContainerOverride={styles.badgeContainer}
              label={
                <div style={{ display: "flex", whiteSpace: "pre" }}>
                  <div style={{ flex: 1 }}>
                    {formatBountyAmount({
                      amount: amount,
                      withPrecision: false,
                    })} RSC
                  </div>
                </div>
              }
            />
            on
          </span>
          <span className={css(styles.actionNoun)}>
            {unifiedDocument.document && unifiedDocument.document.title ? unifiedDocument.document.title : "Untitled Document"}
          </span>
        </div>
        <div className={css(styles.timeSince)}>
          {formatDateStandard(expirationDate)}
        </div>
      </div>

      {/* Body section displaying bounty content */}
      <div className={css(styles.body)}>
        <CommentReadOnly content={bounty.content} />
      </div>

      {/* Hubs associated with the bounty */}
      <div className={css(styles.hubs)}>
        {hubs.map((hub) => (
          <HubTag key={hub.id} hub={hub} />
        ))}
      </div>

      {/* Footer section with VoteWidget and Earn button */}
      <div className={css(styles.footer)}>
        <VoteWidget
          horizontalView={true}
          onDownvote={() => {}}
          onUpvote={() => {}}
          score={score} // Updated score to use the correct value from the bounty
          upvoteStyleClass={styles.voteIcon}
          downvoteStyleClass={styles.voteIcon}
        />
        <Button
          label="Earn"
          onClick={() => window.location.href = `${getUrlToUniDoc(unifiedDocument.id)}/bounties`}
          customButtonStyle={styles.button}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    border: `1px solid ${colors.LIGHT_GREY()}`,
    borderRadius: 4,
    marginBottom: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  leftContent: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
  },
  actionNoun: {
    fontSize: 16,
    color: colors.BLACK_TEXT(),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  timeSince: {
    fontSize: 14,
    color: colors.MEDIUM_GREY2(),
  },
  body: {
    marginTop: 10,
  },
  hubs: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 10,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  voteIcon: {
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.NEW_BLUE(),
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.NEW_BLUE(0.8),
    },
  },
  badgeContainer: {
    display: "inline",
    margin: "0 4px",
  },
});

export default BountyFeedCard;
