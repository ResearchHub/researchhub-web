import { useQuill } from "./hooks/useQuill";
import CommentEditorToolbar from "./CommentEditorToolbar";
import { css, StyleSheet } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import ReactDOMServer from "react-dom/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

const buildQuillModules = ({ editorId, handleSubmit, handleImageUpload }) => {
  const modules = {
    magicUrl: true,
    keyboard: {
      bindings: {
        commandEnter: {
          key: 13,
          shortKey: true,
          metaKey: true,
          handler: handleSubmit,
        },
      },
    },
    toolbar: {
      magicUrl: true,
      container: `#${editorId}`,
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  return modules;
}

const QuillFormats = [
  "image",
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "clean",
  "background",
  "code-block",
  "direction",
  "peer-review-rating",
];

type CommentEditorArgs = {
  editorId: string,
  previewWhenInactive?: boolean;
  placeholder?: string;
  handleSubmit: Function;
  content?: string;
  allowBounty?: boolean;
};

const CommentEditor = ({ 
  editorId,
  previewWhenInactive = false,
  placeholder = "Add comment or start a bounty",
  handleSubmit,
  content = "",
  allowBounty = false,
 }: CommentEditorArgs) => {
  const editorRef = useRef<any>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [_content, _setContent] = useState<string>(content);
  const [_previewWhenInactive, _setPreviewWhenInactive] =
    useState(previewWhenInactive);
  const [_isPreview, _setIsPreview] = useState(previewWhenInactive);
  const [isFullToolbarOpen, setIsFullToolbarOpen] = useState(false);
  const _isPreviewRef = useRef(_isPreview);
  const [_isFocused, _setIsFocused] = useState(false);
  const { quill, quillRef, Quill } = useQuill({
    modules: buildQuillModules({
      editorId,
      handleImageUpload: () => null,
      handleSubmit: () => handleSubmit({ content: _content })
    }),
    formats: QuillFormats
  });

  useEffect(() => {
    const _handleClick = (e) => {
      const isOutsideClick =
        !_isPreviewRef.current && !editorRef.current?.contains(e.target);
      const isFullToolbarTriggerClick = e.target.closest(".show-full-editor");
      const isFullToolbarClick = e.target.closest(".ql-full-editor");
      const excludedElems = [".reply-btn", ".edit-btn"];
      const clickOnExcluded = excludedElems.reduce(
        (prev, selector) => Boolean(prev || e.target.closest(selector)),
        false
      );

      if (previewWhenInactive && isOutsideClick && !clickOnExcluded) {
        _setIsPreview(true);
      }
      if (!isOutsideClick && !_isFocused) {
        _setIsFocused(true);
      }
      if (!isFullToolbarTriggerClick && !isFullToolbarClick) {
        setIsFullToolbarOpen(false);
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, []);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        console.log(quill.getContents()); // Get delta contents
      });
    }
  }, [quill]);

  if (Quill && !quill) {
    const MagicUrl = require('quill-magic-url').default;
    Quill.register('modules/magicUrl', MagicUrl);
    const icons = Quill.import("ui/icons");
    console.log('icons')
    icons.video = ReactDOMServer.renderToString(<FontAwesomeIcon icon={faVideo} />);    
  }

  return (
    <div
      ref={editorRef}
      className={css(styles.commentEditor)}
      onClick={() => {
        _setIsPreview(false);
        _isPreviewRef.current = false;
      }}
    >
      {_isPreview ? (
        <div>
          <div>{placeholder}</div>
        </div>
      ) : (
        <div>
          <div ref={quillRef} />
          <div className={css(styles.toolbarContainer)}>
            <CommentEditorToolbar
              editorId={editorId}
              isFullToolbarOpen={isFullToolbarOpen}
              setIsFullToolbarOpen={setIsFullToolbarOpen}
            />
          </div>
        </div>
      )}
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
    minHeight: 105,
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.1)",
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
  }
});

export default CommentEditor;
