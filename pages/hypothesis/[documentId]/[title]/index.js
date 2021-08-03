import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import killswitch from "~/config/killswitch/killswitch";

const isServer = () => typeof window === "undefined";

const Hypothesis = (props) => {
  if (!killswitch("hypothesis") && !isServer()) {
    Router.push("/");
  }

  return <div className={css(styles.container)}>{/* TODO */}</div>;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default Hypothesis;
