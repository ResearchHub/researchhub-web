import { AuthorProfile, RHUser } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAvatars from "./CommentAvatars";
import colors from "./lib/colors";
import { getClosedBounties, getOpenBounties } from "./lib/bounty";
import { Comment, COMMENT_TYPES } from "./lib/types";
import CommentMenu from "./CommentMenu";
import CommentBadges from "./CommentBadges";
import UserTooltip from "../Tooltips/User/UserTooltip";
import ALink from "../ALink";
import { Purchase } from "~/config/types/purchase";
import { formatBountyAmount } from "~/config/types/bounty";
import { useContext } from "react";
import { CommentTreeContext } from "./lib/contexts";
import { breakpoints } from "~/config/themes/screen";


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
  const closedBounties = getClosedBounties({ comment });

  // Prioritize open bounties first
  // @ts-ignore
  const bountyContributors:RHUser[] = (openBounties.length > 0 ? openBounties : closedBounties.length > 0 ? closedBounties : [])
    .map((b) => b!.createdBy)
    .filter((person) => person!.id !== comment.createdBy.id)


  const commentTreeState = useContext(CommentTreeContext);
  const hasAnyBounties = openBounties.length > 0 || closedBounties.length > 0;
  return (
    <div className={css(styles.commentHeader)}>
      <CommentBadges comment={comment} />
      <div className={css(styles.details)}>
        <CommentAvatars people={[comment.createdBy, ...bountyContributors]} spacing={-15} withTooltip={true} />

        <div className={css(styles.nameWrapper)}>
          <div className={css(styles.nameRow)}>
            <div className={css(styles.name)}>
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
              {hasAnyBounties && bountyContributors.length > 0 && (
                <>
                  {commentTreeState.context !== "sidebar" &&
                    <div className={css(styles.additionalAuthor)}>
                      {`, `}
                      <UserTooltip
                        createdBy={comment.createdBy}
                        targetContent={
                          <ALink
                            href={`/user/${bountyContributors[0].id}/overview`}
                            key={`/user/${bountyContributors[0].id}/overview-key`}
                          >
                            {bountyContributors[0].firstName} {bountyContributors[0].lastName}
                          </ALink>
                        }
                      />
                    </div>
                  }
                  <>{` and others`}</>
                </>
              )}
            </div>
            {hasAnyBounties ? (
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
          <div className={css(styles.time)}>
            {comment.timeAgo}
          </div>
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
  name: {
    display: "flex",
    whiteSpace: "pre",
    alignItems: "center",
  },
  menuWrapper: {
    marginLeft: "auto",
  },
  additionalAuthor: {
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    }
  }
});

export default CommentHeader;
