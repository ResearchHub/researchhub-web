import React, { Fragment } from "react";

// NPM Modules
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import ReactTooltip from "react-tooltip";

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

  renderNotification = () => {
    const { notification } = this.props;
    let { paper, created_date, created_by, content_type } = notification;
    let notificationType = content_type;
    const timestamp = this.formatTimestamp(created_date);
    const username = this.formatUsername(created_by);
    const authorId = created_by.author_profile.id;
    let paperTip = paper && paper.title;
    let paperId = paper && paper.id;

    switch (notificationType) {
      case "summary":
        paperTip = notification.paper_title;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            edited a summary for{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paper}/summary`}
            >
              <a className={css(styles.paper)} data-tip={paperTip}>
                {paper && this.truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_paper":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            voted on{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paper && paper.id}/summary`}
            >
              <a className={css(styles.paper)} data-tip={paperTip}>
                {paper && this.truncatePaperTitle(paper.title)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_thread":
        var { thread } = notification;
        var threadId = thread && thread.id;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a className={css(styles.link)}>Thread</a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a className={css(styles.paper)} data-tip={paperTip}>
                {paper && this.truncatePaperTitle(paper.title)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_comment":
        var { comment } = notification;
        var threadId = comment && comment.thread_id;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a className={css(styles.link)}>comment</a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a className={css(styles.paper)} data-tip={paperTip}>
                {paper && this.truncatePaperTitle(paper.title)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "vote_reply":
        var { reply } = notification;
        var threadId = reply && reply.thread_id;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a className={css(styles.link)}>reply</a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a className={css(styles.paper)} data-tip={paperTip}>
                {paper && this.truncatePaperTitle(paper.title)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "thread":
        var { first_name, last_name } = notification.created_by;
        var threadId = notification.id;
        paper = notification.paper;
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            created a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${threadId}`}
            >
              <a className={css(styles.link)}>thread</a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a className={css(styles.paper)} data-tip={paperTip}>
                {paper.title && this.truncatePaperTitle(paper.title)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "comment":
        var { thread, plain_text } = notification;
        var threadTip = thread && thread.title;
        var commentTip = plain_text && this.truncatePaperTitle(plain_text);
        var { thread_id } = notification;
        paperId = notification.paper_id;

        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            left a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${thread_id}`}
            >
              <a className={css(styles.link)} data-tip={commentTip}>
                comment
              </a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/discussion`}
            >
              <a className={css(styles.paper)} data-tip={threadTip}>
                {thread &&
                  thread.title &&
                  this.truncatePaperTitle(thread.title)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "reply":
        var { thread, text } = notification;
        var threadTip = thread && thread.title;
        var replyTip = text && this.truncatePaperTitle(text);
        var { thread_id } = notification;
        paperId = notification.paper_id;

        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a className={css(styles.username)}>{username}</a>
            </Link>{" "}
            left a{" "}
            <Link
              href={"/paper/[paperId]/[tabName]/[discussionThreadId]"}
              as={`/paper/${paperId}/discussion/${thread_id}`}
            >
              <a className={css(styles.link)} data-tip={replyTip}>
                reply
              </a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/discussion`}
            >
              <a className={css(styles.paper)} data-tip={threadTip}>
                {thread &&
                  thread.title &&
                  this.truncatePaperTitle(thread.title)}
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

  truncatePaperTitle = (title) => {
    if (title.length >= 90) {
      return title.slice(0, 90) + "...";
    }
    return title;
  };

  renderIcon = () => {
    const { notification } = this.props;
    const notificationType = notification.content_type;

    switch (notificationType) {
      case "vote_paper":
        return icons.file;
      case "vote_comment":
        return <i className="fad fa-comment-alt-dots" />;
      case "vote_reply":
        return <i className="fad fa-comment-alt-dots" />;
      case "thread":
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
        <div className={css(styles.column, styles.notification)}>
          <ReactTooltip
            place={"bottom"}
            delayShow={400}
            className={css(styles.tool)}
          />
          <div className={css(styles.type)}>{this.renderIcon()}</div>
          <div className={css(styles.row, styles.container)}>
            <div className={css(styles.column, styles.left)}>
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
    width: "80%",
    padding: "25px 10px 20px 10px",
    backgroundColor: "#FFF",
    border: "1px solid rgb(237, 237, 237)",
    borderRadius: 5,
    cursor: "pointer",
    position: "relative",
    marginBottom: 10,
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
  },
  message: {
    fontSize: 13,
    lineHeight: 1.5,
    width: "100%",
    overflow: "hidden",
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
