import { GenericDocument } from "../Document/lib/types";
import CommentEditor from "./CommentEditor";
import Comment from "./Comment";
import { StyleSheet, css } from "aphrodite";
import colors from "./lib/colors";
import { Comment as CommentType } from "./lib/types";
import { useContext, useState } from "react";
import { genClientId } from "~/config/utils/id";
import { createCommentAPI } from "./lib/api";
import { useDispatch, useSelector } from "react-redux";
import { MessageActions } from "~/redux/message";
import { CommentTreeContext } from "./lib/contexts";
import CommentList from "./CommentList";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowDown } from "@fortawesome/pro-regular-svg-icons";
const { setMessage, showMessage } = MessageActions;

interface Props {
  threadId: string;
  document: GenericDocument;
  isFocused?: boolean;
  rootComment: CommentType;
}

export function flattenComments(comments: CommentType[]): {
  comments: CommentType[];
  childCount: number;
} {
  const flattenedComments: CommentType[] = [];
  let childCount = 0;

  function walkThrough(comment: CommentType) {
    flattenedComments.push(comment);

    if (comment.children) {
      comment.children.forEach(walkThrough);
      childCount += comment.children.length;
    }
  }

  comments.forEach(walkThrough);
  return { comments: flattenedComments, childCount };
}

const CommentAnnotationThread = ({
  threadId,
  document,
  isFocused = false,
  rootComment,
}: Props) => {
  const commentTreeState = useContext(CommentTreeContext);
  const [pendingComment, setPendingComment] = useState<{
    isEmpty: boolean;
    content: any;
  }>({ isEmpty: true, content: null });
  const [clientId, setClientId] = useState<string>(genClientId());
  const dispatch = useDispatch();

  const { comments, childCount } = flattenComments([rootComment]);
  const commentsToRender = !isFocused ? comments.slice(0, 2) : comments;
  const remainingComments = childCount + 1 - commentsToRender.length;
  console.log("commentsToRender", commentsToRender);

  const _handleCreateThreadReply = async ({ content, mentions }) => {
    try {
      const _comment: CommentType = await createCommentAPI({
        content,
        documentId: document.id,
        documentType: document.apiDocumentType,
        threadId,
        mentions,
      });

      commentTreeState.onCreate({ comment: _comment });
    } catch (error) {
      dispatch(setMessage("Could not create a comment at this time"));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      throw error;
    }
  };

  return (
    <div>
      {commentsToRender.map((comment, idx) => (
        <div key={`${threadId}-${idx}`} className={css(styles.commentWrapper)}>
          <Comment
            key={comment.id}
            comment={comment}
            ignoreChildren={true}
            document={document}
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
            minimalMode={true}
            editorId={clientId}
            handleSubmit={async ({ content, mentions }) => {
              await _handleCreateThreadReply({ content, mentions });
            }}
            editorStyleOverride={styles.editorOverride}
            handleCancel={() => {
              setClientId(genClientId());
              setPendingComment({ isEmpty: true, content: null });
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
  commentListWrapper: {},
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
    borderBottom: `1px solid ${colors.border}`,
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

export default CommentAnnotationThread;
