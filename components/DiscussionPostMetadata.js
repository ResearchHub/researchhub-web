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
import ShareAction from "~/components/ShareAction";

//Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { timeAgo } from "~/config/utils";
import API from "~/config/api";
import { Helpers } from "~/config/helpers";

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
    dropDownEnabled,
    toggleEdit,
    twitter,
    twitterUrl,
  } = props;
  const alert = useAlert();
  const store = useStore();
  const dispatch = useDispatch();
  const [showDropDown, setDropDown] = useState(false);
  const [isFlagged, setFlagged] = useState(
    metaData && metaData.userFlag !== undefined && metaData.userFlag !== null
  );
  let dropdown;
  let ellipsis;
  let isModerator = store.getState().auth.user.moderator;
  let isLoggedIn = store.getState().auth.isLoggedIn;

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
    if (!isLoggedIn) {
      dispatch(
        ModalActions.openLoginModal(true, "Please sign in Google to continue.")
      );
    } else {
      return alert.show({
        text:
          "Are you sure you want to " +
          (isFlagged ? "unflag" : "flag") +
          " this post?",
        buttonText: "Yes",
        onClick: () => {
          flagPost();
        },
      });
    }
  };

  const flagPost = async () => {
    dispatch(MessageActions.showMessage({ load: true, show: true }));
    let { paperId, threadId, commentId, replyId } = metaData;
    let config = isFlagged
      ? API.DELETE_CONFIG()
      : await API.POST_CONFIG({ reason: "censor" });
    fetch(API.FLAG_POST({ paperId, threadId, commentId, replyId }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let message = isFlagged ? "Flag Removed " : "Post Successfully Flagged";
        dispatch(MessageActions.showMessage({ show: false }));
        dispatch(MessageActions.setMessage(message));
        dispatch(MessageActions.showMessage({ show: true }));
        setFlagged(!isFlagged);
      })
      .catch((err) => {
        if (err.response.status === 429) {
          dispatch(MessageActions.showMessage({ show: false }));
          return dispatch(ModalActions.openRecaptchaPrompt(true));
        }
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

  const renderShareButton = () => {
    const { hostname, threadPath, title, small } = props;
    const shareUrl = hostname + threadPath;

    const ShareButton = (props) => {
      return (
        <div className={css(styles.dropdownItem)} onClick={(e) => e.persist()}>
          <span
            className={css(styles.icon, styles.expandIcon, styles.shareIcon)}
          >
            <i className="fad fa-share-square" />
          </span>
          <span className={css(styles.text, styles.expandText)}>Share</span>
        </div>
      );
    };

    return (
      <ShareAction
        customButton={<ShareButton />}
        title={"Share this discussion"}
        subtitle={title}
        url={shareUrl}
      />
    );
  };

  return (
    <div className={css(styles.container)}>
      <User name={username} authorProfile={authorProfile} {...props} />
      <Timestamp date={date} {...props} />
      {onHideClick && <HideButton {...props} />}
      {dropDownEnabled && (
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
              className={css(styles.dropdown)}
              ref={(ref) => (dropdown = ref)}
            >
              {threadPath && <ExpandButton {...props} />}
              {threadPath && renderShareButton()}
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
      )}
    </div>
  );
};

DiscussionPostMetadata.propTypes = {
  username: PropTypes.string,
  date: PropTypes.any,
  authorProfile: PropTypes.object,
};

function openTwitter(url) {
  window.open(url, "_blank");
}

const User = (props) => {
  const { name, authorProfile, smaller, twitterUrl } = props;
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
        twitterUrl={twitterUrl}
      />
      <div className={css(styles.name)}>{name}</div>
    </div>
  );
};

const Timestamp = (props) => {
  const timestamp = formatTimestamp(props.date);

  if (props.twitter && props.twitterUrl) {
    return (
      <div
        className={css(
          styles.timestampContainer,
          props.smaller && styles.smallerTimestamp,
          props.twitter && styles.twitterUrl
        )}
      >
        <a
          target="_blank"
          href={props.twitterUrl}
          className={css(styles.twitterTag)}
        >
          <span className={css(styles.timestampDivider)}>•</span>
          {timestamp} from Twitter
          <div className={css(styles.twitterIcon)}>
            <i className="fab fa-twitter" />
          </div>
        </a>
      </div>
    );
  }

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
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 10,
    },
  },
  smallerTimestamp: {
    fontSize: 12,
  },
  twitterTag: {
    color: "unset",
    textDecoration: "unset",
    display: "flex",
    alignItems: "center",
  },
  name: {
    marginLeft: 8,
    color: colors.BLACK(1),
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  timestampDivider: {
    fontSize: 18,
    padding: "0px 10px",
    color: colors.GREY(1),
    "@media only screen and (max-width: 767px)": {
      padding: "0px 8px",
    },
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
    "@media only screen and (max-width: 415px)": {
      marginLeft: 5,
      fontSize: 9,
    },
  },
  icon: {
    color: "#918f9b",
    fontSize: 13,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 9,
    },
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
  },
  expandIcon: {
    fontSize: 14,
    paddingLeft: 8,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
      marginRight: 5,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 9,
      marginRight: 5,
    },
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
    "@media only screen and (max-width: 415px)": {
      fontSize: 16,
    },
  },
  dropdown: {
    position: "absolute",
    top: 20,
    right: -4,
    width: 120,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 3,
    "@media only screen and (max-width: 415px)": {
      width: 80,
    },
  },
  shareIcon: {
    marginRight: -3,
  },
  twitterIcon: {
    marginLeft: 8,
    color: "#00ACEE",
  },
  twitterUrl: {
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
});

export default DiscussionPostMetadata;
