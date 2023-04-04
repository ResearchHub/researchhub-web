import { css, StyleSheet } from "aphrodite";
import { getBountyAmount, getOpenBounties } from "./lib/bounty";
import { Comment, COMMENT_TYPES } from "./lib/types";
import ContentBadge from "../ContentBadge";
import { Purchase } from "~/config/types/purchase";
import { formatBountyAmount } from "~/config/types/bounty";

const CommentBadges = ({ comment }: { comment: Comment }) => {
  const openBounties = getOpenBounties({ comment });
  const bountyAmount = getBountyAmount({ comment, formatted: true });
  const tipAmount = comment.tips.reduce(
    (total: number, tip: Purchase) => total + Number(tip.amount),
    0
  );

  const badges:any[] = [];
  const totalAwarded = tipAmount + comment.awardedBountyAmount;

  if (openBounties.length > 0) {
    badges.push(
      <ContentBadge contentType="bounty" label={`${bountyAmount} RSC Bounty`} />
    )
  }
  if (comment.commentType === COMMENT_TYPES.REVIEW) {
    badges.push(
      <ContentBadge contentType={COMMENT_TYPES.REVIEW} label="" />
    )
  }
  if (comment.commentType === COMMENT_TYPES.SUMMARY) {
    badges.push(
      <ContentBadge contentType={COMMENT_TYPES.SUMMARY} label="" />
    );
  }

  if (totalAwarded > 0) {
    const formatted = formatBountyAmount({ amount: totalAwarded, withPrecision: false });
    badges.push(
      <ContentBadge contentType="award" label={`${formatted} Awarded`} />
    );
  }

  if (badges.length > 0) {
    return (
      <div className={css(styles.badgesWrapper)}>
        {badges.map(b => (<div className={css(styles.badgeWrapper)}>{b}</div>))}
      </div>
    )
  }
  else {
    return null;
  }

  
};

const styles = StyleSheet.create({
  badgesWrapper: {
    columnGap: "8px",
    display: "flex",
  },
  badgeWrapper: {
    display: "inline-block",
    marginBottom: 8,
  },
});

export default CommentBadges;
