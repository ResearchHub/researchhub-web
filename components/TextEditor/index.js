import { Fragment, useState } from "react";

// NPM Components
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import Plain from "slate-plain-serializer";
import { connect } from "react-redux";

// Components
import RichTextEditor from "./RichTextEditor";
import { ModalActions } from "../../redux/modals";

const TextEditor = (props) => {
  const {
    canEdit,
    canCancel,
    canSubmit,
    cancelButtonStyles,
    submitButtonStyles,
    cancelButtonText,
    submitButtonText,
    onCancel,
    onSubmit,
    initialValue,
    placeholder,
    readOnly,
    isLoggedIn,
    commentEditor,
    openLoginModal,
    passedValue,
    onChange,
    hideButton,
  } = props;

  const [value, setValue] = useState(initialValue);
  const [editorRef, setEditorRef] = useState(null);

  function handleChange(value) {
    setValue(value);
    onChange && onChange(value);
  }

  function cancel() {
    onCancel && onCancel();
  }

  function submit() {
    let success = false;
    if (!isLoggedIn) {
      // TODO: pop login modal
      openLoginModal(
        true,
        "Please login with Google to submit a summary revision."
      );
    } else {
      onSubmit && (success = onSubmit(JSON.stringify(value.toJSON())));
      if (success) {
        editorRef.clear();
      }
    }
  }

  return (
    <RichTextEditor
      ref={setEditorRef}
      readOnly={readOnly || false}
      onChange={handleChange}
      initialValue={passedValue ? passedValue : value}
      canCancel={canCancel}
      canSubmit={canSubmit}
      cancel={cancel}
      submit={submit}
      commentEditor={commentEditor}
      value={passedValue ? passedValue : value}
      hideButton={hideButton}
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
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
  },
});

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
