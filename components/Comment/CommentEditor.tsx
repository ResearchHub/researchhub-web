import { useQuill } from "./hooks/useQuill";
import CommentEditorToolbar from "./CommentEditorToolbar";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import { QuillFormats, buildQuillModules } from "./lib/quill";
import isQuillEmpty from "../TextEditor/util/isQuillEmpty";
import { AuthorProfile } from "~/config/types/root_types";
import CommentAvatars from "./CommentAvatars";
import CommentTypeSelector from "./CommentTypeSelector";
import { COMMENT_TYPES } from "./lib/types";
import useQuillContent from "./hooks/useQuillContent";
import colors from "./lib/colors";
import { commentTypes } from "./lib/options";
import { useEffectHandleClick } from "~/config/utils/clickEvent";


type CommentEditorArgs = {
  editorId: string;
  placeholder?: string;
  handleSubmit: Function;
  content?: object;
  allowBounty?: boolean;
  commentType?: COMMENT_TYPES;
  author?: AuthorProfile | null;
  previewWhenInactive?: boolean;
};

const CommentEditor = ({
  editorId,
  placeholder = "Add comment or start a bounty",
  handleSubmit,
  content = {},
  allowBounty = false,
  commentType,
  author,
  previewWhenInactive = true,
}: CommentEditorArgs) => {
  const editorRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const isEmptyRef = useRef(isEmpty);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(previewWhenInactive);
  const isPreviewModeRef = useRef(previewWhenInactive);
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

  if (previewWhenInactive) {
    useEffectHandleClick({
      el: editorRef.current,
      onOutsideClick: () => {
        setIsPreviewMode(true);
        isPreviewModeRef.current = true;
      },
      onInsideClick: () => {
        setIsPreviewMode(false);
        isPreviewModeRef.current = false;
        quill && !quill.hasFocus() && quill.focus();
      }
    });
  }

  useEffect(() => {
    const isEmpty = isQuillEmpty(_content) ? true : false;
    setIsEmpty(isEmpty);
    isEmptyRef.current = isEmpty;
  }, [_content]);

  return (
    <div ref={editorRef} className={css(styles.commentEditor)}>
      <div>
        {author && (
          <div className={css(styles.authorRow, isPreviewMode && styles.hidden)}>
            <div className={css(styles.nameRow)}>
              <CommentAvatars authors={[author]} />
              <div className={css(styles.name)}>
                {author.firstName} {author.lastName}
              </div>
            </div>
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
            <div className={css(styles.toolbarContainer, isPreviewMode && styles.hidden)}>
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
          disabled={isEmpty}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  commentEditor: {
    display: "flex",
    padding: "15px",
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.1)",
    backgroundColor: "white",
    borderRadius: 10,
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
  editor: {},
  hidden: { display: "none" },
  authorRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    marginBottom: 10,
  },
  nameRow: {
    display: "flex",
    columnGap: "5px",
    fontSize: 15,
    alignItems: "center",    
  }
});

export default CommentEditor;
