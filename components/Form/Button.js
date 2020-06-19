import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";

const Button = ({
  type,
  label,
  isWhite,
  size, // size is a enum; type string: ['small', 'med', 'big']
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
}) => {
  if (isLink) {
    let { href, linkAs, query } = isLink;
    return (
      <Link
        href={href ? (query ? { pathname: href, query } : href) : null}
        as={linkAs && linkAs}
      >
        <div
          className={css(
            styles.button,
            isWhite && styles.isWhite,
            size && styles[size],
            customButtonStyle && customButtonStyle,
            disabled && styles.disabled
          )}
        >
          {icon && (
            <img
              src={icon}
              className={css(styles.icon, iconStyle && iconStyle)}
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
          </div>
        </div>
      </Link>
    );
  } else {
    let button = (
      <button
        className={css(
          styles.button,
          isWhite && styles.isWhite,
          size && styles[size],
          customButtonStyle && customButtonStyle,
          disabled && styles.disabled
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
        </div>
      </button>
    );
    if (!hideRipples) {
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
};

const styles = StyleSheet.create({
  button: {
    width: 126,
    height: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BLUE(1),
    borderRadius: 5,
    cursor: "pointer",
    highlight: "none",
    outline: "none",
    border: "none",
    userSelect: "none",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
    "@media only screen and (max-width: 415px)": {
      width: "unset",
      height: "unset",
      minHeight: 30,
      minWidth: 100,
    },
  },
  ripples: {},
  isWhite: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
    ":hover": {
      borderColor: "#FFF",
      boxShadow: "2px 2x 2px 2px #EDEDED",
      backgroundColor: colors.BLUE(1),
      color: "#FFF",
    },
  },
  label: {
    color: "#FFF",
    fontFamily: "Roboto",
    fontWeight: 400,
    fontSize: 15,
    margin: 0,
    padding: 0,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
  isWhiteLabel: {
    color: "inherit",
  },
  small: {
    width: 126,
    height: 37,
  },
  med: {
    width: 126,
    height: 45,
  },
  big: {
    width: 160,
    height: 55,
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
