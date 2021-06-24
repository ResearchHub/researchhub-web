/**
 * Although the <Responsive /> component handles both DesktopOnly
 * and MobileOnly components dynamically, we have these
 * individual components for syntactic convenience.
 */

import { css, StyleSheet } from "aphrodite";

export type MobileOnlyProps = {
  children: any;
};

export default function MobileOnly({ children }) {
  return <div className={css(styles.mobile)}>{children}</div>;
}

const styles = StyleSheet.create({
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
    },
  },
});
