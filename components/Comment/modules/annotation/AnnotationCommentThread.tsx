import { ContentInstance, GenericDocument } from "../../../Document/lib/types";
import CommentEditor from "../../CommentEditor";
import Comment from "../../Comment";
import { StyleSheet, css } from "aphrodite";
import colors from "../../lib/colors";
import config from "../../lib/config";
import { Comment as CommentType } from "../../lib/types";
import { useContext, useState } from "react";
import { genClientId } from "~/config/utils/id";
import { createCommentAPI } from "../../lib/api";
import { useDispatch } from "react-redux";
import { MessageActions } from "~/redux/message";
import { CommentTreeContext } from "../../lib/contexts";
import IconButton from "../../../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
import flattenComments from "../../lib/flattenComments";
const { setMessage, showMessage } = MessageActions;

interface Props {
  threadId: string;
  isFocused?: boolean;
  rootComment: CommentType;
  onCancel: Function;
  renderingMode: "inline" | "drawer" | "sidebar";
}

const AnnotationCommentThread = ({
  threadId,
  isFocused = false,
  rootComment,
  onCancel,
  renderingMode,
}: Props) => {
  const commentTreeState = useContext(CommentTreeContext);
  const [pendingComment, setPendingComment] = useState<{
    isEmpty: boolean;
    content: any;
  }>({ isEmpty: true, content: null });
  const [clientId, setClientId] = useState<string>(genClientId());
  const dispatch = useDispatch();

  const { comments, childCount } = flattenComments([rootComment]);
  const commentsToRender = isFocused
    ? comments
    : comments.slice(0, config.annotation.maxPreviewComments);
  const remainingComments = childCount + 1 - commentsToRender.length;

  const _handleCreateThreadReply = async ({ content, mentions }) => {
    try {
      const _comment: CommentType = await createCommentAPI({
        content,
        documentId: rootComment.thread.relatedContent.id,
        documentType: rootComment.thread.relatedContent.type,
        threadId,
        mentions,
        parentComment: rootComment,
      });

      commentTreeState.onCreate({ comment: _comment, parent: rootComment });
    } catch (error) {
      dispatch(setMessage("Could not create a comment at this time"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      throw error;
    }
  };

  return (
    <div
      className={css(
        styles.commentListWrapper,
        isFocused && renderingMode === "inline" && styles.expanded
      )}
    >
      {commentsToRender.map((comment, idx) => (
        <div key={`${threadId}-${idx}`} className={css(styles.commentWrapper)}>
          <Comment
            key={`${comment.id}-${comment.updatedTimestamp}`}
            comment={comment}
            ignoreChildren={true}
          />
        </div>
      ))}

      {!isFocused && remainingComments > 0 && (
        <div className={css(styles.loadMoreWrapper)}>
          <IconButton>
            <span
              style={{
                color: colors.primary.btn,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Load {remainingComments}
              {" More"}
              <FontAwesomeIcon icon={faLongArrowDown} />
            </span>
          </IconButton>
        </div>
      )}

      {(isFocused || !pendingComment.isEmpty) && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            key={clientId}
            minimalMode={
              comments.length > 0 &&
              comments.length < config.annotation.maxPreviewComments &&
              renderingMode !== "drawer"
            }
            placeholder="Add a comment..."
            editorId={clientId}
            handleSubmit={async ({ content, mentions }) => {
              await _handleCreateThreadReply({ content, mentions });
            }}
            editorStyleOverride={styles.editorOverride}
            handleCancel={() => {
              setClientId(genClientId());
              setPendingComment({ isEmpty: true, content: null });
              onCancel && onCancel();
            }}
            onChange={({ content, isEmpty }) =>
              setPendingComment({ content, isEmpty })
            }
          />
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  commentListWrapper: {
    padding: 10,
  },
  expanded: {
    maxHeight: 500,
    overflowY: "scroll",
  },
  childrenList: {
    marginLeft: -7,
  },
  loadMoreWrapper: {
    marginTop: 15,
  },
  editorWrapper: {
    marginTop: 15,
  },
  commentWrapper: {
    paddingBottom: 15,
    paddingTop: 15,
    ":first-child": {
      paddingTop: 0,
    },
    ":last-child": {
      borderBottom: "none",
      paddingBottom: 0,
    },
  },
  editorOverride: {
    border: `1px solid ${colors.border}`,
    boxShadow: "none",
  },
});

export default AnnotationCommentThread;
