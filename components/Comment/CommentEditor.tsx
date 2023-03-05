import { useEffect, useRef, useState, createRef } from "react";
import dynamic from "next/dynamic";
import CreateBountyBtn from "~/components/Bounty/CreateBountyBtn";
import Button from "~/components/Form/Button";
import { css, StyleSheet } from "aphrodite";
import isQuillEmpty from "./lib/isQuillEmpty";
import CommentEditorToolbar from "./CommentEditorToolbar";
import QuillPeerReviewRatingBlock from "~/components/TextEditor/lib/QuillPeerReviewRatingBlock";
const ReactQuill = dynamic(async() => {
  const quillPkg = await import("react-quill");
  const MagicUrl = (await import("quill-magic-url")).default;
  const ReactQuill = quillPkg.default;
  const Quill = ReactQuill.Quill;

  Quill.register("modules/magicUrl", MagicUrl);

  return ({ forwardedRef, ...props }) => <ReactQuill ref={forwardedRef} {...props} />;
  

  return ReactQuill;
  
  // return function forwardRef({ forwardedRef, ...props }) {
  //   return <ReactQuill ref={forwardedRef} {...props} />;
  // };
}, {
  ssr: false
});

console.log('React', ReactQuill)

// const QuillMagicUrl = dynamic(() => import("quill-magic-url"), { ssr: false });
// const Quilll = Quill.import('core/module');


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
  const [_previewWhenInactive, _setPreviewWhenInactive] =
    useState(previewWhenInactive);
  const [_isPreview, _setIsPreview] = useState(previewWhenInactive);
  const _isPreviewRef = useRef(_isPreview);
  const [_content, _setContent] = useState<string>(content);
  const [_isFocused, _setIsFocused] = useState(false);
  const [editorModules, setEditorModules] = useState(buildQuillModules({
    editorId,
    handleImageUpload: () => null,
    handleSubmit: () => handleSubmit({ content: _content })
  }));
  const ref = createRef(null)


  const handleEditorChange = (value, delta, source, editor) => {
    const editorContents = editor.getContents();
    if (isQuillEmpty(editorContents)) {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }

    _setContent(value);
  };

  useEffect(() => {
    const _handleClick = (e) => {
      const isOutsideClick =
        !_isPreviewRef.current && !editorRef.current?.contains(e.target);
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
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, []);

  // useEffect(() => {
  //   if (_isFocused) {
  //     editorRef.current.focus();
  //   }
  // }, [_isFocused]);



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
          <ReactQuill
            ref={ref}
            preserveWhitespace
            placeholder={placeholder}
            theme="snow"
            modules={editorModules}
            value={_content}
            formats={QuillFormats}
            onChange={handleEditorChange}
          />
        </div>
      )}
      <div className={css(styles.toolbarContainer)}>
        <CommentEditorToolbar editorId={editorId} />
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
    flexDirection: "row-reverse",
  },
  toolbarContainer: {
    
  }
});

export default CommentEditor;
