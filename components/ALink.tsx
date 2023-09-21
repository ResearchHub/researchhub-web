import { FunctionComponent, ReactElement, ReactNode } from "react";
import Link from "next/link";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

export const themes = {
  default: "linkThemeDefault",
  solidPrimary: "linkThemeSolidPrimary",
  blackAndBlue: "blankAndBlue",
  green: "green",
};

interface Props {
  theme?: string;
  href: any;
  as?: any;
  children?: ReactNode;
  overrideStyle?: any;
  target?: string;
  disableTextDeco?: boolean;
  weight?: number;
  onClick?: (e) => void;
}

const ALink: FunctionComponent<Props> = ({
  href,
  as,
  children,
  theme = themes.default,
  overrideStyle = null,
  target = null,
  disableTextDeco = false,
  weight = 400,
  onClick,
}): ReactElement => {
  return (
    <Link
      href={href}
      as={as}
      className={css(
        styles.ALink,
        styles[themes[theme]],
        disableTextDeco && styles.disableTextDeco,
        overrideStyle
      )}
      style={{ fontWeight: weight }}
      target={target || undefined}
      onClick={(e) => {
        onClick && onClick(e);
        e.stopPropagation();
      }}
    >
      {children}
    </Link>
  );
};

export const styles = StyleSheet.create({
  ALink: {
    color: colors.BLACK(),
    textDecoration: "none",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  linkThemeDefault: {},
  linkThemeSolidPrimary: {
    cursor: "pointer",
    textDecoration: "none",
    color: colors.NEW_BLUE(),
    ":hover": {
      color: colors.NEW_BLUE(),
      textDecoration: "underline",
    },
  },
  blankAndBlue: {
    color: colors.BLACK(),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  green: {
    color: colors.NEW_GREEN(),
    ":hover": {
      color: colors.NEW_GREEN(),
      textDecoration: "underline",
    },
  },
  disableTextDeco: {
    color: "inherit",
    textDecoration: "none",
    ":hover": {
      color: "inherit",
      textDecoration: "none",
    },
  },
});

export default ALink;
