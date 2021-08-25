import React from "react";
import { ELNEditor } from "~/components/CKEditor/ELNEditor";
import { StyleSheet, css } from "aphrodite";

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={css(styles.page)}>
        <ELNEditor />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    background: "#FFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    maxWidth: "100vw",
    overflow: "hidden",
  },
});

export default Index;
