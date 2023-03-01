import CommentHeader from "./CommentHeader";
import CommentModel from "./lib/CommentModel";

type CommentArgs = {
  comment: CommentModel;
}

const Comment = ({ comment }: CommentArgs) => {
  return (
    <div>
      <CommentHeader createdBy={comment.createdBy} timeAgo={comment.timeAgo} bounties={[]} />
      {JSON.stringify(comment, null, 2)}
    </div>
  )
}

export default Comment;