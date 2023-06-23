import { GenericDocument } from "../Document/lib/types";
import CommentEditor from "./CommentEditor";
import { Comment as CommentModel, CommentThread } from "./lib/types";
import Comment from "./Comment";
import { ID } from "~/config/types/root_types";
import { StyleSheet, css } from "aphrodite";
import colors from "./lib/colors";

interface Props {
  comments: CommentModel[];
  document: GenericDocument;
  isFocused?: boolean;
  threadId?: ID;
  isNew?: boolean;
}

const CommentAnnotationThread = ({
  comments,
  document,
  threadId,
  isNew = false,
  isFocused = false,
}: Props) => {
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} document={document} />
      ))}
      {isFocused && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            previewModeAsDefault={true}
            editorId={`editor-for-${isNew ? "new-therad" : threadId}`}
            handleSubmit={() => null}
            editorStyleOverride={styles.editorOverride}
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
