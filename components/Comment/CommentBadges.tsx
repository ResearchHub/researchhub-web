import { css, StyleSheet } from "aphrodite";
import {
  getBountyAmount,
  getOpenBounties,
  getClosedBounties,
} from "./lib/bounty";
import { Comment, COMMENT_CONTEXTS, COMMENT_TYPES } from "./lib/types";
import ContentBadge from "../ContentBadge";
import { Purchase } from "~/config/types/purchase";
import { formatBountyAmount } from "~/config/types/bounty";
import { useContext } from "react";
import { CommentTreeContext } from "./lib/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass, faCircleCheck, faRotateExclamation } from "@fortawesome/pro-regular-svg-icons";
import { faCircleInfo } from "@fortawesome/pro-solid-svg-icons";
import colors from "~/config/themes/colors";
import { Tooltip } from "@mui/material";

export const hasBadges = ({ comment }) => {
  const closedBounties = getClosedBounties({ comment });
  const openBounties = getOpenBounties({ comment });
  const tips = comment.tips;
  if (
    comment.isAcceptedAnswer ||
    openBounties.length > 0 ||
    tips.length > 0 ||
    closedBounties.length > 0 ||
    comment.thread?.peerReview
  ) {
    return true;
  }

  return false;
};

const CommentBadges = ({ comment }: { comment: Comment }) => {
  const closedBounties = getClosedBounties({ comment });
  const openBounties = getOpenBounties({ comment });
  const openBountyAmountFormatted = getBountyAmount({
    comment,
    formatted: true,
  });
  const commentTreeState = useContext(CommentTreeContext);
  const openBountyAmount = getBountyAmount({ comment, formatted: false });
  const closedBountyAmount = getBountyAmount({
    comment,
    status: "CLOSED",
    formatted: true,
  });
  const tipAmount = comment.tips.reduce(
    (total: number, tip: Purchase) => total + Number(tip.amount),
    0
  );

  const badges: any[] = [];
  const totalAwarded = tipAmount + comment.awardedBountyAmount;

  if (openBounties.length > 0) {
    badges.push(
      <ContentBadge
        size="small"
        contentType="bounty"
        bountyAmount={openBountyAmount}
        label={`${openBountyAmountFormatted} RSC Grant`}
      />
    );
  } else if (closedBounties.length > 0) {
    badges.push(
      <ContentBadge
        size="small"
        contentType="closedBounty"
        label={`${closedBountyAmount} Closed Grant`}
      />
    );
  }

  if (comment.isAcceptedAnswer) {
    badges.push(
      <ContentBadge
        tooltip={`Selected by poster (${comment.createdBy.firstName} ${comment.createdBy.lastName})`}
        contentType={COMMENT_TYPES.ANSWER}
        label=""
        size="small"
      />
    );
  }

  if (totalAwarded > 0) {
    const formatted = formatBountyAmount({
      amount: totalAwarded,
      withPrecision: false,
    });
    badges.push(
      <ContentBadge
        tooltip="Total ResearchCoin awarded including tips + bounties"
        contentType="award"
        bountyAmount={totalAwarded}
        label={`${formatted} Awarded`}
        size="small"
      />
    );
  }

  const isInReview = !comment.parent && comment.thread?.peerReview?.status === "PENDING";
  const isApproved = !comment.parent && comment.thread?.peerReview?.status === "APPROVED";
  const needsChanges = !comment.parent && comment.thread?.peerReview?.status === "CHANGES_REQUESTED";

  const tooltipProps = {
    placement: "bottom-start" as const,
    componentsProps: {
      tooltip: {
        sx: {
          bgcolor: colors.LIGHTER_GREY(1.0),
          '& .MuiTooltip-arrow': {
            display: 'none'
          },
          marginTop: '0px !important',
          position: 'relative',
          top: '10px'
        }
      },
      popper: {
        sx: {
          marginTop: '0px !important'
        }
      }
    }
  };

  if (isInReview) {
    badges.push(
      <Tooltip {...tooltipProps} title="Placeholder tooltip text">
        <div>
          <ContentBadge
            size="small"
            contentType="status"
            label={
              <span className={css(styles.badgeLabel)}>
                <FontAwesomeIcon icon={faHourglass} className={css(styles.badgeIcon)} />
                In Review
              </span>
            }
          />
        </div>
      </Tooltip>
    );
  } else if (isApproved) {
    badges.push(
      <Tooltip {...tooltipProps} title="Placeholder tooltip text">
        <div>
          <ContentBadge
            size="small"
            contentType="status"
            badgeOverride={styles.approvedBadge}
            label={
              <span className={css(styles.badgeLabel)}>
                <FontAwesomeIcon icon={faCircleCheck} className={css(styles.badgeIcon)} />
                Approved
              </span>
            }
          />
        </div>
      </Tooltip>
    );
  } else if (needsChanges) {
    badges.push(
      <Tooltip {...tooltipProps} title={
        <div className={css(styles.tooltipText)}>
          <FontAwesomeIcon icon={faCircleInfo} className={css(styles.infoIcon)} />
          Peer reviewer requested changes to this paper. Once 2/3 of reviewers approve, it will be published in the ResearchHub Journal.
        </div>
      }>
        <div>
          <ContentBadge
            size="small"
            contentType="status"
            badgeOverride={styles.changesRequestedBadge}
            label={
              <span className={css(styles.badgeLabel)}>
                <FontAwesomeIcon icon={faRotateExclamation} className={css(styles.badgeIcon)} />
                Changes Requested
              </span>
            }
          />
        </div>
      </Tooltip>
    );
  }

  if (badges.length > 0) {
    return (
      <div className={css(styles.badgesWrapper)}>
        {badges.map((b, idx) => (
          <div
            key={`badge-${idx}-${comment.id}`}
            className={css(styles.badgeWrapper)}
          >
            {b}
          </div>
        ))}
      </div>
    );
  } else {
    // if (commentTreeState.context === COMMENT_CONTEXTS.GENERIC) {
    //   return <div className={css(styles.badgesWrapper)}></div>;
    // }
    return null;
  }
};

const styles = StyleSheet.create({
  tooltipText: {
    fontSize: 13,
    color: colors.BLACK(0.8),
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontWeight: 400,
    padding: 10,
  },
  badgesWrapper: {
    columnGap: "8px",
    display: "flex",
    cursor: "default",
    marginBottom: 8,
    height: 20,
  },
  badgeWrapper: {
    display: "inline-block",
  },
  badgeLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: 'pointer',
  },
  badgeIcon: {
    fontSize: 12,
  },
  approvedBadge: {
    color: colors.NEW_GREEN(1.0),
  },
  changesRequestedBadge: {
    color: colors.RED(1.0),
  },
  infoIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
});

export default CommentBadges;
