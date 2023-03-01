import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";
import CommentEditor from "./CommentEditor";
import { css, StyleSheet } from "aphrodite";

const CommentActions = ({}) =>  {

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className={css(styles.wrapper)}>
      <div className={`${css(styles.action)} reply-btn`}>
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

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  action:  {
    display: "flex",
    columnGap: "5px",
    alignItems: "center",
    cursor: "pointer",
  } 
});

export default CommentActions;