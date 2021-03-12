import React, { useState, Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

// Component
import AuthorAvatar from "~/components/AuthorAvatar";
import ThreadTextEditor from "~/components/Threads/ThreadTextEditor";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const InlineTextEditor = (props) => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.userAvatar)}>
        <AuthorAvatar size={25} />
      </div>
      <input
        className={css(styles.input)}
        type="text"
        placeholder={"Leave a comment"}
      />
      {/** this will need to be replaced with draft or another editor */}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 15,
    boxSizing: "border-box",
  },
  input: {
    minHeight: 40,
    width: "100%",
    paddingLeft: 40,
    boxSizing: "border-box",
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
  },
  userAvatar: {
    position: "absolute",
    left: 3,
    top: 1,
  },
});

export default InlineTextEditor;
