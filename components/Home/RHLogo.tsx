import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";

export default function RHLogo({ iconStyle, white, withText }) {
  // intentional strict check
  if (withText === true) {
    return (
      <img
        src={white ? "/static/white_logo.png" : "/static/ResearchHubLogo.png"}
        className={css(styles.logo, iconStyle && iconStyle)}
        draggable={false}
        alt="RH Logo"
      />
    );
  } else if (withText === false) {
    return (
      <img
        src={"/static/ResearchHubIcon.png"}
        className={css(styles.logoNoText, iconStyle && iconStyle)}
        draggable={false}
        alt="RH Logo"
      />
    );
  } else {
    return (
      <div className={css(styles.RhLogoContainer)}>
        <img
          src={white ? "/static/white_logo.png" : "/static/ResearchHubLogo.png"}
          className={css(styles.logo, styles.desktop, iconStyle && iconStyle)}
          draggable={false}
          alt="RH Logo"
        />
        <img
          src={"/static/ResearchHubIcon.png"}
          className={css(styles.mobile, iconStyle && iconStyle)}
          draggable={false}
          alt="RH Logo"
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  RhLogoContainer: {
    display: "flex",
    alignItems: "center",
  },
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
