// NPM Modules
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Component
import AuthorAvatar from "~/components/AuthorAvatar";

// Redux
import { AuthActions } from "~/redux/auth";
import { ModalActions } from "~/redux/modals";
import { MessageActions } from "~/redux/message";

import colors from "~/config/themes/colors";

const SupporterCard = (props) => {
  const { supporter, index, count } = props;
  const [username, setUsername] = useState();

  useEffect(() => {
    setUsername(formatUsername() || null);
  });

  function formatUsername() {
    if (supporter) {
      const { first_name, last_name } = supporter.author_profile;

      return `${first_name} ${last_name}`;
    }
  }

  function renderUserAvatar() {
    return (
      <AuthorAvatar
        author={supporter.author_profile}
        name={username}
        disableLink={false}
        size={35}
      />
    );
  }

  function renderUsername() {
    return <div className={css(styles.name)}>{username}</div>;
  }

  return (
    <Link
      href={"/user/[authorId]/[tabName]"}
      as={`/user/${supporter.author_profile.id}/overview`}
    >
      <a
        className={css(styles.root, count === 1 && styles.solo)}
        href={`/user/${supporter.author_profile.id}/overview`}
      >
        {renderUserAvatar()}
        {renderUsername()}
      </a>
    </Link>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    borderBottom: `1px solid ${colors.BLACK(0.08)}`,
    padding: "10px 15px",
    boxSizing: "border-box",
    cursor: "pointer",
    textDecoration: "unset",
    ":hover": {
      background: "#FAFAFA",
    },
  },
  solo: {
    borderTop: `1px solid ${colors.BLACK(0.08)}`,
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.BLACK(),
    marginLeft: 15,
  },
});

export default SupporterCard;
