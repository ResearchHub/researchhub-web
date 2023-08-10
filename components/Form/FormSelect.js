import { cloneElement, Component } from "react";
import Select, { components } from "react-select";
import { StyleSheet, css } from "aphrodite";
import makeAnimated from "react-select/animated";
import get from "lodash/get";

// Config
import colors from "../../config/themes/colors";
import { isDevEnv } from "~/config/utils/env";

const animatedComponents = makeAnimated();

// Will display count of selected options instead
// of listing each individual option label.
// Format: {label} {selectedCount}
const CustomValueContainerWithCount = ({ children, getValue, ...props }) => {
  const length = getValue().length;
  const label = get(props, "selectProps.placeholder", "");

  return (
    <components.ValueContainer {...props}>
      {!props.selectProps.menuIsOpen && (
        <div>
          <span>{label}</span>
          {length > 0 && (
            <span className={css(styles.countBadge)}>{length}</span>
          )}
        </div>
      )}
      {cloneElement(children[1])}
    </components.ValueContainer>
  );
};

// Will display the selected value along label
// Format: {label}: {selectedValue}
const CustomValueContainerWithLabel = ({ children, getValue, ...props }) => {
  const rawValue = getValue();
  const label = get(props, "selectProps.placeholder", "");
  const selectedValue = get(rawValue, "[0].label") || "";

  return (
    <components.ValueContainer {...props}>
      <span className={css(styles.emphasizedLabel)}>{label}</span>
      {selectedValue.length > 0 && (
        <span>
          {":"} {selectedValue}
        </span>
      )}
      {cloneElement(children[1])}
    </components.ValueContainer>
  );
};

class FormSelect extends Component {
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
      defaultValue,
      maxMenuHeight,
      showCountInsteadOfLabels,
      showLabelAlongSelection,
      isOptionDisabled,
    } = this.props;

    const configuredComponents = {
      animatedComponents,
    };

    if (showCountInsteadOfLabels) {
      configuredComponents.ValueContainer = CustomValueContainerWithCount;
    } else if (showLabelAlongSelection) {
      configuredComponents.ValueContainer = CustomValueContainerWithLabel;
    }

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
      menuPortal: (base) => ({ ...base, zIndex: 100000000 }),
      control: (styles) => ({
        ...styles,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: error
          ? `1px solid ${colors.RED(1)}`
          : `1px solid ${colors.LIGHT_GREYISH_BLUE}`,
        minHeight: 50,
        width: "100%",
        backgroundColor: colors.ICY_GREY,
        paddingLeft: 8,
        fontWeight: "400",
        borderRadius: 2,
        color: colors.DARK_DESATURATED_BLUE(),
        highlight: "none",
        outline: "none",
        textTransform: "capitalize",
        cursor: "pointer",
        ":focus": {
          borderColor: colors.LIGHT_GRAYISH_BLUE6(),
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
        backgroundColor: colors.DARKER_GREY(),
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
        color: colors.DARK_GREYISH_BLUE7(),
        fontWeight: 400,
      }),
      multiValue: (styles, { data }) => {
        return {
          ...styles,
          backgroundColor: colors.PURE_BLACK(),
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
        data-test={isDevEnv() ? `select-${id}` : undefined}
      >
        <div
          className={css(
            styles.inputLabel,
            styles.text,
            labelStyle && labelStyle,
            !label && styles.hide
          )}
        >
          {label && label}
          {required && <span style={{ color: colors.BLUE(1) }}>*</span>}
        </div>
        <Select
          components={{ ...configuredComponents }}
          defaultValue={defaultValue}
          isClearable={isClearable}
          isDisabled={isDisabled}
          isMulti={isMulti}
          isSearchable={isSearchable === null ? true : isSearchable}
          maxMenuHeight={maxMenuHeight && maxMenuHeight}
          menuPortalTarget={process.browser ? document.body : undefined}
          menuPosition="fixed"
          onChange={(option) => this.handleOnChange(id, option)}
          options={options}
          placeholder={placeholder}
          required={required ? required : "false"}
          styles={colorStyles}
          value={value}
          isOptionDisabled={isOptionDisabled}
        />
        {error && <p className={css(styles.text, styles.error)}>{error}</p>}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    minHeight: 75,
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
    color: colors.DARK_DESATURATED_BLUE(),
    display: "flex",
    justifyContent: "flex-start",
  },
  emphasizedLabel: {
    fontWeight: 500,
  },
  countBadge: {
    backgroundColor: colors.LIGHT_BLUE(),
    borderRadius: 20,
    color: colors.BLUE(),
    padding: "3px 8px",
    marginLeft: 10,
  },
  input: {
    display: "flex",
    alignItems: "center",
    border: `1px solid ${colors.LIGHT_GREYISH_BLUE}`,
    backgroundColor: colors.ICY_GREY,
    padding: 15,
    fontWeight: "400",
    borderRadius: 3,
    color: colors.DARK_DESATURATED_BLUE(),
    highlight: "none",
    outline: "none",
    ":focus": {
      borderColor: colors.LIGHT_GRAYISH_BLUE6(),
    },
  },
  placeholder: {
    color: colors.DARK_GREYISH_BLUE7(),
    fontWeight: 400,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
  },
  hide: {
    display: "none",
  },
  error: {
    margin: 0,
    padding: 0,
    marginTop: 4,
    marginBottom: 4,
    color: colors.RED(1),
    fontSize: 12,
  },
});

export default FormSelect;
