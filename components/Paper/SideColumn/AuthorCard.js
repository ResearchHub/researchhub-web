import React, { useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";
import Link from "next/link";

import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const AuthorCard = (props) => {
  const { name, author } = props;

  const { id, orcid_id } = author;

  if (id) {
    return (
      <Link href={"/user/[authorId]/[tabName]"} as={`/user/${id}/discussions`}>
        <a className={css(styles.container, styles.hover)}>
          {author.profile_image ? (
            <img src={author.profile_image} className={css(styles.userImage)} />
          ) : (
            <span className={css(styles.userIcon)}>{icons.user}</span>
          )}
          <div className={css(styles.name) + " clamp1"}>{name}</div>
        </a>
      </Link>
    );
  }

  if (orcid_id) {
    return (
      <a
        className={css(styles.container, styles.hover)}
        target="_blank"
        href={`https://orcid.org/${orcid_id}`}
        rel="noreferrer noopener"
      >
        <span className={css(styles.userIcon)}>{icons.user}</span>
        <div className={css(styles.name) + " clamp1"}>{name}</div>
      </a>
    );
  }

  return (
    <div className={css(styles.container)}>
      <span className={css(styles.userIcon)}>{icons.user}</span>
      <div className={css(styles.name) + " clamp1"}>{name}</div>
    </div>
  );
};

AuthorCard.propTypes = {
  name: PropTypes.string,
  author: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 15px 8px 12px",
    borderLeft: `3px solid #FFF`,
    transition: "all ease-out 0.1s",
  },
  hover: {
    textDecoration: "unset",
    width: "100%",
    ":hover": {
      cursor: "pointer",
      background: "#FAFAFA",
      borderLeft: `3px solid ${colors.NEW_BLUE()}`,
    },
  },
  name: {
    color: colors.BLACK(1),
    fontWeight: 500,
    marginLeft: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  userIcon: {
    color: "#aaa",
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    fontSize: 30 + 1,
    border: "3px solid transparent",
    "@media only screen and (max-width: 415px)": {
      width: 25,
      height: 25,
      fontSize: 25 + 1,
      minWidth: 25,
      minHeight: 25,
    },
  },
  userImage: {
    borderRadius: "50%",
    border: "1px solid #ededed",
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    fontSize: 30 + 1,
    objectFit: "contain",
    "@media only screen and (max-width: 415px)": {
      width: 25,
      height: 25,
      fontSize: 25 + 1,
      minWidth: 25,
      minHeight: 25,
    },
  },
});

export default AuthorCard;
