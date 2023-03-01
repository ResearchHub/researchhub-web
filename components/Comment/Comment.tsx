import CommentHeader from "./CommentHeader";
import CommentModel from "./lib/CommentModel";
import CommentReadOnly from "./CommentReadOnly";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'


type CommentArgs = {
  comment: CommentModel;
}

const CommentActions = ({}) =>  {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", columnGap: "5px", alignItems: "center", cursor: "pointer" }}>
        {/* TODO: This requires updating font awesome common types */}
        <FontAwesomeIcon icon={faReply} />
        <span>Reply</span>
      </div>
    </div>
  )
}

const Comment = ({ comment }: CommentArgs) => {
  return (
    <div>
      <CommentHeader createdBy={comment.createdBy} timeAgo={comment.timeAgo} bounties={[]} />
      <CommentReadOnly content={comment.content} />
      <CommentActions />
      {JSON.stringify(comment, null, 2)}
    </div>
  )
}

export default Comment;