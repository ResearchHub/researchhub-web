import React, { Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Router from "next/router";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";
import { withAlert } from "react-alert";

// Component
import AuthorAvatar from "../AuthorAvatar";
import ModeratorDeleteButton from "../Moderator/ModeratorDeleteButton";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { timeAgo } from "~/config/utils";

class LiveFeedNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // hideCard: false,
      showDropdown: false,
      showPreview: false,
      userFlag: false,
      isRemoved: false,
    };
    this.dropdownIcon;
    this.dropdownMenu;
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
    this.setState({
      userFlag: this.props.notification.user_flag ? true : false,
      isRemoved: this.props.notification.is_removed,
    });
  }

  componentWillUnmount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
  }

  handleOutsideClick = (e) => {
    if (this.dropdownIcon && this.dropdownIcon.contains(e.target)) {
      return;
    }
    if (this.dropdownMenu && !this.dropdownMenu.contains(e.target)) {
      e.stopPropagation();
      this.setState({ showDropdown: false });
    }
  };

  formatUsername = (userObject) => {
    let { first_name, last_name } = userObject;
    return `${first_name} ${last_name}`;
  };

  handleClickNavigation = (e) => {
    e && e.stopPropagation();
    let { notification } = this.props;
    let { content_type, paper_id, thread_id } = notification;
    let type = content_type;
    let paperId = paper_id;
    let threadId = thread_id;
    let href;
    let route;

    if (type === "paper" || type === "summary") {
      href = "/paper/[paperId]/[tabName]";
      route = `/paper/${paperId}/summary`;
    } else if (type === "thread" || type === "comment" || type === "reply") {
      href = "/paper/[paperId]/[tabName]/[discussionThreadId]";
      route = `/paper/${paperId}/discussion/${threadId}`;
    }

    return href && route && Router.push(href, route);
  };

  renderNotification = () => {
    const { notification } = this.props;
    let { created_date, created_by, content_type } = notification;
    let notificationType = content_type;
    const timestamp = this.formatTimestamp(created_date);
    const username = this.formatUsername(created_by);
    const authorId = created_by.author_profile.id;
    let paperTip = notification.paper_title
      ? notification.paper_title
      : notification.paper_official_title;
    let paperId = notification.paper_id;
    let threadTip = notification.thread_title
      ? notification.thread_title
      : notification.thread_plain_text;
    let threadId = notification.thread_id;

    switch (notificationType) {
      case "summary":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            edited a <span>summary </span>
            for{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTip}
                onClick={(e) => e.stopPropagation()}
              >
                {paperTip && this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "paper":
        var paperTitle = notification.paper_title
          ? notification.paper_title
          : notification.paper_official_title;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            uploaded a new paper{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTitle}
                onClick={(e) => e.stopPropagation()}
              >
                {paperTitle && this.truncatePaperTitle(paperTitle)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "thread":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            created a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a
                className={css(styles.link)}
                onClick={(e) => e.stopPropagation()}
              >
                thread
              </a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTip}
                onClick={(e) => e.stopPropagation()}
              >
                {paperTip && this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "comment":
        console.log("notification-comment", notification);
        var commentTip = notification.tip;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            left a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a
                className={css(styles.link)}
                data-tip={commentTip}
                onClick={(e) => e.stopPropagation()}
              >
                comment
              </a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/discussion`}
            >
              <a
                className={css(styles.paper)}
                data-tip={threadTip}
                onClick={(e) => e.stopPropagation()}
              >
                {threadTip && this.truncatePaperTitle(threadTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "reply":
        var replyTip = notification.tip;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            left a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a
                className={css(styles.link)}
                data-tip={replyTip}
                onClick={(e) => e.stopPropagation()}
              >
                reply
              </a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/discussion`}
            >
              <a
                className={css(styles.paper)}
                data-tip={threadTip}
                onClick={(e) => e.stopPropagation()}
              >
                {threadTip && this.truncatePaperTitle(threadTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      default:
        return;
    }
  };

  deprecatedCases = () => {
    switch (type) {
      case "vote_paper":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            voted on{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTip}
                onClick={(e) => e.stopPropagation()}
              >
                {paperTip && this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_thread":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a
                className={css(styles.link)}
                onClick={(e) => e.stopPropagation()}
              >
                thread
              </a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTip}
                onClick={(e) => e.stopPropagation()}
              >
                {paperTip && this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_comment":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a
                className={css(styles.link)}
                onClick={(e) => e.stopPropagation()}
              >
                comment
              </a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTip}
                onClick={(e) => e.stopPropagation()}
              >
                {this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_reply":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a
                className={css(styles.link)}
                onClick={(e) => e.stopPropagation()}
              >
                reply
              </a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                className={css(styles.paper)}
                data-tip={paperTip}
                onClick={(e) => e.stopPropagation()}
              >
                {paperTip && this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
    }
  };

  truncatePaperTitle = (title) => {
    if (title && title.length >= 90) {
      return title.slice(0, 90) + "...";
    }
    return title;
  };

  toggleDropdown = (e) => {
    e && e.stopPropagation();
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  };

  togglePreview = (e) => {
    e && e.stopPropagation();

    // when on, show the full preview of the summary, thread, comment, and or reply

    // upon close, hide the preview
    this.setState({
      showPreview: !this.state.showPreview,
    });
  };

  promptFlagConfirmation = (e) => {
    e && e.stopPropagation();
    let { alert, auth, openLoginModal } = this.props;
    let { userFlag } = this.state;
    let isLoggedIn = auth.isLoggedIn;

    if (!isLoggedIn) {
      openLoginModal(true, "Please login with Google to continue.");
    } else {
      return alert.show({
        text: `Are you sure you want to ${
          userFlag ? "unflag" : "flag"
        } this post?`,
        buttonText: "Yes",
        onClick: () => {
          this.flagContent();
        },
      });
    }
  };

  flagContent = async () => {
    let { showMessage, setMessage } = this.props;
    showMessage({ load: true, show: true });
    let metaData = this.formatMetaData();
    let { paperId, threadId, commentId, replyId } = metaData;
    let config = this.state.userFlag
      ? API.DELETE_CONFIG()
      : await API.POST_CONFIG({ reason: "censor" });
    fetch(API.FLAG_POST({ paperId, threadId, commentId, replyId }), config)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        let message = this.state.userFlag
          ? "Flag Removed "
          : "Post Successfully Flagged";
        showMessage({ show: false });
        setMessage(message);
        showMessage({ show: true });
        this.setState({ userFlag: !this.state.userFlag });
      })
      .catch((err) => {
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
      });
  };

  formatMetaData = () => {
    let { notification } = this.props;
    let contentType = notification.content_type;
    let metaData = {};

    metaData.paperId = notification.paper_id;

    if (
      contentType === "thread" ||
      contentType == "comment" ||
      contentType === "reply"
    ) {
      metaData.threadId = notification.thread_id;
    }
    if (contentType === "comment" || contentType === "reply") {
      metaData.commentId = notification.comment_id;
    }
    if (contentType === "reply") {
      metaData.replyId = notification.reply_id;
    }

    return metaData;
  };

  hideCard = (e) => {
    e && e.stopPropagation();
    this.setState({ hideCard: true });
  };

  convertDate = () => {
    return formatPublishedDate(transformDate(paper.paper_publish_date));
  };

  formatTimestamp = (date) => {
    date = new Date(date);
    return timeAgo.format(date);
  };

  removeContent = () => {
    this.setState({ isRemoved: true });
  };

  renderIcon = () => {
    const { notification } = this.props;
    const notificationType = notification.content_type;

    switch (notificationType) {
      case "summary":
      case "vote_paper":
      case "paper":
        return icons.file;
      case "vote_comment":
      case "comment":
        return <i className="fad fa-comment-alt-dots" />;
      case "reply":
      case "vote_reply":
        return <i className="fad fa-comment-alt-dots" />;
      case "thread":
      case "vote_thread":
        return <i className="fad fa-comment-alt-lines" />;
    }
  };

  renderDropDown = () => {
    let { showDropdown, userFlag } = this.state;
    let { moderator } = this.props.auth.user;
    // moderator = false;
    function correctContent(contentType, isModerator) {
      if (contentType === "summary") {
        return false;
      }
      return true && isModerator;
    }

    let metaData = this.formatMetaData();

    return (
      <Fragment>
        {showDropdown && (
          <div
            className={css(
              styles.dropdownMenu,
              correctContent(this.props.notification.content_type, moderator) &&
                styles.twoItems
            )}
            ref={(ref) => (this.dropdownMenu = ref)}
          >
            <Ripples
              className={css(styles.dropdownItem)}
              onClick={this.promptFlagConfirmation}
            >
              <span className={css(styles.dropdownItemIcon)}>{icons.flag}</span>
              {userFlag ? "Unflag" : "Flag"}
            </Ripples>
            {correctContent(
              this.props.notification.content_type,
              moderator
            ) && (
              <ModeratorDeleteButton
                containerStyle={styles.dropdownItem}
                labelStyle={[styles.text, styles.removeText]}
                iconStyle={styles.expandIcon}
                label={"Remove"}
                actionType={"post"}
                metaData={metaData}
                onRemove={this.removeContent}
              />
            )}
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    let { notification } = this.props;
    let { isRemoved } = this.state;

    return (
      <div
        className={css(
          styles.column,
          styles.notification,
          isRemoved && styles.isRemoved
        )}
        onClick={this.handleClickNavigation}
      >
        {isRemoved && (
          <div className={css(styles.removedText)}>
            Content Removed By Moderator
          </div>
        )}
        <ReactTooltip
          place={"bottom"}
          delayShow={400}
          className={css(styles.tool)}
        />
        <div className={css(styles.type)}>{this.renderIcon()}</div>
        {this.props.notification.content_type !== "summary" && (
          <Ripples
            className={css(styles.dropdownIcon)}
            onClick={this.toggleDropdown}
          >
            <span ref={(ref) => (this.dropdownIcon = ref)}>
              {icons.ellipsisH}
            </span>
          </Ripples>
        )}
        {this.renderDropDown()}
        <div className={css(styles.row, styles.container)}>
          <div
            className={css(styles.column, styles.left)}
            onClick={(e) => e.stopPropagation()}
          >
            <AuthorAvatar
              author={
                notification.created_by &&
                notification.created_by.author_profile
              }
              size={35}
            />
          </div>
          <div className={css(styles.column, styles.right)}>
            {this.renderNotification()}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tooltip: {
    zIndex: 1000,
  },
  notification: {
    display: "inline-block",
    // maxWidth: 600,
    boxSizing: "border-box",
    width: "100%",
    padding: "25px 10px 20px 10px",
    backgroundColor: "#FFF",
    border: "1px solid rgb(237, 237, 237)",
    borderRadius: 5,
    cursor: "pointer",
    position: "relative",
    marginBottom: 15,
    overflow: "visible",
    ":hover": {
      borderColor: "#AAAAAA",
    },
  },
  isRemoved: {
    pointerEvents: "none",
    userSelect: "none",
  },
  removedText: {
    height: "100%",
    width: "100%",
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(2px)",
    fontSize: 13,
    fontWeight: 500,
    background: "rgba(255, 255, 255, 0.5)",
  },
  left: {
    justifyContent: "center",
    marginRight: 10,
  },
  right: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    // justifyContent: 'space-between'
  },
  link: {
    color: colors.BLUE(),
    cursor: "pointer",
    textDecoration: "none",
    paddingRight: 4,
    ":hover": {
      textDecoration: "underline",
    },
  },
  paper: {
    cursor: "pointer",
    color: colors.BLUE(),
    cursor: "pointer",
    paddingRight: 4,
    textDecoration: "unset",
    wordBreak: "break-word",
    ":hover": {
      textDecoration: "underline",
    },
    maxWidth: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  message: {
    fontSize: 13,
    lineHeight: 1.5,
    width: "100%",
  },
  username: {
    color: "#000",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  timestamp: {
    fontWeight: "normal",
    color: "#918f9b",
    fontSize: 12,
    fontFamily: "Roboto",
    // "@media only screen and (max-width: 415px)": {
    //   fontSize: 12,
    // },
  },
  timestampDivider: {
    fontSize: 18,
    paddingRight: 4,
    color: colors.GREY(1),
    lineHeight: "100%",
    verticalAlign: "middle",
  },
  type: {
    fontSize: 13,
    // color: "#AAAAAA",
    color: colors.YELLOW(),
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  dropdownMenu: {
    position: "absolute",
    bottom: 20,
    right: 0,
    width: 120,
    boxShadow: "rgba(129,148,167,0.39) 0px 3px 10px 0px",
    boxSizing: "border-box",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    zIndex: 2,
  },
  twoItems: {
    bottom: -20,
  },
  dropdownIcon: {
    position: "absolute",
    top: 4,
    right: 5,
    padding: "1px 5px",
    borderRadius: 4,
    cursor: "pointer",
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
    width: "100%",
    fontSize: 14,
    ":hover": {
      background: "#F3F3F8",
    },
  },
  dropdownItemIcon: {
    color: "#918f9b",
    fontSize: 14,
    paddingLeft: 8,
    marginRight: 13,
  },

  tool: {
    zIndex: 999,
    opacity: 0.4,
    maxWidth: 250,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 12,
    marginLeft: 14,
    color: "#918f9b",
  },
  removeText: {
    fontSize: 14,
    color: colors.RED(),
  },
  expandIcon: {
    fontSize: 14,
    paddingLeft: 5,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  openLoginModal: ModalActions.openLoginModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(LiveFeedNotification));
