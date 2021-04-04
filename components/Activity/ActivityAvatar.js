import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Ripples from "react-ripples";
import PropTypes from "prop-types";
import Link from "next/link";

// Components
import AuthorAvatar from "../AuthorAvatar";
import colors from "~/config/themes/colors";

const ActivityAvatar = (props) => {
  const { contributionType } = props;

  const getIconSrc = () => {
    const iconName = contributionType.toLowerCase();
    return `/static/icons/activityFeed/${iconName}.png`;
  };

  return (
    <div className={css(styles.root)}>
      <AuthorAvatar {...props} />
      <img className={css(styles.icon)} src={getIconSrc()} />
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    height: 15,
    minHeight: 15,
    maxHeight: 15,
    width: 15,
    minWidth: 15,
    maxWidth: 15,
    bottom: 4,
    right: 0,
  },
});

export default ActivityAvatar;
