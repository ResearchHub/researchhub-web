import { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";

const PaperPromotion = (props) => {
  const { paper } = props;

  return (
    <div className={css(styles.root)}>
      <img
        src={"/static/icons/paper-promotion.svg"}
        className={css(styles.icon)}
      />
      <span className={css(styles.count)}>36</span>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    color: "#AFADB7",
    display: "flex",
    alignContent: "center",
  },
  icon: {
    marginRight: 5,
  },
});

export default PaperPromotion;
