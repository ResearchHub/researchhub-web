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
import { faClock, faFeather, faHourglass, faCircleInfo, faUserTie } from "@fortawesome/pro-regular-svg-icons";
import { timeSince } from "~/config/utils/dates";
import CommentVote from "./CommentVote";
import VerifiedBadge from "../Verification/VerifiedBadge";
import globalColors from "~/config/themes/colors";
import { Paper } from "../Document/lib/types";
import { Tooltip } from "@mui/material";

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
  const isDocumentAuthor = commentTreeState?.document?.authors?.some(
    author => author.id === authorProfile.id
  );
  
  // Add this new check for peer reviewers
  const isAssignedReviewer = (commentTreeState?.document as Paper)?.peerReviews?.some(
    review => review.user.authorProfile.id === authorProfile.id
  );

  const tooltipProps = {
    placement: "bottom-start" as const,
    componentsProps: {
      tooltip: {
        sx: {
          bgcolor: globalColors.LIGHTER_GREY(1.0),
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
                      href={`/author/${authorProfile?.id}`}
                      key={`/author/${authorProfile?.id}`}
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
                        {isDocumentAuthor && (
                          <div className={css(styles.authorBadge)}>
                            <FontAwesomeIcon icon={faFeather} className={css(styles.authorBadgeIcon)} />
                            Author
                          </div>
                        )}
                      </div>
                    </ALink>
                  }
                  />
                  {isAssignedReviewer && (
                    <Tooltip {...tooltipProps} title={
                      <div className={css(styles.tooltipText)}>
                        <FontAwesomeIcon icon={faCircleInfo} className={css(styles.infoIcon)} />
                        This reviewer has been assigned to review this paper by ResearchHub.
                        <br /><br />
                        <a href="https://airtable.com/apptLQP8XMy1kaiID/pag5tkxt0V18Xobje/form" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className={css(styles.tooltipLink)}>
                          Apply here
                        </a> to become an official peer reviewer and get paid.
                      </div>
                    }>
                      <div className={css(styles.reviewerBadge)}>
                        Assigned Reviewer
                      </div>
                    </Tooltip>
                  )}
                {hasAnyBounties && bountyContributors.length > 0 && (
                  <>
                    {commentTreeState.context !== COMMENT_CONTEXTS.SIDEBAR && (
                      <div className={css(styles.additionalAuthor)}>
                        {`, `}
                        <UserTooltip
                          createdBy={bountyContributors[0]}
                          targetContent={
                            <ALink
                              href={`/author/${bountyContributors[0].id}`}
                              key={`/author/${bountyContributors[0].id}`}
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
                <div className={css(styles.verb)}>{` created a grant`}</div>
              ) : comment.commentType === COMMENT_TYPES.REVIEW ? (
                <div className={css(styles.verb)}>{` peer reviewed`}</div>
              ) : comment.commentType === COMMENT_TYPES.PEER_REVIEW ? (
                <div className={css(styles.verb)}>
                  {comment.thread?.peerReview?.status === "CHANGES_REQUESTED"
                    ? ` requested changes`
                    : comment.thread?.peerReview?.status === "APPROVED"
                    ? ` approved for publication`
                    : comment.thread?.peerReview?.status === "PENDING"
                    ? ` is reviewing`
                    : ` peer reviewed`}
                </div>
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
  authorBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: 12,
    color: colors.secondary.text,
    background: globalColors.NEW_BLUE(0.1),
    padding: "2px 6px",
    borderRadius: 4,
    fontWeight: 500,
  },
  authorBadgeIcon: {
    fontSize: 11,
  },
  reviewerBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: 12,
    color: colors.secondary.text,
    background: globalColors.YELLOW2(0.2),
    padding: "2px 6px",
    borderRadius: 4,
    fontWeight: 500,
    marginLeft: 4,
  },
  tooltipText: {
    fontSize: 12,
    color: colors.secondary.text,
    padding: 8,
  },
  infoIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  tooltipLink: {
    color: globalColors.NEW_BLUE(),
    textDecoration: "underline",
  },
});

export default CommentHeader;
