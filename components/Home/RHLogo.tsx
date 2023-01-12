import { css, StyleDeclarationValue, StyleSheet } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import Lottie from "react-lottie";
import FlaskAnimation from "../../public/rh_animated_flask_new_color.json";
import { useRef } from "react";

type Props = {
  iconStyle: StyleDeclarationValue;
  white?: boolean;
  withText?: boolean;
};

export default function RHLogo({ iconStyle, white, withText }: Props) {
  const lottieRef = useRef();
  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: FlaskAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
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
      <div
        onMouseEnter={() => {
          lottieRef?.current?.play();
        }}
        onMouseLeave={() => lottieRef?.current?.stop()}
      >
        <Lottie options={defaultOptions} ref={lottieRef} />
      </div>
    );
    // <img
    //   src={"/static/ResearchHubIcon.png"}
    //   className={css(styles.logoNoText, iconStyle && iconStyle)}
    //   draggable={false}
    //   alt="RH Logo"
    // />
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
