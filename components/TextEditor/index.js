import { useState, useEffect } from "react";

// NPM Components
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Components
import QuillTextEditor from "./QuillTextEditor";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import { convertToEditorToHTML } from "~/config/utils/editor";
import { genClientId } from "~/config/utils/id";
import getDefaultPostType from "~/components/Editor/util/getDefaultPostType";

function TextEditor(props) {
  const {
    clearOnSubmit,
    onCancel,
    onSubmit,
    initialValue,
    readOnly,
    isLoggedIn,
    commentEditor,
    openLoginModal,
    passedValue,
    onChange,
    hideButton,
    hideCancelButton,
    containerStyles,
    commentStyles,
    loading,
    commentEditorStyles,
    editing,
    hasHeader,
    summary,
    mediaOnly,
    setMessage,
    showMessage,
    uid = genClientId(),
    documentType,
  } = props;

  const [value, setValue] = useState(convertToEditorToHTML(initialValue)); // need this only to initialize value, not to keep state
  const [editorRef, setEditorRef] = useState(null);
  const [selectedPostType, setSelectedPostType] = useState(
    getDefaultPostType({ documentType })
  );

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleChange(value) {
    onChange && onChange(value);
  }

  function cancel() {
    onCancel && onCancel();
  }
  /**
   * Used to check if editor is empty upon submission
   * @param { Object } content -- quill's node blocks
   */
  function isQuillEmpty(content) {
    if (JSON.stringify(content) == '{"ops":[{"insert":"\\n"}]}') {
      return true;
    } else {
      return false;
    }
  }

  function submit({ content, plainText, callback, discussionType }) {
    if (!isLoggedIn) {
      openLoginModal(true, "Please Sign in with Google to continue.");
    } else {
      if (isQuillEmpty(content)) {
        setMessage("Content cannot be empty.");
        return showMessage({ error: true, show: true, clickoff: true });
      }
      onSubmit && onSubmit({ content, plainText, callback, discussionType });
      if (clearOnSubmit) {
        callback();
      }
    }
  }

  function setInternalRef(editor) {
    props.setRef && props.setRef(editor);
  }
  return (
    <div>
      <QuillTextEditor
        value={passedValue ? convertToEditorToHTML(passedValue) : value} // update this formula to detect if value is delta or previous data
        uid={uid}
        key={`textEditor-${uid}`}
        setRef={setInternalRef}
        ref={setEditorRef}
        readOnly={readOnly || false}
        mediaOnly={mediaOnly}
        onChange={handleChange}
        clearOnSubmit={clearOnSubmit}
        containerStyles={containerStyles}
        cancel={cancel}
        submit={submit}
        commentEditor={commentEditor}
        hideButton={hideButton}
        hideCancelButton={hideCancelButton && hideCancelButton}
        commentStyles={commentStyles && commentStyles}
        loading={loading && loading}
        commentEditorStyles={commentEditorStyles && commentEditorStyles}
        editing={editing}
        hasHeader={hasHeader && hasHeader}
        summary={summary && summary}
        setSelectedPostType={setSelectedPostType}
        selectedPostType={selectedPostType}
      />
    </div>
  );
}

TextEditor.propTypes = {
  canEdit: PropTypes.bool,
  canCancel: PropTypes.bool,
  cancelButtonStyles: PropTypes.object,
  submitButtonStyles: PropTypes.object,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  initialValue: PropTypes.object,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  hideButton: PropTypes.bool,
  loading: PropTypes.bool,
  focusEditor: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor);
