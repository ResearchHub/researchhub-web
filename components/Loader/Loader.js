import { ClipLoader, DotLoader, BeatLoader } from "react-spinners";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import { Lottie } from "@crello/react-lottie";
import FlaskAnimation from "../../public/RH_animated_flask_new_starting_frame.json";

const Loader = (props) => {
  const {
    loading,
    color,
    size,
    sizeUnit,
    loaderStyle,
    style,
    containerStyle,
    type,
  } = props;

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: FlaskAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const spinner = (type) => {
    switch (type) {
      case "dot":
        return (
          <DotLoader
            css={loaderStyle && loaderStyle}
            sizeUnit={sizeUnit ? sizeUnit : "px"}
            size={size ? size : 60}
            color={color ? color : colors.BLUE(1)}
            loading={loading}
            style={style}
          />
        );
      case "clip":
        return (
          <ClipLoader
            css={loaderStyle && loaderStyle}
            sizeUnit={sizeUnit ? sizeUnit : "px"}
            size={size ? size : 35}
            color={color ? color : colors.BLUE(1)}
            loading={loading}
            style={style}
          />
        );
      case "beat":
        return (
          <BeatLoader
            css={loaderStyle && loaderStyle}
            sizeUnit={sizeUnit ? sizeUnit : "px"}
            size={size ? size : 20}
            color={color ? color : colors.BLUE(1)}
            loading={loading}
            style={style}
          />
        );

      default:
        return (
          // <ClipLoader
          //   css={loaderStyle && loaderStyle}
          //   sizeUnit={sizeUnit ? sizeUnit : "px"}
          //   size={size ? size : 35}
          //   color={color ? color : colors.BLUE(1)}
          //   loading={loading}
          //   style={style}
          // />
          <Lottie
            config={defaultOptions}
            height={size ? size : 50}
            width={size ? size : 50}
          />
        );
    }
  };

  return (
    <div className={css(styles.loader, containerStyle && containerStyle)}>
      {spinner(type)}
    </div>
  );
};

const styles = StyleSheet.create({
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
