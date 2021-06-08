/**
 * Although the <Responsive /> component handles both DesktopOnly
 * and MobileOnly components dynamically, we have these
 * individual components for syntactic convenience.
 */

import { css, StyleSheet } from "aphrodite";

export type DesktopOnlyProps = {
  children: any;
};

export default function DesktopOnly({ children }: DesktopOnlyProps) {
  return <div className={css(styles.desktop)}>{children}</div>;
}

const styles = StyleSheet.create({
  desktop: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
});
