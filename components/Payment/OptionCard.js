import React, { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";

// Component

// Redux
import { AuthActions } from "~/redux/auth";
import { AuthorActions } from "~/redux/author";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

// Config
import colors, { formColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const OptionCard = (props) => {
  const { active, onClick, label, sublabel, index } = props;

  function handleClick() {}

  return (
    <div className={css(styles.root)} onClick={handleClick}>
      <div className={css(styles.selectInput)}></div>
      <div className={css(styles.label)}></div>
      <div className={css(styles.sublabel)}></div>
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: formColors.BACKGROUND,
    border: "1px solid",
    borderColor: formColors.BORDER,
    ":hover": {
      borderColor: colors.BLUE(),
    },
  },
  selectInput: {},
});
