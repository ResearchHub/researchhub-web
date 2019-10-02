import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Editor } from "slate-react";
import Plain from "slate-plain-serializer";

const TextEditor = (props) => {
  let {
    placeholder,
    canCancel,
    canSubmit,
    cancelButtonStyles,
    submitButtonStyles,
    cancelButtonText,
    submitButtonText,
    onCancel,
    onSubmit,
  } = props;

  if (!placeholder) {
    placeholder = "Enter some text...";
  }

  const initialValue = Plain.deserialize(placeholder);
  const [value, setValue] = useState(initialValue);

  function cancel() {
    onCancel && onCancel();
    console.log("cancel clicked");
  }

  function submit() {
    onSubmit && onSubmit(value);
    console.log(value);
  }

  return (
    <Fragment>
      <Editor value={value} onChange={(change) => setValue(change.value)} />
      <div className={css(styles.buttonContainer)}>
        {canCancel && (
          <button className={css(cancelButtonStyles)} onClick={cancel}>
            {cancelButtonText || "Cancel"}
          </button>
        )}
        {canSubmit && (
          <button className={css(submitButtonStyles)} onClick={submit}>
            {submitButtonText || "Submit"}
          </button>
        )}
      </div>
    </Fragment>
  );
};

TextEditor.propTypes = {
  placeholder: PropTypes.string,
  canCancel: PropTypes.bool,
  canSubmit: PropTypes.bool,
  cancelButtonStyles: PropTypes.object,
  submitButtonStyles: PropTypes.object,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
  },
});

export default TextEditor;
