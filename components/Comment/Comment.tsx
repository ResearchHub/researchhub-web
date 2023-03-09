import CommentHeader from "./CommentHeader";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import colors from "~/config/themes/colors";
import { Comment as CommentType } from "./lib/types";
import { useState } from "react";
import CommentEditor from "./CommentEditor";

type CommentArgs = {
  comment: CommentType;
  handleUpdate: Function;
  handleCreate: Function;
};

const Comment = ({ comment, handleUpdate, handleCreate }: CommentArgs) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <div>
        <CommentHeader
          authorProfile={comment.createdBy.authorProfile}
          timeAgo={comment.timeAgo}
          bounties={[]}
        />
        {isEditMode ? (
          <CommentEditor
            handleSubmit={({ content }) => handleUpdate({ comment, content })}
            content={comment.content}
            editorId={`edit-${comment.id}`}
          />
        ) : (
          <CommentReadOnly content={comment.content} />
        )}
        <CommentActions
          handleEdit={() => setIsEditMode(!isEditMode)}
          handleReply={() => setIsReplyOpen(!isReplyOpen)}
        />
      </div>
      {isReplyOpen && (
        <CommentEditor
          handleSubmit={({ content }) => handleUpdate({ content })}
          editorId={`reply-to-${comment.id}`}
        />
      )}
      <div className={css(styles.children)}>
        {comment.children.map((c) => (
          <Comment
            handleUpdate={handleUpdate}
            handleCreate={handleCreate}
            key={c.id}
            comment={c}
          />
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  children: {
    marginLeft: 15,
    paddingLeft: 15,
    borderLeft: `2px solid ${colors.GREY(1.0)}`,
  },
});

export default Comment;
