import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faEdit } from '@fortawesome/free-solid-svg-icons';
import { css, StyleSheet } from "aphrodite";

type Args = {
  handleEdit: Function,
  handleReply: Function,
}

const CommentActions = ({ handleEdit, handleReply }: Args) => {
  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.actionsWrapper)}>
        <div className={`${css(styles.action)} reply-btn`}>
          {/* TODO: This requires updating font awesome common types */}
          <FontAwesomeIcon icon={faReply} />
          <span onClick={() => handleReply()}>Reply</span>
        </div>
        <div className={`${css(styles.action)} edit-btn`}>
          {/* TODO: This requires updating font awesome common types */}
          <FontAwesomeIcon icon={faEdit} />
          <span onClick={() => handleEdit()}>Edit</span>
        </div>
      </div>
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
