import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";

import colors from "~/config/themes/colors";
import { timeAgo } from "~/config/utils";

const DiscussionPostMetadata = (props) => {
  const { username, date, authorProfile } = props;
  return (
    <div className={css(styles.container)}>
      <User name={username} authorProfile={authorProfile} />
      <Timestamp date={date} />
    </div>
  );
};

DiscussionPostMetadata.propTypes = {
  username: PropTypes.string,
  date: PropTypes.any,
  authorProfile: PropTypes.object,
};

const User = (props) => {
  const { image, name, authorProfile } = props;
  return (
    <div className={css(styles.userContainer)}>
      <AuthorAvatar author={authorProfile} name={name} disableLink={false} />
      <div className={css(styles.name)}>{name}</div>
    </div>
  );
};

const Timestamp = (props) => {
  const timestamp = formatTimestamp(props.date);
  return (
    <div className={css(styles.timestampContainer)}>
      <span className={css(styles.timestampDivider)}>•</span>
      {timestamp}
    </div>
  );
};

function formatTimestamp(date) {
  date = new Date(date);
  return timeAgo.format(date);
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
    alignItems: "center",
  },
  timestampContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontWeight: "normal",
    color: "#918f9b",
    fontSize: 14,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  name: {
    marginLeft: 8,
    color: colors.BLACK(1),
  },
  timestampDivider: {
    fontSize: 18,
    padding: "0px 10px",
    color: colors.GREY(1),
  },
});

export default DiscussionPostMetadata;
