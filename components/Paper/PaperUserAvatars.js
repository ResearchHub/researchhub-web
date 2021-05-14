import React from "react";
import { StyleSheet, css } from "aphrodite";

import AuthorAvatar from "~/components/AuthorAvatar";

import { getUsersFromPaper } from "~/config/utils";

const PaperUserAvatars = ({ paper, users = [] }) => {
  // if users is not provided, we find users from paper object
  const paperContributers = paper ? getUsersFromPaper(papers) : users;

  const renderUserAvatars = () => {
    return paperContributers.map((user, index) => {
      const classNames = [styles.avatarContainer];

      if (!user.profile_image) {
        // default avatar image need padding for alignment
        classNames.push(styles.default);
      }

      const avatarStyle = {};

      if (index > 0) {
        // style used to have overlapping UI
        avatarStyle.position = "absolute";
        avatarStyle.left = -10 * index;
        avatarStyle.zIndex = index;
      }

      return (
        <div className={css(classNames)}>
          <span style={avatarStyle}>
            <AuthorAvatar author={user} size={25} />
          </span>
        </div>
      );
    });
  };

  return <div className={css(styles.root)}>{renderUserAvatars()}</div>;
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  default: {
    paddingBottom: 5,
  },
});

export default PaperUserAvatars;
