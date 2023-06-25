import { GenericDocument } from "../Document/lib/types";
import CommentEditor from "./CommentEditor";
import {
  Comment as CommentModel,
  RenderedAnnotationThread,
  CommentThread,
} from "./lib/types";
import Comment from "./Comment";
import { ID } from "~/config/types/root_types";
import { StyleSheet, css } from "aphrodite";
import colors from "./lib/colors";

interface Props {
  thread: RenderedAnnotationThread;
  document: GenericDocument;
  isFocused?: boolean;
}

const CommentAnnotationThread = ({
  thread,
  document,
  isFocused = true,
}: Props) => {
  console.log("re-render");

  return (
    <div>
      {thread.comments.map((comment) => (
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
