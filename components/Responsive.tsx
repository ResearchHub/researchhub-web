import { css, StyleSheet } from "aphrodite";

export type ResponsiveProps = {
  onDesktop: boolean;
  children?: any;
};

export default function Responsive({ onDesktop, children }: ResponsiveProps) {
  return (
    <div className={css(onDesktop ? styles.desktop : styles.mobile)}>
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
