import Link from "next/link";
import { StyleSheet, css } from "aphrodite";

// Components
import Navbar from "./Navbar";

const ComponentWrapper = (props) => {
  return <div className={css(styles.componentWrapper)}>{props.children}</div>;
};

const styles = StyleSheet.create({
  componentWrapper: {
    margin: "auto",
    width: 600,

    "@media only screen and (min-width: 300px)": {
      width: "100%",
      paddingRight: 20,
      paddingLeft: 20,
    },

    "@media only screen and (min-width: 768px)": {
      width: 700,
    },

    "@media only screen and (min-width: 1280px)": {
      width: 900,
    },
  },
});

export default ComponentWrapper;
