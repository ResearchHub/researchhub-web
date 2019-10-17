import React from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

import colors from "~/config/themes/colors";

const HubTag = ({ tag, overrideStyle }) => {
  let { name, link } = tag;
  return (
    // <Link
    //   href={link && link}
    // >
    <div className={css(styles.tag, overrideStyle && overrideStyle)}>
      <span className={css(styles.label)}>{name && name}</span>
    </div>
    // </Link>
  );
};

const styles = StyleSheet.create({
  tag: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edeefe",
    height: 21,
    borderRadius: 3,
    cursor: "pointer",
    marginRight: 10,
    border: "1px solid #FFF",
    ":hover": {
      color: "#FFF",
      borderColor: colors.BLUE(1),
    },
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: colors.BLUE(1),
    height: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    padding: "3px 10px 3px 10px",
  },
});

export default HubTag;
