import AuthorAvatar from "~/components/AuthorAvatar";
import { StyleSheet, css } from "aphrodite";
import { useState } from "react";
import Link from "next/link";
import colors from "../config/themes/colors";

const SupportList = (props) => {
  useEffect(() => {}, [props.supporter]);

  const renderList = () => {};

  return <div className={css(styles.root)}></div>;
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "max-content",
  },
});
