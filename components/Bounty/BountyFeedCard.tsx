import React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCoins, faTag } from '@fortawesome/pro-light-svg-icons';
import numeral from 'numeral';

import ALink from '~/components/ALink';
import Button from '~/components/Form/Button';
import HubTag from '~/components/Hubs/HubTag';
import UserAvatar from '~/components/User/UserAvatar';
import VerifiedBadge from '~/components/Verification/VerifiedBadge';
import colors from '~/config/themes/colors';
import { getUrlToUniDoc } from '~/config/utils/routing';
import { formatDateStandard } from '~/config/utils/dates';
import { SimpleBounty } from '~/types/bounty';

const BountyCard: React.FC<{ bounty: SimpleBounty }> = ({ bounty }) => {
  const { createdBy, unifiedDocument, expirationDate, amount, hubs, bountyType } = bounty;
  const url = getUrlToUniDoc(unifiedDocument);

  const bountyTypeLabels = {
    REVIEW: 'Peer Review',
    ANSWER: 'Answer',
    GENERIC_COMMENT: 'Comment',
  };

  return (
    <div className={css(styles.card)}>
      <div className={css(styles.header)}>
        <div className={css(styles.userInfo)}>
          <UserAvatar size={40} user={createdBy} />
          <div className={css(styles.userDetails)}>
            <div className={css(styles.userName)}>
              {createdBy.authorProfile.firstName} {createdBy.authorProfile.lastName}
              {createdBy.authorProfile.isVerified && <VerifiedBadge height={16} width={16} style={{ marginLeft: 4 }} />}
            </div>
            <div className={css(styles.bountyType)}>{bountyTypeLabels[bountyType]}</div>
          </div>
        </div>
        <div className={css(styles.amount)}>
          <FontAwesomeIcon icon={faCoins} className={css(styles.icon)} />
          {numeral(amount).format('0,0')} RSC
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
          {hubs && hubs.length > 0 ? (
            <div className={css(styles.hubTags)}>
              {hubs.map((hub) => (
                <HubTag key={hub.id} hub={hub} overrideStyle={styles.hubTag} />
              ))}
            </div>
          ) : (
            'No Hubs found'
          )}
        </div>
      </div>
      
      <ALink href={`${url}/bounties`} className={css(styles.ctaLink)}>
        <Button customButtonStyle={styles.ctaButton}>Answer Bounty</Button>
      </ALink>
    </div>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    display: 'flex',
    alignItems: 'center',
  },
  bountyType: {
    fontSize: 14,
    color: colors.BLACK(0.6),
    marginTop: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.NEW_BLUE(),
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    marginBottom: 16,
    lineHeight: 1.3,
  },
  metaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    color: colors.BLACK(0.6),
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
    color: colors.BLACK(0.4),
  },
  hubTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  hubTag: {
    fontSize: 12,
    padding: '2px 8px',
  },
  ctaLink: {
    textDecoration: 'none',
  },
  ctaButton: {
    width: '100%',
    padding: '12px 0',
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: colors.NEW_BLUE(),
    color: '#ffffff',
    ':hover': {
      backgroundColor: colors.NEW_BLUE(0.8),
    },
  },
});

export default BountyCard;