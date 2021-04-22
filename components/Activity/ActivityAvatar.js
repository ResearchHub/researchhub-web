import React from "react";
import { useRouter } from "next/router";
import { StyleSheet, css } from "aphrodite";

// Components
import AuthorAvatar from "../AuthorAvatar";

const ActivityAvatar = (props) => {
  const router = useRouter();

  const { contributionType } = props;

  const getIconSrc = () => {
    const iconName = contributionType.toLowerCase();
    return `/static/icons/activityFeed/${iconName}.png`;
  };

  const routeToAuthorPage = (e) => {
    e && e.stopPropagation();

    return router.push(
      "/user/[authorId]/[tabName]",
      `/user/${authorId}/contributions`
    );
  };

  return (
    <div className={css(styles.root)} onClick={routeToAuthorPage}>
      <AuthorAvatar {...props} disableLink={true} />
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
