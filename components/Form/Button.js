import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Ripples from "react-ripples";
import { breakpoints } from "~/config/themes/screen";
import colors, { iconColors } from "../../config/themes/colors";

function Button(props) {
  const {
    type,
    label,
    isWhite,
    fullWidth,
    size = "med", // small, med, large
    variant = "contained",
    disabled,
    isLink,
    customButtonStyle,
    customLabelStyle,
    onClick,
    onSubmit,
    icon,
    customIconStyle,
    hideRipples,
    rippleClass,
    children,
  } = props;

  if (isLink) {
    let { href, linkAs, query } = isLink;

    return (
      <Link
        href={href ? (query ? { pathname: href, query } : href) : null}
        as={linkAs && linkAs}
        legacyBehavior
      >
        <a
          className={css(
            styles.button,
            isWhite && styles.isWhite,
            size && styles[size],
            variant === "contained" && styles.variantContained,
            variant === "outlined" && styles.variantOutlined,
            variant === "text" && styles.variantText,
            customButtonStyle && customButtonStyle,
            disabled && styles.disabled,
            fullWidth && styles.fullWidth
          )}
        >
          {icon && (
            <img
              src={icon}
              className={css(styles.icon, iconStyle && iconStyle)}
              alt="Button Icon"
            />
          )}
          <div
            className={css(
              styles.label,
              isWhite && styles.isWhiteLabel,
              customLabelStyle && customLabelStyle
            )}
          >
            {children
              ? children
              : label && typeof label === "function"
              ? label()
              : label}
          </div>
        </a>
      </Link>
    );
  } else {
    let button = (
      <button
        className={css(
          styles.button,
          isWhite && styles.isWhite,
          size && styles[size],
          variant === "contained" && styles.variantContained,
          variant === "outlined" && styles.variantOutlined,
          variant === "text" && styles.variantText,
          customButtonStyle && customButtonStyle,
          disabled && styles.disabled,
          fullWidth && styles.fullWidth
        )}
        type={type ? type : "button"}
        onSubmit={onSubmit ? onSubmit : null}
        onClick={hideRipples && onClick ? onClick : null}
      >
        {icon && (
          <img
            src={icon}
            className={css(styles.icon, customIconStyle && customIconStyle)}
            draggable={false}
            alt="Button Icon"
          />
        )}
        <div
          className={css(
            styles.label,
            isWhite && styles.isWhiteLabel,
            customLabelStyle && customLabelStyle
          )}
        >
          {label && typeof label === "function" ? label() : label}
          {children}
        </div>
      </button>
    );
    if (!hideRipples && !disabled) {
      return (
        <Ripples
          className={css(styles.ripples, rippleClass)}
          onClick={onClick ? onClick : null}
        >
          {button}
        </Ripples>
      );
    }
    return button;
  }
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    userSelect: "none",
    textDecoration: "none",
    fontWeight: 500,
    lineHeight: 1.75,
    ":hover": {
      opacity: 0.9,
    },
  },
  fullWidth: {
    width: "100%",
  },
  variantContained: {
    backgroundColor: colors.NEW_BLUE(1),
    color: "white",
    border: `1px solid ${colors.NEW_BLUE(1)}`,
  },
  variantOutlined: {
    backgroundColor: "white",
    color: colors.NEW_BLUE(1),
    border: `1px solid ${colors.NEW_BLUE(1)}`,
  },
  variantText: {
    backgroundColor: "unset",
    color: colors.BLACK(),
    border: `1px solid transparent`,
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
  small: {
    padding: "5px 10px",
    fontSize: 15,
  },
  med: {
    fontSize: 16,
    padding: "6px 16px",
  },
  large: {
    padding: "8px 22px",
    fontSize: 18,
  },
  ripples: {},
  isWhite: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.NEW_BLUE(1)}`,
    color: colors.NEW_BLUE(1),
    ":hover": {
      borderColor: "#FFF",
      boxShadow: "2px 2x 2px 2px #EDEDED",
      backgroundColor: colors.NEW_BLUE(1),
      color: "#FFF",
    },
  },
  label: {
    margin: 0,
    padding: 0,
  },
  isWhiteLabel: {
    color: "inherit",
  },

  newPost: {
    width: 90,
    height: 45,
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.4,
  },
  icon: {
    marginRight: 10,
    userSelect: "none",
  },
});

export default Button;
