import Link from "next/link";
import { StyleSheet, css } from "aphrodite";

// Components
import Navbar from "./Navbar";

const ComponentWrapper = (props) => {
  return (
    <div
      className={css(
        styles.componentWrapper,
        props.overrideStyle && props.overrideStyle
      )}
    >
      {props.children}
    </div>
  );
};

const styles = StyleSheet.create({
  componentWrapper: {
    margin: "auto",
    width: 600,
    boxSizing: "border-box",
    "@media only screen and (min-width: 300px)": {
      width: "100%",
      paddingRight: 20,
      paddingLeft: 20,
    },

    "@media only screen and (min-width: 768px)": {
      width: 680,
      paddingRight: 0,
      paddingLeft: 0,
    },

    "@media only screen and (min-width: 900px)": {
      width: "80%",
    },

    "@media only screen and (min-width: 1280px)": {
      width: 900,
    },

    "@media only screen and (min-width: 1440px)": {
      width: 1150,
    },
  },
});

export default ComponentWrapper;
