import { AuthorProfile } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAuthors from "./CommentAuthors";
import colors from "./lib/colors";
import { getBountyAmount, getOpenBounties } from "./lib/bounty";
import { Comment } from "./lib/types";
import ContentBadge from "../ContentBadge";

type CommentHeaderArgs = {
  authorProfile: AuthorProfile;
  timeAgo: string;
  comment: Comment;
};

const CommentHeader = ({
  authorProfile,
  timeAgo,
  comment,
}: CommentHeaderArgs) => {
  const openBounties = getOpenBounties({ comment });
  const bountyAmount = getBountyAmount({ comment, formatted: true });
  const bountyContributors = getBountyAmount({ comment, formatted: true });
  
  return (
    <div className={css(styles.commentHeader)}>
      {openBounties.length > 0 &&
        <div className={css(styles.badgeRow)}>
          <ContentBadge contentType="bounty" label={`${bountyAmount} RSC`} />
        </div>
      }
      <div className={css(styles.detailsRow)}>
        <CommentAuthors authors={[authorProfile]} />
        <span className={css(styles.verb)}>{` commented `}</span>
        <span className={css(styles.dot)}> • </span>
        <span className={css(styles.time)}>{timeAgo}</span>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    fontSize: 15,
  },
  verb: {
    color: colors.secondary.text,
  },
  dot: {
    color: colors.dot,
    fontSize: 22,
  },
  time: {
    color: colors.secondary.text,
  },
  badgeRow: {
    display: "inline-block"
  },
  detailsRow: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  }
});

export default CommentHeader;
