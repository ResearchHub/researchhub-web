import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import getDefaultPostType from "~/components/TextEditor/util/getDefaultPostType";
import { getPostTypeStruct } from "./config/postTypes";
import isQuillEmpty from "./util/isQuillEmpty";
import { captureEvent } from "~/config/utils/events";

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
    focusEditor,
    hideButton,
    placeholder,
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
    postType,
    uid = genClientId(),
    documentType,
    isBounty,
    isAcceptedAnswer,
    isTopLevelComment = false,
    callback,
    showBountyBtn,
    quillContainerStyle,
  } = props;

  const [value, setValue] = useState(convertToEditorToHTML(initialValue)); // need this only to initialize value, not to keep state
  const [selectedPostTypeStruct, setSelectedPostTypeStruct] = useState(
    postType
      ? getPostTypeStruct({ postType, documentType })
      : getDefaultPostType({ documentType })
  );

  if (!selectedPostTypeStruct) {
    const msg =
      "Could not find a matching post type struct in TextEditor. Did not render comment.";
    captureEvent({
      msg,
      data: { postType, value, selectedPostTypeStruct },
    });
    return null;
  }

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleChange(value) {
    onChange && onChange(value);
  }

  function cancel() {
    onCancel && onCancel();
  }

  function submit(submitContent) {
    if (!isLoggedIn) {
      openLoginModal(true, "Please Sign in with Google to continue.");
    } else {
      if (isQuillEmpty(submitContent.content)) {
        setMessage("Content cannot be empty.");
        return showMessage({ error: true, show: true, clickoff: true });
      }

      onSubmit && onSubmit(submitContent);

      if (clearOnSubmit) {
        callback && callback();
      }
    }
  }

  function setInternalRef(editor) {
    props.setRef && props.setRef(editor);
  }
  return (
    <QuillTextEditor
      value={passedValue ? convertToEditorToHTML(passedValue) : value} // update this formula to detect if value is delta or previous data
      uid={uid}
      key={`textEditor-${uid}`}
      setRef={setInternalRef}
      showBountyBtn={showBountyBtn}
      readOnly={readOnly}
      mediaOnly={mediaOnly}
      onChange={handleChange}
      clearOnSubmit={clearOnSubmit}
      containerStyles={containerStyles}
      quillContainerStyle={quillContainerStyle}
      cancel={cancel}
      submit={submit}
      isBounty={isBounty}
      focusEditor={focusEditor}
      commentEditor={commentEditor}
      hideButton={hideButton}
      hideCancelButton={hideCancelButton && hideCancelButton}
      commentStyles={commentStyles && commentStyles}
      loading={loading && loading}
      isTopLevelComment={isTopLevelComment}
      commentEditorStyles={commentEditorStyles && commentEditorStyles}
      editing={editing}
      placeholder={placeholder}
      hasHeader={hasHeader && hasHeader}
      summary={summary && summary}
      setSelectedPostTypeStruct={setSelectedPostTypeStruct}
      selectedPostTypeStruct={selectedPostTypeStruct}
      documentType={documentType}
      isAcceptedAnswer={isAcceptedAnswer}
    />
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
