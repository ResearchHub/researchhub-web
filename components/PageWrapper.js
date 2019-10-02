import Link from "next/link";
import { StyleSheet, css } from "aphrodite";

// Components
import Navbar from "./Navbar";

const PageWrapper = (props) => {
  return (
    <div className={css(styles.pageWrapper)}>
      <Navbar />
      {props.children}
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
  },
});

export default PageWrapper;
