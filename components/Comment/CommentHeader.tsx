import Bounty from "~/config/types/bounty";
import { AuthorProfile } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAuthors from "./CommentAuthors";
import colors from "./lib/colors";

type CommentHeaderArgs = {
  authorProfile: AuthorProfile;
  timeAgo: string;
  bounties: Bounty[];
};

const CommentHeader = ({
  authorProfile,
  timeAgo,
  bounties,
}: CommentHeaderArgs) => {
  return (
    <div className={css(styles.commentHeader)}>
      <CommentAuthors authors={[authorProfile]} />
      <span className={css(styles.verb)}>{` commented `}</span>
      <span className={css(styles.dot)}> • </span>
      <span className={css(styles.time)}>{timeAgo}</span>
    </div>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
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
  }
});

export default CommentHeader;
