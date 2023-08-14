import { faEllipsisH } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faFlag, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { useContext, useRef, useState } from "react";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import IconButton from "../Icons/IconButton";
import colors from "./lib/colors";
import { isEmpty } from "~/config/utils/nullchecks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux";
import { parseUser } from "~/config/types/root_types";
import { Comment } from "./lib/types";
import { deleteCommentAPI, flagComment } from "./lib/api";
import { MessageActions } from "~/redux/message";
import { CommentTreeContext } from "./lib/contexts";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import { GenericDocument } from "../Document/lib/types";
const { setMessage, showMessage } = MessageActions;

type Args = {
  comment: Comment;
  handleEdit: Function;
};

const CommentMenu = ({ comment, handleEdit }: Args) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const commentTreeState = useContext(CommentTreeContext);
  const { relatedContent } = comment.thread;

  useEffectHandleClick({
    ref: dropdownRef,
    exclude: [".comment-menu-trigger"],
    onOutsideClick: () => setIsOpen(false),
    onInsideClick: () => setIsOpen(false),
  });

  const _handleFlag = async (flagReason: string) => {
    try {
      await flagComment({
        commentId: comment.id,
        flagReason,
        documentId: relatedContent.id,
        documentType: relatedContent.type,
      });
      dispatch(setMessage("Flagged"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: false }));
    } catch (error) {
      // @ts-ignore
      dispatch(setMessage(error));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
    }
  };

  const _handleDelete = async () => {
    if (confirm("Delete comment?")) {
      await deleteCommentAPI({
        id: comment.id,
        documentType: relatedContent.type,
        documentId: relatedContent.id,
      });

      commentTreeState.onRemove({ comment });
    }
  };

  const _handleEdit = (e) => {
    handleEdit(e);
    setIsOpen(false);
  };

  return (
    <div className={css(styles.wrapper)}>
      <div className={`${css(styles.trigger)} comment-menu-trigger`}>
        <IconButton
          overrideStyle={styles.labelWrapper}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsisH}
            style={{ marginLeft: 3, fontSize: 16 }}
          />
        </IconButton>
      </div>
      <div
        ref={dropdownRef}
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
      >
        {currentUser?.id === comment.createdBy.id && (
          <>
            <div
              className={css(styles.option)}
              onClick={(e) => {
                e.stopPropagation();
                _handleEdit(e);
              }}
            >
              <FontAwesomeIcon
                icon={faPencil}
                style={{ color: colors.secondary.text, fontSize: 18 }}
              />

              <div className={css(styles.dropdownLabel)}>Edit</div>
            </div>
            <div
              className={css(styles.option)}
              onClick={(e) => {
                e.stopPropagation();
                _handleDelete();
                setIsOpen(false);
              }}
            >
              <FontAwesomeIcon
                icon={faTrashAlt}
                style={{ color: colors.secondary.text, fontSize: 18 }}
              />

              <div className={css(styles.dropdownLabel)}>Remove</div>
            </div>
          </>
        )}

        {currentUser?.id !== comment.createdBy.id && (
          <FlagButtonV2
            modalHeaderText="Flagging"
            onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
              _handleFlag(flagReason);
            }}
          >
            <div className={css(styles.option)}>
              <FontAwesomeIcon
                icon={faFlag}
                style={{ color: colors.secondary.text, fontSize: 18 }}
              />
              <div className={css(styles.dropdownLabel)}>Flag</div>
            </div>
          </FlagButtonV2>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 5,
    display: "flex",
    columnGap: "4px",
    color: colors.primary.text,
    alignItems: "center",
    fontWeight: 400,
    fontSize: 16,
  },
  trigger: {},
  dropdown: {
    display: "none",
    position: "absolute",
    top: 30,
    zIndex: 2,
    right: 0,
    height: "auto",
    width: 100,
    background: "white",
    padding: 0,
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 5,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownOpen: {
    display: "block",
  },
  option: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    columnGap: "7px",
    padding: "7px 12px",
    position: "relative",
    boxSizing: "border-box",
    fontSize: 14,
    width: "100%",
    ":hover": {
      background: colors.hover.background,
      transition: "0.2s",
    },
  },
  dropdownIcon: {
    fontSize: 12,
  },
  dropdownLabel: {},
});

export default CommentMenu;
