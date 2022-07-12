import { useState, useEffect } from "react";

// NPM Components
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Components
import QuillTextEditor from "./QuillTextEditor";
import PostTypeSelector from "~/components/Editor/PostTypeSelector";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import { convertToEditorToHTML } from "~/config/utils/editor";
import { genClientId } from "~/config/utils/id";
import colors from "~/config/themes/colors";
import postTypes from "../Editor/config/postTypes";

function TextEditor(props) {
  const {
    canCancel,
    canSubmit,
    classNames,
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
    showDiff,
    previousVersion,
    placeholder,
    hideCancelButton,
    containerStyles,
    commentStyles,
    smallToolBar,
    loading,
    commentEditorStyles,
    editing,
    focusEditor,
    hasHeader,
    summary,
    mediaOnly,
    setMessage,
    showMessage,
    children,
    uid = genClientId(),
  } = props;

  const [value, setValue] = useState(convertToEditorToHTML(initialValue)); // need this only to initialize value, not to keep state
  const [editorRef, setEditorRef] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(
    postTypes.find((opt) => opt.isDefault)
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
      {/* <PostTypeSelector
        handleSelect={(selectedType) => setSelectedPostType(selectedType)}
      /> */}
      <QuillTextEditor
        value={passedValue ? convertToEditorToHTML(passedValue) : value} // update this formula to detect if value is delta or previous data
        uid={uid}
        key={`textEditor-${uid}`}
        setRef={setInternalRef}
        ref={setEditorRef}
        readOnly={readOnly || false}
        mediaOnly={mediaOnly}
        onChange={handleChange}
        canCancel={canCancel}
        canSubmit={canSubmit}
        clearOnSubmit={clearOnSubmit}
        containerStyles={containerStyles}
        cancel={cancel}
        submit={submit}
        commentEditor={commentEditor}
        hideButton={hideButton}
        showDiff={showDiff}
        previousVersion={previousVersion}
        classNames={classNames}
        hideCancelButton={hideCancelButton && hideCancelButton}
        commentStyles={commentStyles && commentStyles}
        smallToolBar={smallToolBar && smallToolBar}
        loading={loading && loading}
        commentEditorStyles={commentEditorStyles && commentEditorStyles}
        editing={editing}
        hasHeader={hasHeader && hasHeader}
        summary={summary && summary}
      >
        {children}
      </QuillTextEditor>
    </div>
  );
}

TextEditor.propTypes = {
  canEdit: PropTypes.bool,
  canCancel: PropTypes.bool,
  canSubmit: PropTypes.bool,
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
