import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Link from "next/link";

import AuthorAvatar from "../AuthorAvatar";
import { ClampedText } from "~/components/Typography";

import colors from "~/config/themes/colors";
import { getAuthorName } from "~/config/utils/";

const ActivityUserLine = (props) => {
  const [isHidden, setIsHidden] = useState(false);
  const { activity } = props;
  const { source, paper, contribution_type: contributionType } = activity;
  const { paper_title: paperTitle } = paper;
  const user = getUser(activity);
  const author = user["author_profile"];
  const { id: authorId } = author;
  const username = getAuthorName(author);

  const authorAvatarProps = {
    size: 30,
    author,
    name: username,
  };

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

  function getTitle() {
    switch (contributionType) {
      case "CURATOR": //creates summary
        break;
      case "UPVOTER": // variable
      case "SUBMITTER":
      case "COMMENTER":
      case "SUPPORTER":
        return paperTitle;
      default:
        return null;
    }
  }

  const renderUsername = () => {
    return (
      <Link
        href={"/user/[authorId]/[tabName]"}
        as={`/user/${authorId}/contributions`}
      >
        <a className={css(styles.link)}>
          <span className={css(styles.text)}>{username}</span>
        </a>
      </Link>
    );
  };

  const renderTitle = () => {
    return <span className={css(styles.text)}>{getTitle()}</span>;
  };

  const renderActionString = () => {
    switch (contributionType) {
      case "CURATOR": //creates summary
        break;
      case "UPVOTER":
        return " voted on ";
      case "SUBMITTER":
        return " submitted ";
      case "COMMENTER":
        return " commented on ";
      case "SUPPORTER":
        return " supported ";
      default:
        return null;
    }
  };

  const renderHeader = () => {
    return (
      <span onClick={(e) => e.stopPropagation()}>
        {renderUsername()}
        {renderActionString()}
        {renderTitle()}
      </span>
    );
  };

  return (
    <div className={css(styles.root, isHidden && styles.hidden)}>
      <AuthorAvatar {...authorAvatarProps} />
      <ClampedText lines={2} textStyles={styles.textContainer}>
        {renderHeader()}
      </ClampedText>
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

export default ActivityUserLine;
