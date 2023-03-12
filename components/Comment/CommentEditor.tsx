import { useQuill } from "./hooks/useQuill";
import CommentEditorToolbar from "./CommentEditorToolbar";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import buildQuillModules from "./lib/buildQuillModules";
import QuillFormats from "./lib/quillFormats";
import isQuillEmpty from "../TextEditor/util/isQuillEmpty";
import { AuthorProfile } from "~/config/types/root_types";
import CommentAuthors from "./CommentAuthors";
import CommentTypeSelector from "./CommentTypeSelector";
import { COMMENT_TYPES } from "./lib/types";
import useQuillContent from "./hooks/useQuillContent";
import colors from "./lib/colors";
import { commentTypes } from "./lib/options";


type CommentEditorArgs = {
  editorId: string;
  placeholder?: string;
  handleSubmit: Function;
  content?: object;
  allowBounty?: boolean;
  commentType?: COMMENT_TYPES;
  author?: AuthorProfile | null;
};

const CommentEditor = ({
  editorId,
  placeholder = "Add comment or start a bounty",
  handleSubmit,
  content = {},
  allowBounty = false,
  commentType,
  author,
}: CommentEditorArgs) => {
  const editorRef = useRef<any>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [_commentType, _setCommentType] = useState<COMMENT_TYPES>(
    commentType || commentTypes.find((t) => t.isDefault)!.value
  );
  const { quill, quillRef } = useQuill({
    modules: buildQuillModules({
      editorId,
      handleImageUpload: () => null,
      handleSubmit: () => handleSubmit({ content: _content }),
    }),
    formats: QuillFormats,
    placeholder,
  });
  const { content: _content } = useQuillContent({
    quill,
    content,
  });

  useEffect(() => {
    const isDisabled = isQuillEmpty(_content) ? true : false;
    setIsSubmitDisabled(isDisabled);
  }, [_content]);

  return (
    <div ref={editorRef} className={css(styles.commentEditor)}>
      <div>
        {author && (
          <div className={css(styles.authorRow)}>
            <CommentAuthors authors={[author]} />
            <span style={{ marginTop: -5 }}>
              <CommentTypeSelector
                handleSelect={_setCommentType}
                selectedType={_commentType}
              />
            </span>
          </div>
        )}
        <div className={css(styles.editor)}>
          <div ref={quillRef} />
          <div className={css(styles.toolbarContainer)}>
            <CommentEditorToolbar editorId={editorId} />
          </div>
        </div>
      </div>
      <div className={css(styles.actions)}>
        {allowBounty && (
          // @ts-ignore
          <CreateBountyBtn />
        )}
        <Button
          label={"Post"}
          onClick={() => handleSubmit({ content: _content })}
          disabled={isSubmitDisabled}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentEditor: {
    display: "flex",
    padding: "16px 24px",
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.1)",
    backgroundColor: "white",
    borderRadius: 16,
    flex: "none",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  toolbarContainer: {
    position: "relative",
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: 15,
  },
  editor: {
  },
  authorRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    marginBottom: 10,
  },
});

export default CommentEditor;
