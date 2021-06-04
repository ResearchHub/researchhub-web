import { css, StyleSheet } from "aphrodite";
import React, { useState } from "react";
import colors from "../../../config/themes/colors";

export default function UserPostCard(props) {
  console.warn("CARDPROPS: ", props);
  const {
    created_by: {
      author_profile: { profile_image: creatorImg, first_name, last_name },
    },
    title,
  } = props;
  const creatorName = first_name + " " + last_name;
  return (
    <div className={css(styles.userPostCard)}>
      <div className={css(styles.postCreatedBy)}>
        <img className={css(styles.creatorImg)} src={creatorImg} />
        <span className={css(styles.creatorName)}>{creatorName}</span>
      </div>
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.postContent)}></div>
    </div>
  );
}

const styles = StyleSheet.create({
  userPostCard: {
    display: "flex",
    flexDirection: "column",
    width: "97%",
    padding: 16,
    ":hover": {
      backgroundColor: colors.GREY(0.1),
    },
  },
  postCreatedBy: {
    display: "flex",
    alignItems: "center",
    marginBottom: 16,
  },
  postContent: {},
  creatorImg: {
    borderRadius: "50%",
    height: 28,
    marginRight: 12,
    width: 28,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: 400,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "rgb(36, 31, 58)",
  },
});
