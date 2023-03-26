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
}

const ALink: FunctionComponent<Props> = ({
  href,
  as,
  children,
  theme = themes.default,
  overrideStyle = null,
  target = null,
}): ReactElement => {
  return (
    <Link
      href={href}
      as={as}
      className={css(styles.ALink, styles[themes[theme]], overrideStyle)}
      target={target || undefined}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
};

const styles = StyleSheet.create({
  ALink: {
    color: colors.BLACK(),
    fontWeight: 400,
    textDecoration: "none",
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  linkThemeDefault: {},
  linkThemeSolidPrimary: {
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
});

export default ALink;
