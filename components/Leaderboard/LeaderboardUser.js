import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import ReactPlaceholder from "react-placeholder/lib";
import AuthorAvatar from "../AuthorAvatar";

const LeaderboardUser = (props) => {
  const { name, authorProfile, reputation } = props;
  return (
    <div className={css(styles.container)}>
      <div>
        <div className={css(styles.nameRow)}>
          <AuthorAvatar
            author={authorProfile}
            name={name}
            disableLink={false}
          />
          <div className={css(styles.name)}>{name}</div>
          <div className={css(styles.rep)}>{reputation}</div>
        </div>
      </div>
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
