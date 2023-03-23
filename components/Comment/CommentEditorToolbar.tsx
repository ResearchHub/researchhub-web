import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontCase, faChevronUp } from "@fortawesome/pro-regular-svg-icons";
import { useRef, useState } from "react";
import { useEffectHandleOutsideClick } from "~/config/utils/isOutsideClick";

type Args = {
  editorId: string;
};

const CommentEditorToolbar = ({ editorId }: Args) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toolbarRef = useRef(null);

  useEffectHandleOutsideClick({
    el: toolbarRef.current,
    exclude: [".ql-full-editor-visible"],
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    // Please note that the `ql-*` classnames are reserved names in Quill
    // and needed for proper operation.
    (<div id={editorId} className="ql-toolbar" ref={toolbarRef}>
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
    </div>)
  );
};

export default CommentEditorToolbar;
