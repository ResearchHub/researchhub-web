import React from "react";
import { StyleSheet, css } from "aphrodite";

class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Props={
  //   label={string}
  //   placeholder={string}
  //   type={string}
  //   required={boolean}
  //   size={[‘small’, ‘medium’, ‘big’]}
  //   containerStyle=
  //   labelStyle
  //   inputStyle
  //   onChange
  //   value
  // }

  handleChange = (e) => {
    let value = e.target.value;
    this.props.onChange && this.props.onChange(value);
  };

  render() {
    let {
      label,
      placeholder,
      type,
      required,
      size,
      containerStyle,
      labelStyle,
      inputStyle,
      search,
    } = this.props;
    return (
      <div
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
        <input
          type={type ? type : "text"}
          value={this.props.value}
          required={required ? required : false}
          placeholder={placeholder ? placeholder : ""}
          className={css(
            styles.input,
            inputStyle && inputStyle,
            styles.text,
            search && styles.search
          )}
          onChange={this.handleChange}
        />
        {search && (
          <img
            src={"/static/icons/search.png"}
            className={css(styles.searchIcon)}
          />
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
    width: 495,
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
    color: "#4E53FF",
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
});

export default FormInput;
