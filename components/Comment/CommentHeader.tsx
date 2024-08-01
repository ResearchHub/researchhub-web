import { AuthorProfile, RHUser } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAvatars from "./CommentAvatars";
import colors from "./lib/colors";
import { getClosedBounties, getOpenBounties } from "./lib/bounty";
import { Comment, COMMENT_CONTEXTS, COMMENT_TYPES } from "./lib/types";
import CommentMenu from "./CommentMenu";
import CommentBadges, { hasBadges } from "./CommentBadges";
import UserTooltip from "../Tooltips/User/UserTooltip";
import ALink from "../ALink";
import { useContext } from "react";
import { CommentTreeContext } from "./lib/contexts";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import { timeSince } from "~/config/utils/dates";
import CommentVote from "./CommentVote";
import VerifiedBadge from "../Verification/VerifiedBadge";

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
  const bountyContributors: RHUser[] = (
    openBounties.length > 0
      ? openBounties
      : closedBounties.length > 0
      ? closedBounties
      : []
  )
    .map((b) => b!.createdBy)
    .filter((person) => person!.id !== comment.createdBy.id);

  const commentTreeState = useContext(CommentTreeContext);
  const hasAnyBounties = openBounties.length > 0 || closedBounties.length > 0;
  return (
    <div className={css(styles.commentHeader)}>
      <CommentBadges comment={comment} />
      <div className={css(styles.voteWrapper)}>
        <CommentVote
          comment={comment}
          score={comment.score}
          userVote={comment.userVote}
          documentType={commentTreeState?.document!.apiDocumentType}
          documentID={commentTreeState?.document!.id}
        />
      </div>
      <div className={css(styles.details)}>
        <CommentAvatars
          people={[comment.createdBy, ...bountyContributors]}
          spacing={-20}
          withTooltip={true}
          wrapperStyle={styles.avatars}
        />

        <div className={css(styles.nameWrapper)}>
          <div className={css(styles.nameRow)}>
            <div className={css(styles.leftContentWrapper)}>
              <div className={css(styles.name)}>
                <UserTooltip
                  createdBy={comment.createdBy}
                  targetContent={
                    <ALink
                      href={`/user/${authorProfile?.id}/overview`}
                      key={`/user/${authorProfile?.id}/overview-key`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          columnGap: "5px",
                        }}
                      >
                        {authorProfile.firstName} {authorProfile.lastName}
                        {authorProfile.isVerified && (
                          <VerifiedBadge height={18} width={18} />
                        )}
                      </div>
                    </ALink>
                  }
                />
                {hasAnyBounties && bountyContributors.length > 0 && (
                  <>
                    {commentTreeState.context !== COMMENT_CONTEXTS.SIDEBAR && (
                      <div className={css(styles.additionalAuthor)}>
                        {`, `}
                        <UserTooltip
                          createdBy={bountyContributors[0]}
                          targetContent={
                            <ALink
                              href={`/user/${bountyContributors[0].id}/overview`}
                              key={`/user/${bountyContributors[0].id}/overview-key`}
                            >
                              {bountyContributors[0].firstName}{" "}
                              {bountyContributors[0].lastName}
                            </ALink>
                          }
                        />
                      </div>
                    )}
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
            </div>
            <div className={css(styles.menuWrapper)}>
              <CommentMenu handleEdit={handleEdit} comment={comment} />
            </div>
          </div>
          <div className={css(styles.time)}>
            {comment.timeAgo}
            {closedBounties.length > 0 && (
              <>
                <span className={css(styles.dot)}>•</span>
                <span className={css(styles.expiringText)}>
                  <FontAwesomeIcon
                    style={{ fontSize: 13, marginRight: 5 }}
                    icon={faClock}
                  />
                  {`Ended ` + timeSince(closedBounties[0].expiration_date)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  voteWrapper: {
    background: "#FCFCFC",
    zIndex: 2,
    height: 100,
    position: "absolute",
    left: -15,
    top: -3,
    width: 25,
  },
  dot: {
    color: colors.dot,
    marginLeft: 8,
    marginRight: 8,
  },
  leftContentWrapper: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "5px",
  },
  expiringText: {},
  commentHeader: {
    fontSize: 14,
  },
  verb: {
    color: colors.secondary.text,
  },
  time: {
    color: colors.secondary.text,
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
    marginLeft: 6,
    width: "100%",
  },
  nameRow: {
    display: "flex",
    columnGap: "5px",
    fontSize: 15,
    alignItems: "flex-start",
  },
  badgeRow: {},
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
    marginTop: -10,
    display: "flex",
    alignItems: "center",
  },
  additionalAuthor: {
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  avatars: {
    alignItems: "flex-start",
  },
  badgesWrapper: {
    marginBottom: 10,
  },
});

export default CommentHeader;
