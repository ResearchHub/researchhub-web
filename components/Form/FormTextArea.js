import { StyleSheet, css } from "aphrodite";
import TextareaAutosize from "react-autosize-textarea";

// Config
import colors from "../../config/themes/colors";

const FormTextArea = (props) => {
  let {
    id,
    label,
    placeholder,
    required,
    containerStyle,
    labelStyle,
    inputStyle,
    onChange,
    value,
    passedRef,
    autoFocus,
    error,
  } = props;

  return (
    <div
      id={id}
      className={css(styles.inputContainer, containerStyle && containerStyle)}
    >
      <div
        className={css(
          styles.inputLabel,
          labelStyle && labelStyle,
          styles.text,
          !label && styles.hide
        )}
      >
        {label && label}
        {required && <div className={css(styles.asterick)}>*</div>}
      </div>
      <TextareaAutosize
        inputRef={(ref) => (passedRef = ref)}
        autoFocus={autoFocus && autoFocus}
        className={css(
          styles.input,
          styles.text,
          inputStyle && inputStyle,
          error && styles.errorInput
        )}
        required={required && required}
        placeholder={placeholder && placeholder}
        onChange={(e) => onChange && onChange(id, e.target.value)}
        value={value}
      />
      {error && <p className={css(styles.text, styles.error)}>{error}</p>}
    </div>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    height: 19,
    fontWeight: "500",
    marginBottom: 10,
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
  },
  input: {
    minHeight: 130,
    width: "calc(100% - 30px)",
    display: "flex",
    alignItems: "center",
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    padding: 15,
    fontWeight: "400",
    borderRadius: 2,
    color: "#232038",
    highlight: "none",
    outline: "none",
    cursor: "default",
    lineHeight: 1.6,
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        boxShadow: "0px 0px 1px 1px #3f85f7",
        cursor: "text",
      },
    },
  },
  asterick: {
    color: colors.BLUE(1),
  },
  placeholder: {
    color: "#8e8d9a",
    fontWeight: 400,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
  hide: {
    display: "none",
  },
  errorInput: {
    borderColor: colors.RED(),
    ":hover": {
      borderColor: colors.RED(),
    },
    ":focus": {
      borderColor: colors.RED(),
      ":hover": {
        cursor: "text",
      },
    },
  },
  error: {
    margin: 0,
    padding: 0,
    marginTop: 4,
    marginBottom: 10,
    color: colors.RED(1),
    fontSize: 12,
  },
});

export default FormTextArea;
