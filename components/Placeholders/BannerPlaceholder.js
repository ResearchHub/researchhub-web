import React, { usEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";

import { RectShape } from "react-placeholder/lib/placeholders";

import colors from "~/config/themes/colors";

const BannerPlaceholder = (props) => {
  return (
    <div className={css(styles.card) + " show-loading-animation"}>
      <RectShape className={css(styles.banner)} color={"#EFEFEF"} />
    </div>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
  },
  banner: {
    width: "100%",
    height: 320,
    "@media only screen and (max-width: 767px)": {
      height: 180,
    },
  },
});

export default BannerPlaceholder;
