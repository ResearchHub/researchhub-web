import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

class Health extends React.Component {
  render() {
    return (
      <div className={css(styles.page)}>
        Healthy
        <meta name="robots" content="noindex" />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  },
});

export default Health;
