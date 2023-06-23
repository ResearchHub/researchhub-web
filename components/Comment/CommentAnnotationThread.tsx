import { GenericDocument } from "../Document/lib/types";
import CommentEditor from "./CommentEditor";
import { Comment as CommentModel, CommentThread } from "./lib/types";
import Comment from "./Comment";
import { ID } from "~/config/types/root_types";

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
        <CommentEditor
          previewModeAsDefault={true}
          editorId={`editor-for-${isNew ? "new-therad" : threadId}`}
          handleSubmit={() => null}
        />
      )}
    </div>
  );
};

export default CommentAnnotationThread;
