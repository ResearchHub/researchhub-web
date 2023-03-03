import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import CommentEditor from "./CommentEditor";
import { css, StyleSheet } from "aphrodite";
import { Comment } from './lib/types';

type Args = {
  comment: Comment,
  handleUpdate: Function,
  handleCreate: Function,
}

type EditorMode = "REPLY" | "EDIT" | null; 

const CommentActions = ({ comment, handleUpdate, handleCreate }: Args) => {
  const [editorMode, setEditorMode] = useState<EditorMode>(null);

  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.actionsWrapper)}>
        <div className={`${css(styles.action)} reply-btn`}>
          {/* TODO: This requires updating font awesome common types */}
          <FontAwesomeIcon icon={faReply} />
          <span onClick={() => setEditorMode("REPLY")}>Reply</span>
        </div>
        <div className={`${css(styles.action)} edit-btn`}>
          {/* TODO: This requires updating font awesome common types */}
          <FontAwesomeIcon icon={faEdit} />
          <span onClick={() => setEditorMode("EDIT")}>Edit</span>
        </div>
      </div>

      {editorMode === "REPLY" ? (
        <CommentEditor
          handleSubmit={handleCreate}
        />
      ) : editorMode === "EDIT" ? (
        <CommentEditor
          handleSubmit={({ content }) => handleUpdate({ comment, content })}
          content={comment.content}
        />
      ) : null}
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  action: {
    display: "flex",
    columnGap: "5px",
    alignItems: "center",
    cursor: "pointer",
  },
  actionsWrapper: {
    columnGap: "10px",
    display: "flex",
  }
});

export default CommentActions;
