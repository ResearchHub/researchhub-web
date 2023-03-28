import { StyleSheet, css } from "aphrodite";
import dynamic from "next/dynamic";

// import { Player } from "@lottiefiles/react-lottie-player";

const Loader = (props) => {
  const { size, containerStyle, type, Component } = props;

  const spinner = (type) => {
    if (Component)
      return (
        <Component
          autoplay
          loop
          mode="normal"
          src={"/RH_animated_flask_new_starting_frame.json"}
          style={{
            width: size ? size : 50,
            height: size ? size : 50,
          }}
        ></Component>
      );
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
