import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors, { formColors } from "../../config/themes/colors";

class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formInputRef = React.createRef();
  }

  focusOnClick = (e) => {
    e.stopPropagation();
    this.props.onClick && this.props.onClick();
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
      id,
      getRef,
      label,
      placeholder,
      type,
      required,
      size,
      containerStyle,
      labelStyle,
      inputStyle,
      search,
      error,
      icon,
      messageStyle,
      iconStyles,
      inlineNodeRight,
      inlineNodeStyles,
      disabled,
      message,
      autoComplete,
      subtitle,
      onSearch,
      onClick,
    } = this.props;

    return (
      <div
        className={css(
          styles.inputContainer,
          containerStyle && containerStyle,
          disabled && styles.disabled
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
          id={id && id}
          type={type ? type : "text"}
          value={this.props.value}
          required={required ? required : false}
          placeholder={placeholder ? placeholder : ""}
          ref={getRef ? getRef : this.formInputRef}
          className={css(
            styles.input,
            inputStyle && inputStyle,
            styles.text,
            search && styles.search,
            icon && styles.search,
            onClick && styles.inputClick
          )}
          onChange={this.handleChange}
          onClick={this.focusOnClick}
          autoComplete={autoComplete}
          onSearch={onSearch && onSearch}
        />
        {error && <p className={css(styles.text, styles.error)}>{error}</p>}
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
          <div className={css(styles.searchIcon, iconStyles && iconStyles)}>
            {icon}
          </div>
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
    width: 525,
    display: "flex",
    flexDirection: "column",
    alignItems: "space-between",
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
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
        boxShadow: "0px 0px 1px 1px #3f85f7",
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
    bottom: 10,
    color: "#c5c4cc",
  },
  inlineNodeRight: {
    position: "absolute",
    right: 0,
    top: 15,
    paddingRight: 7,
    cursor: "pointer",
  },
  error: {
    margin: 0,
    padding: 0,
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
