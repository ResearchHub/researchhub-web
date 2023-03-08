import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontCase } from "@fortawesome/pro-solid-svg-icons";
import { faChevronUp } from "@fortawesome/pro-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
import isOutsideClick from "~/config/utils/isOutsideClick";

type Args = {
  editorId: string;
};

const CommentEditorToolbar = ({ editorId }: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toolbarRef = useRef(null);

  useEffect(() => {
    const _handleClick = (e) => {
      const _isOutsideClick = isOutsideClick({
        el: toolbarRef.current,
        clickedEl: e.target,
        exclude: [".ql-full-editor-visible"],
      });

      if (_isOutsideClick) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, []);

  return (
    <div id={editorId} className="ql-toolbar" ref={toolbarRef}>
      <span className="ql-formats">
        <button className="ql-blockquote"></button>
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video"></button>
        <button
          id="show-editor"
          className={`show-full-editor ${isOpen ? "ql-active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faFontCase} />
          <span className="ql-up">
            <FontAwesomeIcon icon={faChevronUp} />
          </span>
        </button>
      </span>

      <div className={`ql-full-editor ${isOpen && "ql-full-editor-visible"}`}>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <button className="ql-code-block"></button>
          <button className="ql-clean"></button>
        </span>
      </div>
    </div>
  );
};

export default CommentEditorToolbar;
