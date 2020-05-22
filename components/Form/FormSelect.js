import React from "react";
import Select from "react-select";
import { StyleSheet, css } from "aphrodite";
import makeAnimated from "react-select/animated";

// Config
import * as Options from "../../config/utils/options";
import colors from "../../config/themes/colors";

const animatedComponents = makeAnimated();

class FormSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnChange = (id, option) => {
    this.props.onChange && this.props.onChange(id, option);
  };

  render() {
    let {
      id,
      ref,
      required,
      label,
      placeholder,
      containerStyle,
      labelStyle,
      inputStyle,
      multiTagStyle,
      multiTagLabelStyle,
      value,
      options,
      menu,
      isMulti,
      isDisabled,
      error,
      isSearchable,
      isClearable,
      indicatorSeparator,
      singleValue,
    } = this.props;

    const defaultValue = {
      value: null,
      label: placeholder,
    };

    const formatStyle = (styleObject) => {
      if (!styleObject) {
        return;
      }

      var formattedStyle;
      if (styleObject["_definition"]) {
        formattedStyle = { ...styleObject["_definition"] };
      }

      return formattedStyle ? formattedStyle : styleObject;
    };

    const colorStyles = {
      control: (styles) => ({
        ...styles,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: error ? `1px solid ${colors.RED(1)}` : "1px solid #E8E8F2",
        minHeight: 50,
        width: "100%",
        backgroundColor: "#FBFBFD",
        paddingLeft: 8,
        fontWeight: "400",
        borderRadius: 2,
        color: "#232038",
        highlight: "none",
        outline: "none",
        textTransform: "capitalize",
        cursor: "pointer",
        ":focus": {
          borderColor: "#D2D2E6",
          ":hover": {
            cursor: "pointer",
          },
        },
        ...formatStyle(inputStyle),
      }),
      indicatorSeparator: (styles) => ({
        ...styles,
        ...formatStyle(indicatorSeparator),
      }),
      singleValue: (styles) => ({
        ...styles,
        ...formatStyle(singleValue),
      }),
      menu: (styles) => ({
        ...styles,
        ...formatStyle(menu),
        textTransform: "capitalize",
      }),
      placeholder: (styles) => ({
        ...styles,
        color: "#8e8d9a",
        fontWeight: 400,
      }),
      multiValue: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: "#edeefe",
          ...formatStyle(multiTagStyle),
        };
      },
      multiValueLabel: (styles, { data }) => {
        return {
          ...styles,
          ...formatStyle(multiTagLabelStyle),
        };
      },
    };

    return (
      <div
        className={css(styles.inputContainer, containerStyle && containerStyle)}
        id={id && id}
        ref={ref}
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
        <Select
          components={animatedComponents}
          options={options && options}
          onChange={(option) => this.handleOnChange(id, option)}
          styles={colorStyles}
          placeholder={placeholder}
          value={value}
          required={required ? required : "false"}
          isMulti={isMulti}
          isSearchable={isSearchable === null ? true : isSearchable}
          isDisabled={isDisabled}
          isClearable={isClearable}
        />
      </div>
    );
  }
}

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
});

export default FormSelect;
