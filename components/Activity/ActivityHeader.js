import { StyleSheet, css } from "aphrodite";

// import AuthorAvatar from "../AuthorAvatar";
import ActivityAvatar from "./ActivityAvatar";
import ActivityDescription from "./ActivityDescription";

import colors from "~/config/themes/colors";
import { getAuthorName } from "~/config/utils/misc";

const ActivityHeader = ({ activity, user }) => {
  const { contribution_type: contributionType } = activity;
  const author = user["author_profile"];
  const username = getAuthorName(author);

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
