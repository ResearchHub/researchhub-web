import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CreateBountyBtn from "~/components/Bounty/CreateBountyBtn";
import Button from "~/components/Form/Button";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type CommentEditorArgs = {
  isPreviewMode?: boolean;
  placeholder?: string;
}

const CommentEditor = ({
  isPreviewMode = true,
  placeholder = "Add comment or start a bounty"
}: CommentEditorArgs) => {
  const [value, setValue] = useState<string>('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [_isFocused, _setIsFocused] = useState(false);
  const [_isPreviewMode, _setIsPreviewMode] = useState(isPreviewMode);
  const _isPreviewModeRef = useRef(_isPreviewMode);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const _handleClick = (e) => {
      const isOutsideClick = !_isPreviewModeRef.current && !editorRef.current?.contains(e.target)
      if (isOutsideClick) {
        _setIsPreviewMode(true);
      }
      else if (!isOutsideClick && !_isFocused) {
        _setIsFocused(true);
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    }
  }, []);

  useEffect(() => {
    if (_isFocused) {
      editorRef.current.focus();
    }
  }, [_isFocused]);

  return (
    <div
      ref={editorRef}
      style={{
        display: "flex",
        padding: "16px 24px",
        minHeight: 105,
        boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.1)",
        borderRadius: 16,
        flex: "none",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => {
        _setIsPreviewMode(false);
        _isPreviewModeRef.current = false;
      }}
    >
      {_isPreviewMode ? (
        <div>
          <div>{placeholder}</div>
        </div>
      ) : (
        <div>
          {typeof(document) !== "undefined" &&
            <ReactQuill
              placeholder={placeholder}
              theme="snow"
              value={value}
              onChange={setValue}
            />
          }
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* @ts-ignore */}
        <CreateBountyBtn />
        <Button label={"Post"} disabled={isSubmitDisabled} />
      </div>
    </div>
  )
}

export default CommentEditor;