import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import CommentVote from "./CommentVote";
import { parseUser, TopLevelDocument } from "~/config/types/root_types";
import { Comment } from "./lib/types";
import Image from "next/image";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import { isEmpty } from "~/config/utils/nullchecks";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";

type Args = {
  handleReply: Function;
  comment: Comment;
  document: TopLevelDocument;
};

const CommentActions = ({
  comment,
  document,
  handleReply,
}: Args) => {


  return (
    <div className={css(styles.wrapper)}>
      <div className={css(styles.actionsWrapper)}>
        <div className={`${css(styles.action)} reply-btn`}>
          <CommentVote
            comment={comment}
            score={comment.score}
            userVote={comment.userVote}
            documentType={document.documentType}
            documentID={document.id}
          />
        </div>
        <div className={`${css(styles.action)} reply-btn`}>
          <IconButton onClick={() => null}>
            <Image
              src="/static/icons/tip.png"
              height={20}
              width={21}
              alt="Tip"
            />
            <span
              className={css(styles.actionText)}
              onClick={() => handleReply()}
            >
              Tip
            </span>
          </IconButton>
        </div>
        <div className={`${css(styles.action, styles.actionReply)} reply-btn`}>
          <IconButton onClick={() => null}>
            <Image
              src="/static/icons/reply.png"
              height={14}
              width={17}
              alt="Reply"
            />
            <span
              className={css(styles.actionText)}
              onClick={() => handleReply()}
            >
              Reply
            </span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

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
    fontSize: 15,
    fontWeight: 500,
  },
  actionReply: {
    marginLeft: "auto",
  },
  editAction: {},
  actionText: {
    color: colors.secondary.text,
  },
  actionsWrapper: {
    columnGap: "10px",
    display: "flex",
  },
});

export default CommentActions;
