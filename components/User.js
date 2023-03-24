import { css, StyleSheet } from "aphrodite";

import AuthorAvatar from "./AuthorAvatar";

import colors from "~/config/themes/colors";

export const User = (props) => {
  const { name, authorProfile } = props;
  return (
    <div className={css(styles.userContainer)}>
      <AuthorAvatar author={authorProfile} name={name} disableLink={false} />
      <div className={css(styles.name)}>{name}</div>
    </div>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
    alignItems: "center",
    "@media only screen and (max-width: 436px)": {
      fontSize: 14,
    },
  },
  name: {
    marginLeft: 8,
    color: colors.BLACK(1),
  },
});
