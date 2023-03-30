import { AuthorProfile } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAvatars from "./CommentAvatars";
import colors from "./lib/colors";
import { getBountyAmount, getOpenBounties } from "./lib/bounty";
import { Comment } from "./lib/types";
import ContentBadge from "../ContentBadge";

type CommentHeaderArgs = {
  authorProfile: AuthorProfile;
  comment: Comment;
};

const CommentHeader = ({ authorProfile, comment }: CommentHeaderArgs) => {
  const openBounties = getOpenBounties({ comment });
  const bountyAmount = getBountyAmount({ comment, formatted: true });
  const bountyContributors = openBounties
    .map((b) => b.createdBy.authorProfile)
    .filter((a) => a.id !== comment.createdBy.authorProfile.id);

  return (
    <div className={css(styles.commentHeader)}>
      {openBounties.length > 0 && (
        <div className={css(styles.badgeRow)}>
          <ContentBadge
            contentType="bounty"
            label={`${bountyAmount} RSC`}
            bountyAmount={bountyAmount}
          />
        </div>
      )}
      <div className={css(styles.details)}>
        <CommentAvatars authors={[authorProfile, ...bountyContributors]} />
        <div className={css(styles.nameWrapper)}>
          <div className={css(styles.nameRow)}>
            <div className={css(styles.name)}>
              {authorProfile.firstName} {authorProfile.lastName}
              {openBounties.length > 0 && bountyContributors.length > 1 && (
                <>{` and others`}</>
              )}
            </div>
            {openBounties.length ? (
              <div className={css(styles.verb)}>{` opened a bounty`}</div>
            ) : (
              <div className={css(styles.verb)}>{` commented`}</div>
            )}
          </div>
          <div className={css(styles.time)}>{comment.timeAgo}</div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    fontSize: 14,
  },
  verb: {
    color: colors.secondary.text,
  },
  time: {
    color: colors.secondary.text,
  },
  badgeRow: {
    display: "inline-block",
    marginBottom: 8,
  },
  details: {
    display: "flex",
  },
  nameWrapper: {
    marginLeft: 7,
  },
  nameRow: {
    display: "flex",
    columnGap: "5px",
    fontSize: 15,
  },
  name: {},
});

export default CommentHeader;
