import { createRef, Component } from "react";
import { StyleSheet, css } from "aphrodite";
import colors, { formColors } from "../../config/themes/colors";

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formInputRef = createRef();
  }

  focusOnClick = (e) => {
    e.stopPropagation();
    this.props.onClick && this.props.onClick(e);
    return this.props.getRef
      ? this.props.getRef.current.focus()
      : this.formInputRef.current && this.formInputRef.current.focus();
  };

  handleChange = (e) => {
    const id = e.target.id;
    if (e.target.files) {
      this.props.onChange && this.props.onChange(id, e.target.files[0]);
    } else {
      const value = e.target.value;
      this.props.onChange && this.props.onChange(id, value);
    }
  };

  render() {
    const {
      getRef,
      type,
      autoComplete,
      containerStyle,
      autoFocus,
      disabled,
      error,
      icon,
      iconStyles,
      id,
      inlineNodeRight,
      inlineNodeStyles,
      inputStyle,
      label,
      labelStyle,
      message,
      errorClassName,
      messageStyle,
      onBlur,
      onBlurCapture,
      onClick,
      onFocus,
      placeholder,
      required,
      search,
      onSearchClick,
      size,
      subtitle,
      onSearch,
      noDisabledStyles,
      onKeyDown,
    } = this.props;

    return (
      <div
        className={css(
          styles.inputContainer,
          containerStyle && containerStyle,
          disabled && !noDisabledStyles && styles.disabled
        )}
      >
        {label && (
          <div
            className={css(
              styles.inputLabel,
              styles.text,
              labelStyle && labelStyle,
              !label && styles.hide
            )}
          >
            {label && label}
            {required && <div className={css(styles.asterick)}>*</div>}
          </div>
        )}
        {subtitle && (
          <div
            className={css(
              styles.inputLabel,
              styles.text,
              styles.subtitle,
              !subtitle && styles.hide
            )}
          >
            {subtitle && subtitle}
          </div>
        )}
        <input
          autoCapitalize="off"
          autoComplete={autoComplete}
          className={css(
            styles.input,
            icon && styles.search,
            inputStyle && inputStyle,
            styles.text,
            search && styles.search,
            error && styles.errorInput,
            onClick && styles.inputClick
          )}
          id={id && id}
          autoFocus={autoFocus}
          onBlur={onBlur && onBlur}
          onBlurCapture={onBlurCapture && onBlurCapture}
          onChange={this.handleChange}
          onClick={this.focusOnClick}
          onFocus={onFocus && onFocus}
          placeholder={placeholder ? placeholder : ""}
          ref={getRef ? getRef : this.formInputRef}
          required={required ? required : false}
          type={type ? type : "text"}
          value={this.props.value}
          onKeyDown={onKeyDown}
        />
        {error && (
          <p className={css(styles.text, styles.error, errorClassName)}>
            {error}
          </p>
        )}
        {message && (
          <p className={css(styles.message, messageStyle)}>{message}</p>
        )}
        {search && (
          <img
            src={"/static/icons/search.png"}
            className={css(styles.searchIcon)}
            alt="Search Icon"
          />
        )}
        {icon && typeof icon === "string" ? (
          <img
            src={icon}
            className={css(styles.searchIcon, iconStyles && iconStyles)}
            alt="Form Input Icon"
          />
        ) : (
          icon && (
            <div
              className={css(styles.searchIcon, iconStyles && iconStyles)}
              onClick={onSearchClick}
            >
              {icon}
            </div>
          )
        )}
        {inlineNodeRight && (
          <span className={css(styles.inlineNodeRight, inlineNodeStyles)}>
            {inlineNodeRight}
          </span>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    minHeight: 75,
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
    width: "100%",
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
  inputLabel: {
    fontWeight: 500,
    marginBottom: 10,
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
  },
  subtitle: {
    fontSize: 14,
    color: colors.BLACK(0.5),
    fontWeight: 400,
  },
  input: {
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
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        cursor: "text",
      },
    },
  },
  inputClick: {
    cursor: "pointer",
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
  search: {
    paddingLeft: 45,
    paddingRight: 0,
  },
  searchIcon: {
    height: 18,
    width: 18,
    position: "absolute",
    left: 15,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#c5c4cc",
    pointerEvents: "none",
  },
  inlineNodeRight: {
    position: "absolute",
    right: 0,
    top: 15,
    paddingRight: 16,
    cursor: "pointer",
  },
  error: {
    margin: 0,
    padding: 0,
    marginTop: 4,
    marginBottom: 10,
    color: colors.RED(1),
    fontSize: 12,
  },
  message: {
    margin: 0,
    color: formColors.MESSAGE,
    fontSize: 16,
    padding: 8,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.6,
  },
});

export default FormInput;
