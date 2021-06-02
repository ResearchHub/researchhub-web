import React, { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { MyEditor } from "~/components/CKEditor/MyEditor";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className={css(styles.page)}>
        <MyEditor />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    maxWidth: "100vw",
    overflow: "hidden",
    background: "#FFF",
  },
});

export default Index;
