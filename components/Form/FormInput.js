import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors, { formColors } from "../../config/themes/colors";

class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e) => {
    let id = e.target.id;
    let value = e.target.value;
    this.props.onChange && this.props.onChange(id, value);
  };

  render() {
    let {
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
      iconStyles,
      inlineNodeRight,
      disabled,
      message,
    } = this.props;

    return (
      <div
        className={css(
          styles.inputContainer,
          containerStyle && containerStyle,
          disabled && styles.disabled
        )}
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
        <input
          id={id && id}
          type={type ? type : "text"}
          value={this.props.value}
          required={required ? required : false}
          placeholder={placeholder ? placeholder : ""}
          ref={getRef && getRef}
          className={css(
            styles.input,
            inputStyle && inputStyle,
            styles.text,
            search && styles.search,
            icon && styles.search
          )}
          onChange={this.handleChange}
        />
        {error && <p className={css(styles, text, styles.error)}>{error}</p>}
        {message && <p className={css(styles.message)}>{message}</p>}
        {search && (
          <img
            src={"/static/icons/search.png"}
            className={css(styles.searchIcon)}
          />
        )}
        {icon && (
          <img
            src={icon}
            className={css(styles.searchIcon, iconStyles && iconStyles)}
          />
        )}
        {inlineNodeRight && (
          <span className={css(styles.inlineNodeRight)}>{inlineNodeRight}</span>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 75,
    width: 525,
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
    height: 50,
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
    ":focus": {
      borderColor: "#D2D2E6",
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
  },
  inlineNodeRight: {
    position: "absolute",
    right: 0,
    top: 15,
    paddingRight: 15,
    cursor: "pointer",
    "@media only screen and (max-width: 321px)": {
      top: "unset",
      paddingRight: 15,
      bottom: 0,
    },
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
