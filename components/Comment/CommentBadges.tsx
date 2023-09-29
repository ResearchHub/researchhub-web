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

export const hasBadges = ({ comment }) => {
  const closedBounties = getClosedBounties({ comment });
  const openBounties = getOpenBounties({ comment });
  const tips = comment.tips;
  if (
    comment.isAcceptedAnswer ||
    openBounties.length > 0 ||
    tips.length > 0 ||
    closedBounties.length > 0
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
        label={`${openBountyAmountFormatted} RSC Bounty`}
      />
    );
  } else if (closedBounties.length > 0) {
    badges.push(
      <ContentBadge
        size="small"
        contentType="closedBounty"
        label={`${closedBountyAmount} Closed Bounty`}
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
    if (commentTreeState.context === COMMENT_CONTEXTS.GENERIC) {
      return <div className={css(styles.badgesWrapper)}></div>;
    }
    return null;
  }
};

const styles = StyleSheet.create({
  badgesWrapper: {
    columnGap: "8px",
    display: "flex",
    cursor: "default",
    marginBottom: 4,
    height: 20,
  },
  badgeWrapper: {
    display: "inline-block",
  },
});

export default CommentBadges;
