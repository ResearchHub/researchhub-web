import { AuthorProfile, RHUser } from "~/config/types/root_types";
import { GenericDocument } from "../Document/lib/types";
import { css, StyleSheet } from "aphrodite";
import CommentAvatars from "./CommentAvatars";
import colors from "./lib/colors";
import { getClosedBounties, getOpenBounties } from "./lib/bounty";
import { Comment } from "./lib/types";
import CommentMenu from "./CommentMenu";
import CommentBadges from "./CommentBadges";
import UserTooltip from "../Tooltips/User/UserTooltip";
import ALink from "../ALink";
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
  const bountyContributors: RHUser[] = (
    openBounties.length > 0
      ? openBounties
      : closedBounties.length > 0
      ? closedBounties
      : []
  )
    .map((b) => b!.createdBy)
    .filter((person) => person!.id !== comment.createdBy.id);

  return (
    <div className={css(styles.commentHeader)}>
      <CommentBadges comment={comment} />
      <div className={css(styles.details, styles.detailsForAnnotation)}>
        <CommentAvatars
          people={[comment.createdBy, ...bountyContributors]}
          spacing={-20}
          withTooltip={true}
          wrapperStyle={styles.avatars}
          size={22}
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
                      weight={500}
                    >
                      {authorProfile.firstName} {authorProfile.lastName}
                    </ALink>
                  }
                />
              </div>
              <div className={css(styles.time)}>{comment.timeAgo}</div>
            </div>
            <div className={css(styles.menuWrapper)}>
              <CommentMenu handleEdit={handleEdit} comment={comment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
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
    maxWidth: "95%",
  },
  verb: {
    color: colors.secondary.text,
  },
  time: {
    color: colors.secondary.text,
    fontSize: 12,
    marginTop: 3,
    marginLeft: 3,
  },
  details: {
    display: "flex",
  },
  detailsForAnnotation: {
    alignItems: "center",
  },
  avatarWrapper: {
    height: 30,
    padding: "10px 4px",
    overflow: "hidden",
  },
  nameWrapper: {
    marginLeft: 6,
    marginTop: 5,
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
    fontSize: 14,
  },
  menuWrapper: {
    marginLeft: "auto",
    marginTop: -10,
    display: "flex",
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
});

export default CommentHeader;
