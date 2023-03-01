import CommentHeader from "./CommentHeader";
import CommentModel from "./lib/CommentModel";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";

type CommentArgs = {
  comment: CommentModel;
}

const Comment = ({ comment }: CommentArgs) => {
  return (
    <div>
      <div>
        <CommentHeader createdBy={comment.createdBy} timeAgo={comment.timeAgo} bounties={[]} />
        <CommentReadOnly content={comment.content} />
        <CommentActions />
      </div>
      <div className={css(styles.children)}>
        {comment.children.map(c => <Comment key={c.id} comment={c} />)}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  children: {
    marginLeft: 15
  }
});

export default Comment;