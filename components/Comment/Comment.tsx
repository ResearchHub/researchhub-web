import CommentHeader from "./CommentHeader";
import CommentModel from "./lib/CommentModel";
import CommentReadOnly from "./CommentReadOnly";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { css, StyleSheet } from "aphrodite";
import { useState } from "react";
import CommentEditor from "./CommentEditor";


type CommentArgs = {
  comment: CommentModel;
}

const CommentActions = ({}) =>  {

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", columnGap: "5px", alignItems: "center", cursor: "pointer" }} className={`reply-btn`}>
        {/* TODO: This requires updating font awesome common types */}
        <FontAwesomeIcon icon={faReply} />
        <span onClick={() => setIsEditorOpen(!isEditorOpen)}>Reply</span>
      </div>
      {isEditorOpen &&
        <CommentEditor isPreviewMode={false} />
      }
    </div>
  )
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