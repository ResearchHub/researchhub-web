import { GenericDocument } from "../Document/lib/types";
import CommentEditor from "./CommentEditor";
import Comment from "./Comment";
import { StyleSheet, css } from "aphrodite";
import colors from "./lib/colors";
import { Comment as CommentType } from "./lib/types";
import { useState } from "react";
import { genClientId } from "~/config/utils/id";

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
  const [pendingComment, setPendingComment] = useState<{
    isEmpty: boolean;
    content: any;
  }>({ isEmpty: true, content: null });
  const [clientId, setClientId] = useState<string>(genClientId());

  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} document={document} />
      ))}
      {(isFocused || !pendingComment.isEmpty) && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            key={clientId}
            minimalMode={true}
            editorId={clientId}
            handleSubmit={() => null}
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
  editorOverride: {
    border: `1px solid ${colors.border}`,
    boxShadow: "none",
  },
});

export default CommentAnnotationThread;
