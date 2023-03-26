import { AuthorProfile } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAvatars from "./CommentAvatars";
import colors from "./lib/colors";
import { getOpenBounties } from "./lib/bounty";
import { Comment, COMMENT_TYPES } from "./lib/types";
import CommentMenu from "./CommentMenu";
import CommentBadge from "./CommentBadge";
import UserTooltip from "../Tooltips/User/UserTooltip";
import ALink from "../ALink";

type CommentHeaderArgs = {
  authorProfile: AuthorProfile;
  comment: Comment;
  handleEdit: Function;
};


const CommentHeader = ({ authorProfile, comment, handleEdit }: CommentHeaderArgs) => {
  const openBounties = getOpenBounties({ comment });
  const bountyContributors = openBounties
    .map((b) => b.createdBy.authorProfile)
    .filter((a) => a.id !== comment.createdBy.authorProfile.id);
  const noOpenBounties = bountyContributors.length === 0;

  return (
    <div className={css(styles.commentHeader)}>
      <CommentBadge comment={comment} />
      <div className={css(styles.details)}>
        {noOpenBounties ? (
          <UserTooltip
            createdBy={comment.createdBy}
            height={24}
            targetContent={
              <CommentAvatars authors={[authorProfile, ...bountyContributors]} />
            }
          />
        ) : (
          <CommentAvatars authors={[authorProfile, ...bountyContributors]} />
        )}
        <div className={css(styles.nameWrapper)}>
          <div className={css(styles.nameRow)}>
            <div className={css(styles.name)}>
              {noOpenBounties && (
                <UserTooltip
                  createdBy={comment.createdBy}
                  targetContent={
                    <ALink
                      href={`/user/${authorProfile?.id}/overview`}
                      key={`/user/${authorProfile?.id}/overview-key`}
                    >
                      {authorProfile.firstName} {authorProfile.lastName}
                    </ALink>
                  }
                />
              )}
              {openBounties.length > 0 && bountyContributors.length > 1 && (
                <>{` and others`}</>
              )}
            </div>
            {openBounties.length ? (
              <div className={css(styles.verb)}>{` opened a bounty`}</div>
            ) : comment.commentType === COMMENT_TYPES.REVIEW ? (
              <div className={css(styles.verb)}>{` peer reviewed`}</div>
            ) : (
              <div className={css(styles.verb)}>{` commented`}</div>
            )}
            <div className={css(styles.menuWrapper)}>
              <CommentMenu handleEdit={handleEdit} comment={comment} />
            </div>
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
    marginTop: -5,
  },
  details: {
    display: "flex",
  },
  nameWrapper: {
    marginLeft: 7,
    width: "100%",
  },
  nameRow: {
    display: "flex",
    columnGap: "5px",
    fontSize: 15,
    alignItems: "center",
  },
  name: {},
  menuWrapper: {
    marginLeft: "auto",
  },
});

export default CommentHeader;
