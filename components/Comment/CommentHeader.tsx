import Bounty from "~/config/types/bounty";
import { AuthorProfile } from "~/config/types/root_types";
import { css, StyleSheet } from "aphrodite";
import CommentAuthors from "./CommentAuthors";

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
      {` commented `}
      <span> • </span>
      {timeAgo}
    </div>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
});

export default CommentHeader;
