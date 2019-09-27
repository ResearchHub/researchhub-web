import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import Avatar from "react-avatar";

import colors from "~/config/themes/colors";
import { timeAgo } from "~/config/utils";

const DiscussionPostMetadata = (props) => {
  const { username, date } = props;
  return (
    <div className={css(styles.container)}>
      <User name={username} />
      <Timestamp date={date} />
    </div>
  );
};

DiscussionPostMetadata.propTypes = {
  username: PropTypes.string,
  date: PropTypes.object,
};

const User = (props) => {
  const { image, name } = props;

  return (
    <div className={css(styles.userContainer)}>
      <img src={image} />
      <Avatar name={name} size={30} round={true} textSizeRatio="1" />
      <div>{name}</div>
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
  return timeAgo.format(Date.now() - date);
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
  },
  timestampContainer: {
    width: "100%",
    color: colors.GREY(1),
    fontWeight: "normal",
  },
  timestampDivider: {
    padding: "0px 10px",
  },
});

export default DiscussionPostMetadata;
