import { useState, useEffect } from "react";

// NPM Components
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plain from "slate-plain-serializer";
import { isAndroid, isMobile } from "react-device-detect";
var isAndroidJS = false;
if (process.browser) {
  const ua = navigator.userAgent.toLowerCase();
  isAndroidJS = ua && ua.indexOf("android") > -1;
}
// Components
import QuillTextEditor from "./QuillTextEditor";

// Redux
import { ModalActions } from "../../redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import { convertToEditorToHTML } from "~/config/utils";

const TextEditor = (props) => {
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
    removeStickyToolbar,
    editing,
    focusEditor,
    hasHeader,
  } = props;

  const [value, setValue] = useState(convertToEditorToHTML(initialValue)); // need this only to initialize value, not to keep state
  const [editorRef, setEditorRef] = useState(null);
  const [uid, setUid] = useState(createUid());

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

  async function submit(content, plain_text, callback) {
    let success = false;
    if (!isLoggedIn) {
      openLoginModal(true, "Please Sign in with Google to continue.");
    } else {
      if (isQuillEmpty(content)) {
        props.setMessage("Content cannot be empty.");
        return props.showMessage({ error: true, show: true, clickoff: true });
      }

      onSubmit && (success = await onSubmit(content, plain_text, callback));
      if (success && clearOnSubmit) {
        callback();
      }
    }
  }

  function setInternalRef(editor) {
    props.setRef && props.setRef(editor);
  }

  function createUid() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  return (
    <QuillTextEditor
      value={passedValue ? convertToEditorToHTML(passedValue) : value} // update this formula to detect if value is delta or previous data
      uid={uid}
      key={`textEditor-${uid}`}
      setRef={setInternalRef}
      ref={setEditorRef}
      readOnly={readOnly || false}
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
      placeholder={placeholder && placeholder}
      hideCancelButton={hideCancelButton && hideCancelButton}
      commentStyles={commentStyles && commentStyles}
      smallToolBar={smallToolBar && smallToolBar}
      loading={loading && loading}
      commentEditorStyles={commentEditorStyles && commentEditorStyles}
      editing={editing}
      focusEditor={focusEditor && focusEditor}
      hasHeader={hasHeader && hasHeader}
    />
  );
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextEditor);
