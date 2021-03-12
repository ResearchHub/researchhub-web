import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";

const ColumnContainer = (props) => {
  const { overrideStyles } = props;

  return (
    <div className={css(styles.root, overrideStyles && overrideStyles)}>
      {props.children}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    border: "1.5px solid #F0F0F0",
    backgroundColor: "#fff",
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.02)",
    boxSizing: "border-box",
  },
});

export default ColumnContainer;
