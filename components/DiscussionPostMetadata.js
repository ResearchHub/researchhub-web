import { Fragment, useState, useEffect } from "react";
import { useStore, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import Ripples from "react-ripples";
import { useAlert } from "react-alert";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import { ClientLinkWrapper } from "~/components/LinkWrapper";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";

//Redux
import { MessageActions } from "~/redux/message";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { timeAgo } from "~/config/utils";
import { API } from "@quantfive/js-web-config/api";

const DYNAMIC_HREF = "/paper/[paperId]/[tabName]/[discussionThreadId]";

const DiscussionPostMetadata = (props) => {
  const {
    username,
    date,
    authorProfile,
    onHideClick,
    threadPath,
    metaData,
    onRemove,
  } = props;
  const alert = useAlert();
  const store = useStore();
  const dispatch = useDispatch();
  const [showDropDown, setDropDown] = useState(false);
  const [isFlagged, setFlagged] = useState(metaData.userFlag);
  let dropdown;
  let ellipsis;
  let isModerator = store.getState().auth.user.moderator;

  const handleOutsideClick = (e) => {
    if (ellipsis && ellipsis.contains(e.target)) {
      return;
    }
    if (dropdown && !dropdown.contains(e.target)) {
      e.stopPropagation();
      setDropDown(false);
    }
  };

  const toggleDropDown = (e) => {
    e && e.stopPropagation();
    setDropDown(!showDropDown);
  };

  const promptFlagConfirmation = () => {
    console.log("called");
    return alert.show({
      text: "Are you sure you want to flag this post?",
      buttonText: "Yes",
      onClick: () => {
        threadPath ? flagThread() : flagPost();
      },
    });
  };

  const flagThread = () => {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    let { paperId, threadId } = metaData;
    let config = flagged
      ? API.DELETE_CONFIG()
      : API.POST_CONFIG({ reason: censor });
    fetch(API.FLAG_THREAD({ paperId, threadId }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let message = flagged ? "Flag Removed " : "Post Successfully Flagged";
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage(message));
        dispatch(MessageActions.showMessage({ show: true }));
        setFlagged(!flagged);
      })
      .catch((err) => {
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage("Something went wrong"));
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      });
  };

  const flagPost = () => {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    let { paperId, threadId, commentId, replyId } = metaData;
    let config = flagged
      ? API.DELETE_CONFIG()
      : API.POST_CONFIG({ reason: censor });
    fetch(API.FLAG_THREAD({ paperId, threadId, commentId, replyId }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let message = flagged ? "Flag Removed " : "Post Successfully Flagged";
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage(message));
        dispatch(MessageActions.showMessage({ show: true }));
        setFlagged(!flagged);
      })
      .catch((err) => {
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage("Something went wrong"));
        dispatch(MessageActions.showMessage({ show: true, error: true }));
      });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  return (
    <div className={css(styles.container)}>
      <User name={username} authorProfile={authorProfile} {...props} />
      <Timestamp date={date} {...props} />
      {onHideClick && <HideButton {...props} />}
      <div className={css(styles.dropdownContainer)}>
        <div
          className={css(styles.dropdownIcon)}
          ref={(ref) => (ellipsis = ref)}
          onClick={toggleDropDown}
        >
          {icons.ellipsisH}
        </div>
        {showDropDown && (
          <div
            className={css(
              styles.dropdown,
              (threadPath || isModerator) && styles.twoItems,
              threadPath && isModerator && styles.threeItems
            )}
            ref={(ref) => (dropdown = ref)}
          >
            {threadPath && <ExpandButton {...props} />}
            <FlagButton
              {...props}
              onClick={promptFlagConfirmation}
              isFlagged={isFlagged}
            />
            {isModerator && (
              <ModeratorDeleteButton
                containerStyle={styles.dropdownItem}
                labelStyle={[styles.text, styles.removeText]}
                iconStyle={styles.expandIcon}
                label={"Remove"}
                actionType={"post"}
                metaData={metaData}
                onRemove={onRemove}
              />
            )}
          </div>
        )}
      </div>
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
    <Ripples className={css(styles.dropdownItem)}>
      <ClientLinkWrapper dynamicHref={DYNAMIC_HREF} path={threadPath}>
        <span className={css(styles.icon, styles.expandIcon)} id={"expandIcon"}>
          <i className="fal fa-expand-arrows" />
        </span>
        <span className={css(styles.text, styles.expandText)} id={"expandText"}>
          Expand
        </span>
      </ClientLinkWrapper>
    </Ripples>
  );
};

const FlagButton = (props) => {
  return (
    <Ripples className={css(styles.dropdownItem)} onClick={props.onClick}>
      <span className={css(styles.icon, styles.expandIcon)}>{icons.flag}</span>
      <span className={css(styles.text, styles.expandText)}>
        {props.isFlagged ? "Unflag" : "Flag"}
      </span>
    </Ripples>
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
    marginLeft: 14,
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
  dropdownItem: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
    padding: 8,
    width: "100%",
    color: colors.BLACK(),
    cursor: "pointer",
    userSelect: "none",
    borderBottom: "1px solid #F3F3F8",
    ":hover": {
      background: "#F3F3F8",
    },
    // ":hover #expandIcon": {
    //   color: colors.BLUE(),
    // },
    // ":hover #expandText": {
    //   color: colors.BLUE(),
    // },
  },
  expandIcon: {
    fontSize: 14,
    paddingLeft: 5,
  },
  expandText: {
    fontSize: 14,
    color: colors.BLACK(),
  },
  removeText: {
    fontSize: 14,
    color: colors.RED(),
  },
  dropdownContainer: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: 0,
  },
  dropdownIcon: {
    fontSize: 20,
    cursor: "pointer",
    color: colors.BLACK(),
    ":hover": {
      color: "#000",
    },
  },
  dropdown: {
    position: "absolute",
    bottom: -30,
    right: -4,
    width: 120,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 3,
  },
  twoItems: {
    bottom: -70,
  },
  threeItems: {
    bottom: -110,
  },
});

export default DiscussionPostMetadata;
