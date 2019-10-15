import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

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
          <p
            className={css(
              styles.label,
              isWhite && styles.isWhiteLabel,
              customLabelStyle && customLabelStyle
            )}
          >
            {label && label}
          </p>
        </div>
      </Link>
    );
  } else {
    return (
      <button
        className={css(
          styles.button,
          isWhite && styles.isWhite,
          size && styles[size],
          customButtonStyle && customButtonStyle,
          disabled && styles.disabled
        )}
        type={type ? type : "button"}
        onClick={onClick ? onClick : null}
        onSubmit={onSubmit ? onSubmit : null}
      >
        {icon && (
          <img
            src={icon}
            className={css(styles.icon, customIconStyle && customIconStyle)}
          />
        )}
        <p
          className={css(
            styles.label,
            isWhite && styles.isWhiteLabel,
            customLabelStyle && customLabelStyle
          )}
        >
          {label && label}
        </p>
      </button>
    );
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
    ":hover": {
      backgroundColor: "#3E43E8",
    },
  },
  isWhite: {
    backgroundColor: "#FFF",
    border: `1px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
    ":hover": {
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
  },
});

export default Button;
