import { css, StyleDeclarationValue, StyleSheet } from "aphrodite";
import dynamic from "next/dynamic";
import { breakpoints } from "~/config/themes/screen";
import FlaskAnimation from "../../public/RH_animated_flask_new_starting_frame.json";
import { useRef, useState } from "react";

const Lottie = dynamic(() => import("react-lottie"));

type Props = {
  iconStyle: StyleDeclarationValue;
  white?: boolean;
  withText?: boolean;
};

export default function RHLogo({ iconStyle, white, withText }: Props) {
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const lottieRef = useRef();
  const defaultOptions = {
    loop: false,
    animationData: FlaskAnimation,
    autoplay: false,
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
          setAnimationPlaying(true);
        }}
      >
        <Lottie
          options={defaultOptions}
          isStopped={!animationPlaying}
          ref={lottieRef}
          height={40}
          width={40}
          eventListeners={[
            {
              eventName: "complete",
              callback: () => {
                setAnimationPlaying(false);
              },
            },
          ]}
        />
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
