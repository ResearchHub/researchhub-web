import React, { Fragment } from "react";

// NPM Modules
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Router from "next/router";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";

// Component
import AuthorAvatar from "../AuthorAvatar";

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
      hideCard: false,
    };
  }

  formatUsername = (userObject) => {
    let { first_name, last_name } = userObject;
    return `${first_name} ${last_name}`;
  };

  handleClickNavigation = () => {
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
    let paperTip = notification.paper_title;
    let paperId = notification.paper_id;
    let threadTip = notification.thread_title;
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
            edited a<span>summary </span>
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

  renderIcon = () => {
    const { notification } = this.props;
    const notificationType = notification.content_type;

    switch (notificationType) {
      case "summary":
      case "vote_paper":
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

  render() {
    let { notification } = this.props;

    if (this.state.hideCard) {
      return null;
    } else {
      return (
        <Ripples
          className={css(styles.column, styles.notification)}
          onClick={this.handleClickNavigation}
        >
          <ReactTooltip
            place={"bottom"}
            delayShow={400}
            className={css(styles.tool)}
          />
          <div className={css(styles.type)}>{this.renderIcon()}</div>
          <Ripples className={css(styles.dropdown)}>{icons.ellipsisH}</Ripples>
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
        </Ripples>
      );
    }
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
    width: "80%",
    padding: "25px 10px 20px 10px",
    backgroundColor: "#FFF",
    border: "1px solid rgb(237, 237, 237)",
    borderRadius: 5,
    cursor: "pointer",
    position: "relative",
    marginBottom: 15,
    ":hover": {
      borderColor: "#AAAAAA",
    },
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
  dropdown: {
    position: "absolute",
    top: 5,
    right: 10,
  },
  tool: {
    zIndex: 999,
    opacity: 0.4,
    maxWidth: 250,
  },
});

export default LiveFeedNotification;
