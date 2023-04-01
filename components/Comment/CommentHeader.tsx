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
import { Purchase } from "~/config/types/purchase";
import { formatBountyAmount } from "~/config/types/bounty";


type CommentHeaderArgs = {
  authorProfile: AuthorProfile;
  comment: Comment;
  handleEdit: Function;
};

const CommentHeader = ({
  authorProfile,
  comment,
  handleEdit,
}: CommentHeaderArgs) => {
  const openBounties = getOpenBounties({ comment });
  const bountyContributors = openBounties
    .map((b) => b!.createdBy!.authorProfile)
    .filter((a) => a.id !== comment.createdBy.authorProfile.id);
  const noOpenBounties = bountyContributors.length === 0;
  const tipAmount = comment.tips.reduce(
    (total:number, tip:Purchase) => total + Number(tip.amount),
    0
  );
  const badge = <CommentBadge comment={comment} />
  return (
    <div className={css(styles.commentHeader)}>
<<<<<<< HEAD
      {openBounties.length > 0 && (
        <div className={css(styles.badgeRow)}>
          <ContentBadge
            contentType="bounty"
            label={`${bountyAmount} RSC`}
            bountyAmount={bountyAmount}
          />
        </div>
      )}
=======
      {(badge || comment.tips.length > 0) &&
        <div className={css(styles.badgeRow)}>
          {badge}
          {comment.tips.length > 0 &&
            <div className={css(styles.tipsWrapper)}>
              +{formatBountyAmount({ amount: tipAmount, withPrecision: false })}{` RSC tipped`}
            </div>
          }
        </div>      
      }
>>>>>>> fedd1f4d8 ([Comments] RSC tipping)
      <div className={css(styles.details)}>
        {noOpenBounties ? (
          <UserTooltip
            createdBy={comment.createdBy}
            overrideTargetStyle={styles.avatarWrapper}
            targetContent={
              <CommentAvatars
                authors={[authorProfile, ...bountyContributors]}
              />
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
  avatarWrapper: {
    height: 30,
    padding: "10px 4px",
    overflow: "hidden",
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
  badgeRow: {
    marginBottom: 10,
  },
  tipsWrapper: {
    color: colors.bounty.text,
    display: "flex",
    alignItems: "center",
    lineHeight: "10px",
    columnGap: "5px",
    fontWeight: 500,
    fontSize: 15,
  },
  name: {},
  menuWrapper: {
    marginLeft: "auto",
  },
});

export default CommentHeader;
