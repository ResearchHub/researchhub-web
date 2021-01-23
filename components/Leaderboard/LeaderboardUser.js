import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorAvatar from "../AuthorAvatar";
import Link from "next/link";

const LeaderboardUser = (props) => {
  const {
    name,
    authorProfile,
    reputation,
    authorId,
    userClass,
    repClass,
  } = props;
  return (
    <div className={css(styles.container)}>
      <Link
        href={"/user/[authorId]/[tabName]"}
        as={`/user/${authorId}/contributions`}
      >
        <a className={css(styles.link)}>
          <div className={css(styles.nameRow, userClass)}>
            <AuthorAvatar
              author={authorProfile}
              name={name}
              disableLink={false}
              size={35}
            />
            <div className={css(styles.name) + " clamp1"}>{name}</div>
            {props.extraInfo}
            <div className={css(styles.rep, repClass)}>{reputation}</div>
          </div>
        </a>
      </Link>
    </div>
  );
};

LeaderboardUser.propTypes = {
  name: PropTypes.string,
  authorProfile: PropTypes.object,
  reputation: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {},
  nameRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
  },
  link: {
    color: colors.BLACK(1),
    textDecoration: "none",
  },
  name: {
    marginLeft: 6,
    fontWeight: 500,
  },
  rep: {
    marginLeft: "auto",
    // color: colors.PURPLE(1),
    fontWeight: 500,
  },
});

export default LeaderboardUser;
