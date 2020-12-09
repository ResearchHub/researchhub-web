import { Fragment, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Router from "next/router";
import Link from "next/link";
import Ripples from "react-ripples";

// Component
import AuthorAvatar from "../AuthorAvatar";

// Redux
import { NotificationActions } from "~/redux/notification";
import { AuthorActions } from "~/redux/author";

// Config
import colors from "../../config/themes/colors";
import {
  doesNotExist,
  getNestedValue,
  timeAgoStamp,
  formatPaperSlug,
} from "~/config/utils";

const NotificationEntry = (props) => {
  const { notification, data } = props;
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

  const truncateText = (title) => {
    if (title && title.length >= 90) {
      return title.slice(0, 90).trim() + "...";
    }
    return title;
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
    let { content_type, paper_id, thread_id, slug } = notification;
    let type = content_type;
    let paperId = paper_id;
    let threadId = thread_id;
    let href;
    let route;
    let title = slug
      ? slug
      : formatPaperSlug(
          notification.paper_official_title
            ? notification.paper_official_title
            : notification.paper_title
        );

    if (type === "paper" || type === "summary" || type === "support_content") {
      href = "/paper/[paperId]/[paperName]";
      route = `/paper/${paperId}/${title}`;
    } else if (
      type === "thread" ||
      type === "comment" ||
      type === "reply" ||
      type === "vote_thread" ||
      type === "vote_reply" ||
      type === "vote_comment"
    ) {
      href = "/paper/[paperId]/[paperName]";
      route = `/paper/${paperId}/${title}#comments`;
    } else if (type === "bullet_point" || type === "vote_bullet") {
      href = "/paper/[paperId]/[paperName]";
      route = `/paper/${paperId}/${title}#takeaways`;
    } else if (type === "vote_summary") {
      href = "/paper/[paperId]/[paperName]";
      route = `/paper/${paperId}/${title}#description`;
    }

    isRead && props.closeMenu();
    markAsRead(props.data);
    href && route && Router.push(href, route);
  };

  const renderMessage = (contentType) => {
    const notification = props.notification;
    let {
      created_date,
      created_by,
      content_type,
      paper_title,
      paper_official_title,
      slug,
    } = notification;
    let notificationType = content_type;
    const timestamp = timeAgoStamp(created_date);
    const username = formatUsername(
      getNestedValue(created_by, ["author_profile"])
    );
    const authorId = getNestedValue(created_by, ["author_profile", "id"]);
    let title = slug
      ? slug
      : formatPaperSlug(
          paper_official_title ? paper_official_title : paper_title
        );
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>
            {" added a key takeaway to "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}#takeaways`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncateText(paperTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            edited a <span>summary </span>
            for{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}#summary`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncateText(paperTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            uploaded a new paper{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTitle}
              >
                {paperTitle && truncateText(paperTitle)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            created a{" "}
            <Link
              href={"/paper/[paperId]/[paperName]/[discussionThreadId]"}
              as={`/paper/${paperId}/${title}/${threadId}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.link)}
              >
                thread
              </a>
            </Link>
            {"in "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncateText(paperTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            left a{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}#comments`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.link)}
                data-tip={commentTip}
              >
                comment
              </a>
            </Link>
            {"in your thread: "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}#comments`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={threadTip}
              >
                {threadTip && truncateText(threadTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            left a{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}#comments`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.link)}
                data-tip={replyTip}
              >
                reply
              </a>
            </Link>
            {"to your comment in "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}#comments`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={threadTip}
              >
                {threadTip && truncateText(threadTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            voted on{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncateText(paperTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[paperName]/[discussionThreadId]"}
              as={`/paper/${paperId}/${title}/${threadId}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.link)}
              >
                thread
              </a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncateText(paperTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[paperName]/[discussionThreadId]"}
              as={`/paper/${paperId}/${title}/${threadId}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.link)}
              >
                comment
              </a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {truncateText(paperTip)}
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
              as={`/user/${authorId}/contributions`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.username)}
              >
                {username}
              </a>
            </Link>{" "}
            voted on a{" "}
            <Link
              href={"/paper/[paperId]/[paperName]/[discussionThreadId]"}
              as={`/paper/${paperId}/${title}/${threadId}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.link)}
              >
                reply
              </a>
            </Link>
            in{" "}
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${paperId}/${title}`}
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(data);
                  props.closeMenu();
                }}
                className={css(styles.paper)}
                data-tip={paperTip}
              >
                {paperTip && truncateText(paperTip)}
              </a>
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      // case "stripe":
      //   return handleStripeNotification();
      case "vote_bullet":
        return renderBulletVoteNotification();
      case "vote_summary":
        return renderSummaryVoteNotification();
      case "support_content":
        return renderContentSupportNotification();
      default:
        return;
    }
  };

  const handleStripeNotification = () => {
    const {
      created_date,
      created_by,
      status,
      url,
      message,
    } = props.notification;

    if (status && status === "pending") {
      return null;
    }

    const timestamp = timeAgoStamp(created_date);
    const authorProfile = created_by.author_profile;

    _updateAuthorWallet(authorProfile.wallet, store.getState().author);

    function _updateAuthorWallet(wallet, author) {
      let { stripe_verified, stripe_acc } = author.wallet;
      if (!stripe_verified && wallet.stripe_verified) {
        return dispatch(
          AuthorActions.updateAuthorByKey({ key: "wallet", value: wallet })
        );
      } else if (stripe_acc !== wallet.stripe_acc) {
        return dispatch(
          AuthorActions.updateAuthorByKey({ key: "wallet", value: wallet })
        );
      }
    }

    function _formatText(status, message) {
      switch (status) {
        case "inactive":
          let field = message;

          return (
            <Fragment>
              Almost done! Please verify your {` ${field} `} from your{" "}
              <span className={css(styles.link)}>
                <b>Stripe Dashboard.</b>
              </span>
            </Fragment>
          );
        case "active":
          return (
            <Fragment>
              Congrats! Your Stripe account has been verified.
            </Fragment>
          );
      }
    }

    return (
      <div
        className={css(styles.message)}
        onClick={(e) => {
          e.stopPropagation();
          markAsRead(props.data);
          isRead && props.closeMenu();
        }}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={url}
          className={css(styles.atag)}
        >
          {_formatText(status, message)}
          <span className={css(styles.timestamp)}>
            <span className={css(styles.timestampDivider)}>•</span>
            {timestamp}
          </span>
        </a>
        <img
          className={css(styles.stripeLogo)}
          src={"/static/icons/stripe.png"}
        />
      </div>
    );
  };

  const renderBulletVoteNotification = () => {
    const {
      created_by,
      created_date,
      plain_text,
      paper_id,
      slug,
    } = props.notification;

    const author = created_by.author_profile;

    return (
      <div className={css(styles.message)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/contributions`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.username)}
          >
            {`${author.first_name} ${author.last_name}`}
          </a>
        </Link>{" "}
        voted on your{" "}
        <Link
          href={"/paper/[paperId]/[paperName]"}
          as={`/paper/${paper_id}/${slug}#description`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.link)}
          >
            key takeaway,{" "}
          </a>
        </Link>
        <span className={css(styles.italics)}>{truncateText(plain_text)}</span>
        <span className={css(styles.timestamp)}>
          <span className={css(styles.timestampDivider)}>•</span>
          {timeAgoStamp(created_date)}
        </span>
      </div>
    );
  };

  const renderSummaryVoteNotification = () => {
    const {
      content_type,
      created_by,
      created_date,
      plain_text,
      paper_id,
      paper_official_title,
    } = props.notification;

    const author = created_by.author_profile;

    return (
      <div className={css(styles.message)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/contributions`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.username)}
          >
            {`${author.first_name} ${author.last_name}`}
          </a>
        </Link>{" "}
        voted on your{" "}
        <Link
          href={"/paper/[paperId]/[paperName]"}
          as={`/paper/${paper_id}/${formatPaperSlug(
            paper_official_title
          )}#description`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.link)}
          >
            summary,{" "}
          </a>
        </Link>
        <span className={css(styles.italics)}>{truncateText(plain_text)}</span>{" "}
        in{" "}
        <Link
          href={"/paper/[paperId]/[paperName]"}
          as={`/paper/${paper_id}/${formatPaperSlug(paper_official_title)}`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.paper)}
            data-tip={paper_official_title}
          >
            {paper_official_title && truncateText(paper_official_title)}
          </a>
        </Link>
        <span className={css(styles.timestamp)}>
          <span className={css(styles.timestampDivider)}>•</span>
          {timeAgoStamp(created_date)}
        </span>
      </div>
    );
  };

  const renderContentSupportNotification = () => {
    const {
      type,
      created_by,
      created_date,
      paper_id,
      amount,
      slug,
    } = props.notification;
    const author = created_by.author_profile;
    const getContentType = () => {
      if (type === "bulletpoint") {
        return "key takeaway";
      }
      if (type === "thread") {
        return "comment";
      }
      return type;
    };

    const formatLink = (props) => {
      const link = {
        href: "/paper/[paperId]/[paperName]",
        as: `/paper/${paper_id}/${slug}`,
      };

      switch (type) {
        case "summary":
          link.as = link.as + "#summary";
          break;
        case "bulletpoint":
          link.as = link.as + "#takeaways";
          break;
        case "thread":
          link.href = link.href + "/[discussionThreadId]";
          link.as = link.as + `/${props.data.extra.id}`;
          break;
        case "comment":
          link.as = link.as + "#comments";
          break;
        case "reply":
          link.as = link.as + "#comments";
          break;
        default:
          break;
      }
      return link;
    };

    if (type === "paper") {
      return (
        <div className={css(styles.message)}>
          <Link
            href={"/user/[authorId]/[tabName]"}
            as={`/user/${author.id}/contributions`}
          >
            <a
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(data);
                props.closeMenu();
              }}
              className={css(styles.username)}
            >
              {`${author.first_name} ${author.last_name}`}
            </a>
          </Link>
          {` contributed ${Number(amount)} RSC to support your `}
          <Link
            href={"/paper/[paperId]/[paperName]"}
            as={`/paper/${paper_id}/${slug}`}
          >
            <a
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(data);
                props.closeMenu();
              }}
              className={css(styles.link)}
            >
              paper.
            </a>
          </Link>
          <span className={css(styles.timestamp)}>
            <span className={css(styles.timestampDivider)}>•</span>
            {timeAgoStamp(created_date)}
          </span>
        </div>
      );
    }

    return (
      <div className={css(styles.message)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/contributions`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.username)}
          >
            {`${author.first_name} ${author.last_name}`}
          </a>
        </Link>
        {` awarded ${Number(amount)} RSC to your `}
        <Link {...formatLink(props)}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.link)}
          >
            {getContentType() + "."}
          </a>
        </Link>
        <span className={css(styles.timestamp)}>
          <span className={css(styles.timestampDivider)}>•</span>
          {timeAgoStamp(created_date)}
        </span>
      </div>
    );
  };

  return (
    <Ripples
      className={css(styles.container, isRead && styles.read)}
      onClick={handleNavigation}
    >
      <div className={css(styles.authorAvatar)}>
        <AuthorAvatar
          size={35}
          author={notification && notification.created_by.author_profile}
        />
      </div>
      <div className={css(styles.body)}>
        {notification &&
          renderMessage(notification.context_type && notification.context_type)}
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
    position: "relative",
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
  atag: {
    color: "unset",
    textDecoration: "unset",
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
  stripeLogo: {
    position: "absolute",
    height: 20,
    right: 0,
    bottom: 0,
  },
  italics: {
    fontStyle: "italic",
  },
});

export default NotificationEntry;
