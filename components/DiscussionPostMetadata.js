import { Fragment } from "react";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import { ClientLinkWrapper } from "~/components/LinkWrapper";

import colors from "~/config/themes/colors";
import { timeAgo } from "~/config/utils";

const DYNAMIC_HREF = "/paper/[paperId]/[tabName]/[discussionThreadId]";

const DiscussionPostMetadata = (props) => {
  const { username, date, authorProfile, onHideClick, threadPath } = props;
  return (
    <div className={css(styles.container)}>
      <User name={username} authorProfile={authorProfile} {...props} />
      <Timestamp date={date} {...props} />
      {onHideClick && <HideButton {...props} />}
      {threadPath && <ExpandButton {...props} />}
    </div>
  );
};

DiscussionPostMetadata.propTypes = {
  username: PropTypes.string,
  date: PropTypes.any,
  authorProfile: PropTypes.object,
};

const User = (props) => {
  const { name, authorProfile, smaller } = props;
  return (
    <div
      className={css(
        styles.userContainer,
        smaller && styles.smallerUserContainer
      )}
    >
      <AuthorAvatar
        author={authorProfile}
        name={name}
        disableLink={false}
        size={smaller && 25}
      />
      <div className={css(styles.name)}>{name}</div>
    </div>
  );
};

const Timestamp = (props) => {
  const timestamp = formatTimestamp(props.date);
  return (
    <div
      className={css(
        styles.timestampContainer,
        props.smaller && styles.smallerTimestamp
      )}
    >
      <span className={css(styles.timestampDivider)}>•</span>
      {timestamp}
    </div>
  );
};

function formatTimestamp(date) {
  date = new Date(date);
  return timeAgo.format(date);
}

const HideButton = (props) => {
  let { onHideClick, hideState } = props;

  let classNames = [styles.hideContainer];

  return (
    <Fragment>
      <span className={css(styles.timestampDivider)}>•</span>
      <div className={css(classNames)} onClick={onHideClick}>
        <span
          className={css(styles.icon, hideState && styles.active)}
          id={"hideIcon"}
        >
          {hideState ? (
            <i className="fad fa-eye-slash" />
          ) : (
            <i className="fad fa-eye" />
          )}
        </span>
        <span className={css(styles.text)} id={"hideText"}>
          {hideState ? "Show" : "Hide"}
        </span>
      </div>
    </Fragment>
  );
};

const ExpandButton = (props) => {
  let { threadPath } = props;
  return (
    <div className={css(styles.expandButtonWrapper)}>
      {/* <span className={css(styles.timestampDivider)}>•</span> */}
      <div className={css(styles.expandContainer)}>
        <ClientLinkWrapper dynamicHref={DYNAMIC_HREF} path={threadPath}>
          <span
            className={css(styles.icon, styles.expandIcon)}
            id={"expandIcon"}
          >
            <i className="fal fa-expand-arrows" />
          </span>
          <span
            className={css(styles.text, styles.expandText)}
            id={"expandText"}
          >
            Expand
          </span>
        </ClientLinkWrapper>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
    alignItems: "center",
    "@media only screen and (max-width: 436px)": {
      fontSize: 14,
    },
  },
  smallerUserContainer: {
    fontSize: 12,
  },
  timestampContainer: {
    display: "flex",
    alignItems: "center",
    fontWeight: "normal",
    color: "#918f9b",
    fontSize: 14,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  smallerTimestamp: {
    fontSize: 12,
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
  hideContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 5,
    cursor: "pointer",
    ":hover #hideIcon": {
      color: colors.BLUE(),
    },
    ":hover #hideText": {
      color: colors.BLUE(),
    },
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 12,
    marginLeft: 8,
    color: "#918f9b",
  },
  icon: {
    color: "#918f9b",
    fontSize: 13,
  },
  active: {
    color: "#000",
  },
  expandButtonWrapper: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  expandContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderRadius: 5,
    color: colors.BLACK(),
    cursor: "pointer",
    ":hover #expandIcon": {
      color: colors.BLUE(),
    },
    ":hover #expandText": {
      color: colors.BLUE(),
    },
  },
  expandIcon: {
    fontSize: 14,
  },
  expandText: {
    fontSize: 14,
  },
});

export default DiscussionPostMetadata;
