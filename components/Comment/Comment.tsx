import CommentHeader from "./CommentHeader";
import CommentModel from "./lib/CommentModel";
import CommentReadOnly from "./CommentReadOnly";

type CommentArgs = {
  comment: CommentModel;
}

const Comment = ({ comment }: CommentArgs) => {
  return (
    <div>
      <CommentHeader createdBy={comment.createdBy} timeAgo={comment.timeAgo} bounties={[]} />
      <CommentReadOnly content={comment.content} />
      {JSON.stringify(comment, null, 2)}
    </div>
  )
}

export default Comment;