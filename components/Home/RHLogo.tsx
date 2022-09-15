import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";

export default function RHLogo({ iconStyle, white, withText }) {
  return (
    <>
      <img
        src={white ? "/static/white_logo.png" : "/static/ResearchHubLogo.png"}
        className={css(styles.logo, styles.desktop, iconStyle && iconStyle)}
        draggable={false}
        alt="RH Logo"
      />
      <img
        src={"/static/ResearchHubIcon.png"}
        className={css(
          styles.logoNoText,
          styles.mobile,
          iconStyle && iconStyle
        )}
        draggable={false}
        alt="RH Logo"
      />
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    transform: "scale(1)",
    height: 33,
  },
  logoNoText: {
    transform: "scale(1)",
    height: 33,
  },
  mobile: {
    [`@media only screen and (min-width: ${breakpoints.large.int - 1}px)`]: {
      display: "none",
    },
  },
  desktop: {
    display: "none",
    [`@media only screen and (min-width: ${breakpoints.large.str})`]: {
      display: "block",
    },
  },
});
