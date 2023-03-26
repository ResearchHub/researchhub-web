import { css, StyleSheet } from "aphrodite";
import { getBountyAmount, getOpenBounties } from "./lib/bounty";
import { Comment, COMMENT_TYPES } from "./lib/types";
import ContentBadge from "../ContentBadge";

const CommentBadge = ({ comment }: { comment: Comment }) => {
  const openBounties = getOpenBounties({ comment });
  const bountyAmount = getBountyAmount({ comment, formatted: true });
 
  if (openBounties.length > 0) {
    return (
      <div className={css(styles.badgeWrapper)}>
        <ContentBadge contentType="bounty" label={`${bountyAmount} RSC`} />
      </div>
    )
  }
  else if (comment.commentType === COMMENT_TYPES.REVIEW) {
    return (
      <div className={css(styles.badgeWrapper)}>
        <ContentBadge contentType={COMMENT_TYPES.REVIEW} label="" />
      </div>
    )
  }
  else if (comment.commentType === COMMENT_TYPES.SUMMARY) {
    return (
      <div className={css(styles.badgeWrapper)}>
        <ContentBadge contentType={COMMENT_TYPES.SUMMARY} label="" />
      </div>
    )
  }  

  return null;
}

const styles = StyleSheet.create({
  badgeWrapper: {
    display: "inline-block",
    marginBottom: 8,
  },  
})

export default CommentBadge;