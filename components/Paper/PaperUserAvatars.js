import React from "react";
import { StyleSheet, css } from "aphrodite";

import AuthorAvatar from "~/components/AuthorAvatar";

import { getUsersFromPaper } from "~/config/utils";

const PaperUserAvatars = ({ paper, users = [] }) => {
  // if users is not provided, we find users from paper object
  const paperContributers = paper ? getUsersFromPaper(papers) : users;

  const renderUserAvatars = () => {
    return paperContributers.map((user, index) => {
      const classNames = [styles.root];

      if (!user.profile_image) {
        // default avatar image need padding for alignment
        classNames.push(index === 0 ? styles.default : styles.hidden);
      }

      const avatarStyle = {};

      if (index > 0) {
        // style used to have overlapping UI
        avatarStyle.marginLeft = -8;
      }

      return (
        <div className={css(classNames)} key={index}>
          <div style={avatarStyle}>
            <AuthorAvatar author={user} size={28} border="2px solid #F1F1F1" />
          </div>
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
  default: {
    paddingBottom: 5,
  },
  hidden: {
    display: "none",
  },
});

export default PaperUserAvatars;
