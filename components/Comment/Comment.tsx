import CommentHeader from "./CommentHeader";
import CommentReadOnly from "./CommentReadOnly";
import { css, StyleSheet } from "aphrodite";
import CommentActions from "./CommentActions";
import { Comment as CommentType } from "./lib/types";
import { useState } from "react";
import CommentEditor from "./CommentEditor";
import { parseUser, TopLevelDocument } from "~/config/types/root_types";
import colors from "./lib/colors";
import { hasOpenBounties } from "./lib/bounty";
import Button from "../Form/Button";
import { useSelector } from "react-redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
import CommentList from "./CommentList";

type CommentArgs = {
  comment: CommentType;
  handleUpdate: Function;
  handleCreate: Function;
  document: TopLevelDocument;
};

const Comment = ({
  comment,
  document,
  handleUpdate,
  handleCreate,
}: CommentArgs) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const _hasOpenBounties = hasOpenBounties({ comment });
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  const _handleToggleReply = () => {
    if (isReplyOpen && confirm("Discard changes?")) {
      setIsReplyOpen(false);
    } else {
      setIsReplyOpen(true);
    }
  };

  const _handleCloseEdit = () => {
    if (isEditMode && confirm("Discard changes?")) {
      setIsEditMode(false);
    }
  };

  return (
    <div>
      <div>
        <div
          className={css(
            styles.mainWrapper,
            _hasOpenBounties && styles.mainWrapperForBounty
          )}
        >
          <div className={css(styles.headerWrapper)}>
            <CommentHeader
              authorProfile={comment.createdBy.authorProfile}
              comment={comment}
              handleEdit={() => setIsEditMode(!isEditMode)}
            />
          </div>
          {isEditMode ? (
            <CommentEditor
              handleSubmit={async (args) => {
                console.log("args", args);
                await handleUpdate(args);
                setIsEditMode(false);
              }}
              content={comment.content}
              commentId={comment.id}
              author={currentUser?.authorProfile}
              editorId={`edit-${comment.id}`}
              handleClose={() => _handleCloseEdit()}
            />
          ) : (
            <div
              className={css(
                styles.commentReadOnlyWrapper,
                _hasOpenBounties && styles.commentReadOnlyWrapperForBounty
              )}
            >
              <CommentReadOnly content={comment.content} />
              {_hasOpenBounties && (
                <div className={css(styles.contributeWrapper)}>
                  <div>Contribute RSC to this bounty</div>
                  <Button
                    label="Contribute"
                    customButtonStyle={styles.contributeBtn}
                    customLabelStyle={styles.contributeBtnLabel}
                    hideRipples={true}
                    size="small"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className={css(styles.actionsWrapper)}>
          <CommentActions
            toggleReply={() => _handleToggleReply()}
            document={document}
            comment={comment}
            isReplyOpen={isReplyOpen}
          />
        </div>
      </div>
      {isReplyOpen && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            handleClose={() => _handleToggleReply()}
            handleSubmit={async ({ content, commentType }) => {
              await handleCreate({
                content,
                commentType,
                parentId: comment.id,
              });
              setIsReplyOpen(false);
            }}
            editorId={`reply-to-${comment.id}`}
            author={currentUser?.authorProfile}
            placeholder={`Enter reply to this comment`}
          />
        </div>
      )}

      <CommentList
        parentComment={comment}
        totalCount={comment.childrenCount}
        comments={comment.children}
        document={document}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  commentWrapper: {
    marginTop: 5,
  },
  headerWrapper: {
    marginBottom: 10,
  },
  editorWrapper: {
    marginTop: 15,
  },
  actionsWrapper: {},
  mainWrapper: {},
  mainWrapperForBounty: {
    boxShadow: "0px 0px 15px rgba(255, 148, 22, 0.5)",
    borderRadius: 10,
    padding: 10,
    background: "white",
    marginBottom: 5,
  },
  commentReadOnlyWrapper: {
    marginBottom: 15,
  },
  commentReadOnlyWrapperForBounty: {
    marginBottom: 0,
  },
  contributeWrapper: {
    background: colors.bounty.background,
    padding: "6px 8px",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    fontSize: 14,
    borderRadius: "4px",
    marginTop: 5,
  },
  contributeBtn: {
    background: colors.bounty.btn,
    border: 0,
    marginLeft: "auto",
  },
  contributeBtnLabel: {
    fontWeight: 500,
    lineHeight: "22px",
  },
});

export default Comment;
