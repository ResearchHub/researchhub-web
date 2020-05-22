import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorAvatar from "../AuthorAvatar";
import Link from "next/link";

const LeaderboardUser = (props) => {
  const { name, authorProfile, reputation, authorId, userClass } = props;
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
            />
            <div className={css(styles.name)}>{name}</div>
            {props.extraInfo}
            <div className={css(styles.rep)}>{reputation}</div>
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
  },
  link: {
    color: colors.BLACK(1),
    textDecoration: "none",
  },
  name: {
    marginLeft: 16,
    fontWeight: 500,
  },
  rep: {
    marginLeft: "auto",
    color: colors.PURPLE(1),
  },
});

export default LeaderboardUser;
