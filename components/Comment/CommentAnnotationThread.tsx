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
const { setMessage, showMessage } = MessageActions;

interface Props {
  threadId: string;
  document: GenericDocument;
  isFocused?: boolean;
  comments: CommentType[];
}

const CommentAnnotationThread = ({
  threadId,
  document,
  comments,
  isFocused = false,
}: Props) => {
  const commentTreeState = useContext(CommentTreeContext);
  const [pendingComment, setPendingComment] = useState<{
    isEmpty: boolean;
    content: any;
  }>({ isEmpty: true, content: null });
  const [clientId, setClientId] = useState<string>(genClientId());
  const dispatch = useDispatch();

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
      {comments.map((comment, idx) => (
        <div key={`${threadId}-${idx}`} className={css(styles.commentWrapper)}>
          <Comment key={comment.id} comment={comment} document={document} />
        </div>
      ))}
      {/* <CommentList
        document={document}
        totalCount={100}
        isRootList={true}
        comments={comments}
        handleFetchMore={() => null}
      /> */}
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
