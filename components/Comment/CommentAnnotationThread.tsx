import { GenericDocument } from "../Document/lib/types";
import CommentEditor from "./CommentEditor";
import Comment from "./Comment";
import { StyleSheet, css } from "aphrodite";
import colors from "./lib/colors";
import { Comment as CommentType } from "./lib/types";

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
  isFocused = true,
}: Props) => {
  console.log("re-render");

  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} document={document} />
      ))}
      {/* {isFocused && (
        <div className={css(styles.editorWrapper)}>
          <CommentEditor
            previewModeAsDefault={true}
            editorId={`editor-for-${isNew ? "new-therad" : threadId}`}
            handleSubmit={() => null}
            editorStyleOverride={styles.editorOverride}
          />
        </div>
      )} */}
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
