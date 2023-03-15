import CommentHeader from "./CommentHeader";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import { Comment as CommentType } from "./lib/types";
import { useState } from "react";
import CommentEditor from "./CommentEditor";
import { TopLevelDocument } from "~/config/types/root_types";
import colors from "./lib/colors";
import { hasOpenBounties } from "./lib/bounty";

type CommentArgs = {
  comment: CommentType;
  handleUpdate: Function;
  handleCreate: Function;
  document: TopLevelDocument;
};

const Comment = ({ comment, document, handleUpdate, handleCreate }: CommentArgs) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const _hasOpenBounties = hasOpenBounties({ comment });

  return (
    <div>
      <div>
        <div className={css(styles.mainWrapper, _hasOpenBounties && styles.withBounty)}>
          <div className={css(styles.headerWrapper)}>
            <CommentHeader
              authorProfile={comment.createdBy.authorProfile}
              timeAgo={comment.timeAgo}
              comment={comment}
            />
          </div>
          {isEditMode ? (
            <CommentEditor
              handleSubmit={({ content }) => handleUpdate({ comment, content })}
              content={comment.content}
              editorId={`edit-${comment.id}`}
            />
          ) : (
            <div className={css(styles.commentReadOnlyWrapper)}>
              <CommentReadOnly content={comment.content} />
            </div>
          )}
        </div>
        <div className={css(styles.actionsWrapper)}>
          <CommentActions
            handleEdit={() => setIsEditMode(!isEditMode)}
            handleReply={() => setIsReplyOpen(!isReplyOpen)}
            document={document}
            comment={comment}
          />
        </div>
      </div>
      {isReplyOpen && (
        <CommentEditor
          handleSubmit={({ content }) => handleUpdate({ content })}
          editorId={`reply-to-${comment.id}`}
        />
      )}
      <div className={css(styles.children)}>
        {comment.children.map((c) => (
          <div key={c.id} className={css(styles.commentWrapper)}>
            <Comment
              handleUpdate={handleUpdate}
              handleCreate={handleCreate}
              comment={c}
              document={document}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  children: {
    marginLeft: 10,
    paddingLeft: 15,
    borderLeft: `2px solid ${colors.border}`,
    paddingTop: 15,
  },
  headerWrapper: {
    marginBottom: 10,
  },
  commentWrapper: {
    marginTop: 5,
  },
  actionsWrapper: {
  },
  mainWrapper: {
  },
  withBounty: {
    boxShadow: "0px 0px 15px rgba(255, 148, 22, 0.5)",
    borderRadius: 8,
    padding: 8,
    background: "white",
  },
  commentReadOnlyWrapper: {
    marginBottom: 15,
  }
});

export default Comment;
