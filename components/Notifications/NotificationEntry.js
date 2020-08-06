import { useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroller";
import ReactTooltip from "react-tooltip";
import Ripples from "react-ripples";

// Component
import AuthorAvatar from "../AuthorAvatar";

// Redux
import { NotificationActions } from "~/redux/notification";

// Config
import colors from "../../config/themes/colors";
import { doesNotExist, getNestedValue, timeAgo } from "~/config/utils";

const NotificationEntry = (props) => {
  let { notification, data } = props;
  const [isRead, toggleRead] = useState(data.read);
  const dispatch = useDispatch();
  const store = useStore();

  const markAsRead = async (data) => {
    if (isRead) {
      return;
    }
    let prevState = store.getState().livefeed.notifications;
    await dispatch(NotificationActions.markAsRead(prevState, data.id));
    toggleRead(true);
    props.closeMenu();
  };

  const truncatePaperTitle = (title) => {
    if (title && title.length >= 90) {
      return title.slice(0, 90).trim() + "...";
    }
    return title;
  };

  const formatTimestamp = (date) => {
    date = new Date(date);
    return timeAgo.format(date);
  };

  const formatUsername = (userObject) => {
    if (!doesNotExist(userObject)) {
      let { first_name, last_name } = userObject;
      return `${first_name} ${last_name}`;
    }
    return "";
  };

  const handleNavigation = (e) => {
    e && e.stopPropagation();
    let { notification } = props;
    let { content_type, paper_id, thread_id } = notification;
    let type = content_type;
    let paperId = paper_id;
    let threadId = thread_id;
    let href;
    let route;

    if (type === "paper" || type === "summary") {
      href = "/paper/[paperId]/[tabName]";
      route = `/paper/${paperId}/summary`;
    } else if (
      type === "thread" ||
      type === "comment" ||
      type === "reply" ||
      type === "vote_thread" ||
      type === "vote_reply" ||
      type === "vote_comment"
    ) {
      href = "/paper/[paperId]/[tabName]/[discussionThreadId]";
      route = `/paper/${paperId}/discussion/${threadId}`;
    }

    isRead && props.closeMenu();
    markAsRead(props.data);
    href && route && Router.push(href, route);
    document.body.scrollTop = 0; // For Safari
    return (document.documentElement.scrollTop = 0);
  };

  const renderString = (contentType) => {
    const notification = props.notification;
    let { created_date, created_by, content_type } = notification;
    let notificationType = content_type;
    const timestamp = formatTimestamp(created_date);
    const username = formatUsername(
      getNestedValue(created_by, ["author_profile"])
    );
    const authorId = getNestedValue(created_by, ["author_profile", "id"]);
    let paperTip = notification.paper_title
      ? notification.paper_title
      : notification.paper_official_title;
    let paperId = notification.paper_id;
    let threadTip = notification.thread_title
      ? notification.thread_title
      : notification.thread_plain_text;
    let threadId = notification.thread_id;

    switch (notificationType) {
      case "bullet_point":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>
            {" added a key takeaway to "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/summary`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncatePaperTitle(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      case "summary":
        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/contributions}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncatePaperTitle(paperTip)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTitle}
              >
                {paperTitle && truncatePaperTitle(paperTitle)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.link)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncatePaperTitle(paperTip)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.link)}
                data-tip={commentTip}
              >
                comment
              </a>
            </Link>
            {"in your thread: "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/discussion`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={threadTip}
              >
                {threadTip && truncatePaperTitle(threadTip)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.link)}
                data-tip={replyTip}
              >
                reply
              </a>
            </Link>
            {"to your comment in "}
            <Link
              href={"/paper/[paperId]/[tabName]"}
              as={`/paper/${paperId}/discussion`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={threadTip}
              >
                {threadTip && truncatePaperTitle(threadTip)}
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
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncatePaperTitle(paperTip)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.link)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncatePaperTitle(paperTip)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.link)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {truncatePaperTitle(paperTip)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.username)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.link)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncatePaperTitle(paperTip)}
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

  return (
    <Ripples
      className={css(styles.container, isRead && styles.read)}
      onClick={handleNavigation}
    >
      <div className={css(styles.authorAvatar)}>
        <AuthorAvatar
          size={35}
          author={notification.created_by.author_profile}
        />
      </div>
      <div className={css(styles.body)}>
        {/* <ReactTooltip /> */}
        {renderString(notification.context_type && notification.context_type)}
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: 20,
    borderBottom: "1px solid #dddfe2",
    backgroundColor: "#EDf2FA",
    ":hover": {
      backgroundColor: "#EDf2FA",
    },
  },
  read: {
    backgroundColor: "#fff",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  authorAvatar: {
    marginRight: 15,
  },
  body: {},
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
  timestamp: {
    fontWeight: "normal",
    color: "#918f9b",
    fontSize: 12,
    fontFamily: "Roboto",
  },
  timestampDivider: {
    fontSize: 18,
    paddingRight: 4,
    color: colors.GREY(1),
    lineHeight: "100%",
    verticalAlign: "middle",
  },
});

export default NotificationEntry;
