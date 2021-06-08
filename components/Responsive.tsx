import { css, StyleSheet } from "aphrodite";

export type ResponsiveProps = {
  desktopOnly: boolean;
  children?: any;
};

export default function Responsive({ desktopOnly, children }: ResponsiveProps) {
  return (
    <div className={css(desktopOnly ? styles.desktop : styles.mobile)}>
      {children}
    </div>
  );
}

const styles = StyleSheet.create({
  desktop: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
    },
  },
});
