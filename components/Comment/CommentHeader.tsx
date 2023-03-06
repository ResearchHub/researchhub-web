import Bounty from "~/config/types/bounty";
import { RHUser } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import { css, StyleSheet } from "aphrodite";

type CommentHeaderArgs = {
  createdBy: RHUser | null;
  timeAgo: string;
  bounties: Bounty[];
};

const CommentHeader = ({ createdBy, timeAgo, bounties }: CommentHeaderArgs) => {
  return (
    <div className={css(styles.commentHeader)}>
      <AuthorAvatar author={createdBy?.authorProfile} />
      {`${createdBy?.authorProfile.firstName} ${createdBy?.authorProfile.lastName}`}
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
