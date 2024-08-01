import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import AuthorAvatar from "../AuthorAvatar";
import Link from "next/link";
import numeral from "numeral";

const LeaderboardUser = (props) => {
  const {
    name,
    authorProfile,
    reputation,
    authorId,
    userClass,
    repClass,
    timeRepClass,
    timeReputation,
  } = props;

  return (
    <div className={css(styles.container)}>
      <Link
        href={"/user/[authorId]/[tabName]"}
        as={`/user/${authorId}/overview`}
        className={css(styles.link)}
      >
        <div className={css(styles.nameRow, userClass)}>
          <AuthorAvatar
            author={authorProfile}
            name={name}
            disableLink={true}
            size={35}
          />
          <div className={css(styles.name) + " clamp1"}>{name}</div>
          {props.extraInfo}
          {reputation ? (
            <div className={css(styles.rep, repClass)}>
              {numeral(reputation).format("0,0")}
            </div>
          ) : null}
        </div>
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
  container: {
    width: "100%",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    width: "100%",
  },
  link: {
    width: "100%",
    color: colors.BLACK(1),
    textDecoration: "none",
  },
  name: {
    marginLeft: 6,
    fontWeight: 500,
  },
  rep: {
    marginLeft: "auto",
    fontWeight: 500,
  },
});

export default LeaderboardUser;
