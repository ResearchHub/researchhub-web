import CommentHeader from "./CommentHeader";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import colors from "~/config/themes/colors";
import { Comment as CommentType } from "./lib/types";

type CommentArgs = {
  comment: CommentType;
  handleUpdate: Function;
  handleCreate: Function;
}

const Comment = ({ comment, handleUpdate, handleCreate }: CommentArgs) => {
  return (
    <div>
      <div>
        <CommentHeader createdBy={comment.createdBy} timeAgo={comment.timeAgo} bounties={[]} />
        <CommentReadOnly content={comment.content} />
        <CommentActions comment={comment} handleUpdate={handleUpdate} handleCreate={handleCreate} />
      </div>
      <div className={css(styles.children)}>
        {comment.children.map(c => <Comment handleUpdate={handleUpdate} handleCreate={handleCreate} key={c.id} comment={c} />)}
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  children: {
    marginLeft: 15,
    paddingLeft: 15,
    borderLeft: `2px solid ${colors.GREY(1.0)}`,
  }
});

export default Comment;