import { useState } from "react";

// NPM Components
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Plain from "slate-plain-serializer";

// Components
import RichTextEditor from "./RichTextEditor";

import { ModalActions } from "../../redux/modals";

import { convertToEditorValue } from "~/config/utils";

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
  } = props;

  const [value, setValue] = useState(convertToEditorValue(initialValue));
  const [editorRef, setEditorRef] = useState(null);

  function handleChange(value) {
    setValue(value);
    onChange && onChange(value);
  }

  function cancel() {
    onCancel && onCancel();
  }

  function resetValue() {
    setValue(convertToEditorValue(""));
  }

  async function submit() {
    if (value.document.text === "" || value.document.text === " ") {
      return;
    }

    let success = false;
    if (!isLoggedIn) {
      // TODO: pop login modal
      openLoginModal(
        true,
        "Please login with Google to submit a summary revision."
      );
    } else {
      onSubmit &&
        (success = await onSubmit(
          value.toJSON({ preserveKeys: true }),
          Plain.serialize(value)
        ));
      if (success && clearOnSubmit !== false) {
        editorRef.clear();
      }
      if (clearOnSubmit !== false) {
        resetValue();
      }
    }
  }

  function setInternalRef(editor) {
    props.setRef && props.setRef(editor);
  }

  return (
    <RichTextEditor
      setRef={setInternalRef}
      ref={setEditorRef}
      readOnly={readOnly || false}
      onChange={handleChange}
      initialValue={passedValue ? passedValue : value}
      canCancel={canCancel}
      canSubmit={canSubmit}
      containerStyles={containerStyles}
      cancel={cancel}
      submit={submit}
      commentEditor={commentEditor}
      value={passedValue ? passedValue : value}
      hideButton={hideButton}
      showDiff={showDiff}
      previousVersion={previousVersion}
      classNames={classNames}
      placeholder={placeholder && placeholder}
      autoFocus={true}
      hideCancelButton={hideCancelButton && hideCancelButton}
      commentStyles={commentStyles && commentStyles}
      smallToolBar={smallToolBar && smallToolBar}
      loading={loading && loading}
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
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextEditor);
