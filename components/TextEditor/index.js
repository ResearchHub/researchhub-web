import { Fragment, useState } from "react";

// NPM Components
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import Plain from "slate-plain-serializer";
import { connect } from "react-redux";

// Components
import ReadOnlyEdtior from "./ReadOnlyEditor";
import RichTextEditor from "./RichTextEditor";

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
  } = props;

  const defaultPlaceholder = "Enter some text...";
  const defaultInitialValue = Plain.deserialize(
    placeholder || defaultPlaceholder
  );

  const [value, setValue] = useState(initialValue || defaultInitialValue);

  function cancel() {
    onCancel && onCancel();
  }

  function submit() {
    if (!isLoggedIn) {
      // TODO: pop login modal
      alert("Not logged in!");
    } else {
      onSubmit && onSubmit(JSON.stringify(value.toJSON()));
    }
  }

  const Editor = canEdit ? RichTextEditor : ReadOnlyEdtior;

  return (
    <Fragment>
      <Editor
        readOnly={readOnly || false}
        onChange={setValue}
        initialValue={value}
        canCancel={canCancel}
        canSubmit={canSubmit}
        cancel={cancel}
        submit={submit}
      />
    </Fragment>
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
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(TextEditor);
