import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Link from "next/link";

import AuthorAvatar from "../AuthorAvatar";
import { ClampedText } from "~/components/Typography";

import colors from "~/config/themes/colors";
import { getAuthorName } from "~/config/utils/";

const ActivityUserLine = ({ activity }) => {
  const { comment, paper } = activity;
  const { created_by: author } = comment;
  const { paper_title: title } = paper;
  const { id: authorId } = author;

  const username = getAuthorName(author);

  const authorAvatarProps = {
    size: 30,
    author: author,
    name: username,
  };

  const renderUserPaperLine = () => {
    return (
      <span onClick={(e) => e.stopPropagation()}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${authorId}/contributions`}
        >
          <a className={css(styles.link)}>
            <span className={css(styles.text)}>{username}</span>
          </a>
        </Link>
        {" on "}
        <span className={css(styles.text)}>{title}</span>
      </span>
    );
  };

  return (
    <div className={css(styles.root)}>
      <AuthorAvatar {...authorAvatarProps} />
      <ClampedText lines={2} textStyles={styles.textContainer}>
        {renderUserPaperLine()}
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
});

export default ActivityUserLine;
