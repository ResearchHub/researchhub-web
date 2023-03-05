import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontCase } from "@fortawesome/pro-solid-svg-icons";
import { faChevronUp } from "@fortawesome/pro-regular-svg-icons";
import { useState } from "react";

type Args = {
  editorId: string,
  isFullToolbarOpen: boolean,
  setIsFullToolbarOpen: Function,
}

const CommentEditorToolbar = ({ editorId, setIsFullToolbarOpen, isFullToolbarOpen }: Args) => {

  return (
    <div id={editorId} className="ql-toolbar">
      <span className="ql-formats">
        <button className="ql-blockquote"></button>
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video"></button>
        <button
          id="show-editor"
          className={`show-full-editor ${isFullToolbarOpen ? "ql-active" : ""}`}
          onClick={() => setIsFullToolbarOpen(!isFullToolbarOpen)}
        >
          {/* TODO: This requires updating font awesome common types */}
          <FontAwesomeIcon icon={faFontCase} />
          <span className="ql-up">
            <FontAwesomeIcon icon={faChevronUp} />
          </span>
        </button>
      </span>

      <div
        className={`ql-full-editor ${
          isFullToolbarOpen && "ql-full-editor-visible"
        }`}
      >
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
