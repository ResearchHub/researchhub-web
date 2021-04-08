import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Link from "next/link";

// import AuthorAvatar from "../AuthorAvatar";
import ActivityAvatar from "./ActivityAvatar";
import ActivityDescription from "./ActivityDescription";
import { ClampedText } from "~/components/Typography";

import colors from "~/config/themes/colors";
import { getAuthorName } from "~/config/utils/";

const ActivityHeader = ({ activity }) => {
  const { contribution_type: contributionType } = activity;

  const user = getUser();
  const author = user["author_profile"];
  const username = getAuthorName(author);

  function getUser() {
    switch (contributionType) {
      case "UPVOTER":
      case "COMMENTER":
      case "SUBMITTER":
      case "CURATOR":
        return activity["user"];
      case "SUPPORTER":
        return source["created_by"];
      default:
        break;
    }
  }

  const activityAvatarProps = {
    size: 30,
    author,
    name: username,
    contributionType,
  };

  const activityDescriptionProps = {
    activity,
    username,
    author,
    contributionType,
  };

  return (
    <div className={css(styles.root)}>
      <ActivityAvatar {...activityAvatarProps} />
      <ActivityDescription {...activityDescriptionProps} />
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "center",
  },
  textContainer: {
    color: colors.BLACK(0.6),
    paddingLeft: 5,
    fontSize: 14,
    lineHeight: 1.3,
  },
  link: {
    textDecoration: "unset",
    cursor: "pointer",
    color: "unset",
  },
  text: {
    fontWeight: 500,
    color: colors.BLACK(0.8),
    ":hover": {
      color: colors.BLUE(),
    },
  },
  hidden: {
    display: "none",
  },
});

export default ActivityHeader;
