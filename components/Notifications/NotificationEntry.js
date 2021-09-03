import { connect, useDispatch, useStore } from "react-redux";
import { doesNotExist, isNullOrUndefined } from "~/config/utils/nullchecks";
import { formatPaperSlug } from "~/config/utils/document";
import { getNestedValue } from "~/config/utils/misc";
import { HyperLink, TimeStamp } from "./NotificationHelpers";
import { ModeratorBounty, ContributorBounty } from "./BountyNotifications";
import { NotificationActions } from "~/redux/notification";
import { reviewBounty } from "~/config/fetch";
import { StyleSheet, css } from "aphrodite";
import { timeAgoStamp } from "~/config/utils/dates";
import { useState } from "react";
import AuthorAvatar from "../AuthorAvatar";
import Button from "~/components/Form/Button";
import colors from "../../config/themes/colors";
import Link from "next/link";
import Loader from "~/components/Loader/Loader";
import Ripples from "react-ripples";
import Router from "next/router";

const NotificationEntry = (props) => {
  const { notification, data, updateNotification } = props;
  const [isRead, toggleRead] = useState(data.read);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [pendingDenial, setPendingDenial] = useState(false);

  const dispatch = useDispatch();
  const store = useStore();

  if (isNullOrUndefined(notification)) {
    // if no notification object is passed, dont render anything
    return null;
  }

  const markAsRead = async (data) => {
    if (isRead) {
      return;
    }
    await dispatch(NotificationActions.markAsRead(data.id));
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
    const {
      content_type,
      document_id,
      slug,
      support_type,
      parent_content_type,
      paper_official_title,
      document_type,
      paper_title,
    } = notification;

    const formattedSlug = !isNullOrUndefined(slug)
      ? slug
      : formatPaperSlug(paper_official_title ?? paper_title);
    const isComment = ["thread", "comment", "reply"].includes(support_type);
    // TODO: calvinhlee check with leo with parent_content_type
    const documentType = isComment ? parent_content_type : document_type;
    const hrefPattern = `/[document_type]/[document_id]/[formatted_slug]`;
    const route =
      `/${documentType}/${document_id}/${formattedSlug}` +
      (isComment
        ? "#comments"
        : [
            "thread",
            "comment",
            "reply",
            "vote_thread",
            "vote_reply",
            "vote_comment",
          ].includes(content_type)
        ? "#comments"
        : ["bullet_point", "vote_bullet"].includes(content_type)
        ? "#takeaways"
        : ["summary", "vote_summary"].includes(content_type)
        ? "#summary"
        : "");

    Router.push(hrefPattern, route).then(() => {
      markAsRead(props.data);
      props.closeMenu(); // added as a fallback
    });
  };

  const renderMessage = () => {
    const { notification } = props;
    const {
      action_tip,
      content_type,
      created_by,
      created_date,
      document_id: documentId,
      document_title,
      document_type,
      slug,
    } = notification;
    const {
      first_name: creatorFName,
      last_name: creatorLName,
      author_profile: creatorProfile,
    } = created_by;

    const username = creatorFName ?? "" + creatorLName ?? "";
    const authorId = creatorProfile?.id ?? null;

    const formattedSlug = slug ?? formatPaperSlug(document_title);

    const paperTip = notification.paper_title
      ? notification.paper_title
      : notification.paper_official_title;
    const threadId = notification.thread_id;

    const onClick = (e) => {
      e.stopPropagation();
      markAsRead(data);
      props.closeMenu();
    };

    const authorLink = {
      href: "/user/[authorId]/[tabName]",
      as: `/user/${authorId}/overview`,
    };

    const paperLink = {
      href: "/[documentType]/[paperId]/[paperName]",
      as: `/${document_type}/${documentId}/${formattedSlug}`,
    };

    const discussionPageLink = {
      href: "/[documentType]/[paperId]/[paperName]/[discussionThreadId]",
      as: `/${document_type}/${documentId}/${formattedSlug}/${threadId ?? ""}`,
    };

    const sectionLink = (section) => {
      let as = paperLink.as + "#" + section;

      return { ...paperLink, as };
    };

    const user = (
      <HyperLink
        link={authorLink}
        onClick={onClick}
        style={styles.username}
        text={username}
      />
    );
    const timeStamp = <TimeStamp date={created_date} />;

    switch (content_type) {
      case "bullet_point":
        return (
          <div className={css(styles.message)}>
            {user}
            {" added a key takeaway to "}
            <HyperLink
              link={sectionLink("takeaways")}
              onClick={onClick}
              dataTip={document_title}
              text={truncateText(document_title)}
              style={styles.paper}
            />
            {timeStamp}
          </div>
        );
      case "summary":
        return (
          <div className={css(styles.message)}>
            {user}
            {" edited a summary for "}
            <HyperLink
              link={sectionLink("summary")}
              onClick={onClick}
              dataTip={document_title}
              text={truncateText(document_title)}
              style={styles.paper}
            />
            {timeStamp}
          </div>
        );
      case "paper":
        return (
          <div className={css(styles.message)}>
            {user}
            {" uploaded a new paper "}
            <HyperLink
              link={paperLink}
              onClick={onClick}
              style={styles.paper}
              dataTip={document_title}
              text={truncateText(document_title)}
            />
            {timeStamp}
          </div>
        );
      case "thread":
        return (
          <div className={css(styles.message)}>
            {user}
            {" created a "}
            <HyperLink
              link={discussionPageLink}
              onClick={onClick}
              style={styles.link}
              text={"thread"}
            />
            {"in "}
            <HyperLink
              link={paperLink}
              onClick={onClick}
              style={styles.paper}
              dataTip={document_title}
              text={truncateText(document_title)}
            />
            {timeStamp}
          </div>
        );
      case "comment":
        return (
          <div className={css(styles.message)}>
            {user}
            {" left a "}
            <HyperLink
              dataTip={action_tip}
              link={sectionLink("comments")}
              onClick={onClick}
              style={styles.link}
              text={"comment"}
            />
            {"in your thread: "}
            <HyperLink
              dataTip={action_tip}
              link={sectionLink("comments")}
              onClick={onClick}
              style={styles.paper}
              text={truncateText(action_tip)}
            />
            {timeStamp}
          </div>
        );
      case "reply":
        return (
          <div className={css(styles.message)}>
            {user}
            {" left a "}
            <HyperLink
              dataTip={replyTip}
              link={sectionLink("comments")}
              onClick={onClick}
              style={styles.link}
              text={"reply"}
            />
            {"to your comment in "}
            <HyperLink
              dataTip={action_tip}
              link={sectionLink("comments")}
              onClick={onClick}
              style={styles.paper}
              text={truncateText(action_tip)}
            />
            {timeStamp}
          </div>
        );
      case "vote_paper":
        return (
          <div className={css(styles.message)}>
            {user}
            {" voted on "}
            <HyperLink
              dataTip={document_title}
              link={paperLink}
              onClick={onClick}
              style={styles.paper}
              text={truncateText(document_title)}
            />
            {timeStamp}
          </div>
        );
      case "vote_thread":
        return (
          <div className={css(styles.message)}>
            {user}
            {" voted on a "}
            <HyperLink
              link={discussionPageLink}
              onClick={onClick}
              style={styles.link}
              text={"thread"}
            />
            {"in "}
            <HyperLink
              dataTip={document_title}
              link={paperLink}
              onClick={onClick}
              style={styles.paper}
              text={truncateText(document_title)}
            />
            {timeStamp}
          </div>
        );
      case "vote_comment":
        return (
          <div className={css(styles.message)}>
            {user}
            {" voted on a "}
            <HyperLink
              link={discussionPageLink}
              onClick={onClick}
              style={styles.link}
              text={"comment"}
            />
            {"in "}
            <HyperLink
              dataTip={document_title}
              link={paperLink}
              onClick={onClick}
              style={styles.paper}
              text={truncateText(document_title)}
            />
            {timeStamp}
          </div>
        );
      case "vote_reply":
        return (
          <div className={css(styles.message)}>
            {user}
            {" voted on a "}
            <HyperLink
              link={discussionPageLink}
              onClick={onClick}
              style={styles.link}
              text={"reply"}
            />
            {"in "}
            <HyperLink
              dataTip={document_title}
              link={paperLink}
              onClick={onClick}
              style={styles.paper}
              text={truncateText(document_title)}
            />
            {timeStamp}
          </div>
        );
      // case "vote_bullet":
      //   return renderBulletVoteNotification();
      // case "vote_summary":
      //   return renderSummaryVoteNotification();
      case "support_content":
        return renderContentSupportNotification();
      // case "bounty_moderator":
      //   return (
      //     <div className={css(styles.message)}>
      //       <ModeratorBounty {...props} markAsRead={markAsRead} />
      //     </div>
      //   );
      // case "bounty_contributor":
      //   return (
      //     <div className={css(styles.message)}>
      //       <ContributorBounty {...props} markAsRead={markAsRead} />
      //     </div>
      //   );
      default:
        return;
    }
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
          as={`/user/${author.id}/overview`}
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
        {"voted on your"}
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
      slug,
    } = props.notification;

    const author = created_by.author_profile;

    return (
      <div className={css(styles.message)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/overview`}
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
            summary,{" "}
          </a>
        </Link>
        <span className={css(styles.italics)}>{truncateText(plain_text)}</span>{" "}
        in{" "}
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
            className={css(styles.paper)}
            data-tip={paper_official_title}
          >
            {paper_official_title && truncateText(paper_official_title)}
          </a>
        </Link>
        {created_date ? (
          <span className={css(styles.timestamp)}>
            <span className={css(styles.timestampDivider)}>•</span>
            {timeAgoStamp(created_date)}
          </span>
        ) : null}
      </div>
    );
  };

  const renderContentSupportNotification = () => {
    const {
      type,
      created_by,
      created_date,
      id,
      amount,
      slug,
      support_type,
      parent_content_type,
    } = props.notification;

    const author = created_by.author_profile;
    const getContentType = () => {
      if (type === "bulletpoint") {
        return "key takeaway";
      }
      if (type === "researchhubpost") {
        return "post";
      }
      return type;
    };

    const formatLink = (props) => {
      let documentType;
      if (["thread", "comment", "reply"].includes(support_type)) {
        documentType = parent_content_type;
      } else if (support_type === "researchhubpost") {
        documentType = "post";
      } else {
        documentType = "paper";
      }

      let link = {
        href:
          documentType === "paper"
            ? "/paper/[paperId]/[paperName]"
            : "/post/[documentId]/[title]",
        as: `/${documentType}/${id}/${slug}`,
      };

      switch (type) {
        case "summary":
          link.as = link.as + "#summary";
          break;
        case "bulletpoint":
          link.as = link.as + "#takeaways";
          break;
        case "thread":
          link.as = link.as + "#comments";
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

    return (
      <div className={css(styles.message)}>
        {"Congrats! "}
        <img
          className={css(styles.iconCongrats)}
          src={"/static/icons/party-popper.png"}
          alt="Party Popper Icon"
        />
        {" Your "}
        <Link {...formatLink(props)}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.link)}
          >
            {getContentType()}
          </a>
        </Link>
        {"has been awarded "}
        <span className={css(styles.rsc)}>{`${Number(amount)} RSC`}</span>
        {" by "}
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${author.id}/overview`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.username)}
          >
            {`${author.first_name} ${author.last_name}. `}
          </a>
        </Link>
        <span className={css(styles.timestamp)}>
          <span className={css(styles.timestampDivider)}>•</span>
          {timeAgoStamp(created_date)}
        </span>
      </div>
    );
  };

  const renderActions = () => {
    const { content_type, bounty_approved } = props.notification;

    if (content_type === "bounty_moderator") {
      if (doesNotExist(bounty_approved)) {
        return (
          <div className={css(styles.row)}>
            <Button
              label={
                pendingDenial ? (
                  <Loader loading={true} size={15} color={"#FFF"} />
                ) : (
                  "Deny"
                )
              }
              customButtonStyle={styles.buttonDeny}
              rippleClass={styles.button}
              customLabelStyle={styles.buttonLabel}
              disabled={pendingApproval || pendingDenial}
              onClick={() => handleBounty(false)}
            />
            <Button
              label={
                pendingApproval ? (
                  <Loader loading={true} size={15} color={"#FFF"} />
                ) : (
                  "Approve"
                )
              }
              customButtonStyle={styles.button}
              rippleClass={styles.buttonApprove}
              customLabelStyle={styles.buttonLabel}
              disabled={pendingApproval || pendingDenial}
              onClick={() => handleBounty(true)}
            />
          </div>
        );
      }
    }
  };

  const handleBounty = (approved) => {
    if (pendingApproval || pendingDenial) return;

    if (approved) {
      setPendingApproval(true);
    } else {
      setPendingDenial(true);
    }

    const { type, bounty_id, paper_id } = props.notification;

    const PAYLOAD = {
      bounty_content_type: type,
      bounty_object_id: bounty_id,
      notification_id: props.data.id,
      approved,
    };

    reviewBounty({ paperId: paper_id, PAYLOAD })
      .then((res) => {
        // update
        const updatedNotification = { ...props.data };
        updatedNotification.extra.bounty_approval = approved;
        updateNotification(updatedNotification);

        if (approved) {
          setPendingApproval(false);
        } else {
          setPendingDenial(false);
        }
      })
      .catch((err) => {
        setPendingApproval(false);
        setPendingDenial(false);
      });
  };

  const message = renderMessage();
  const actionText = renderActions();
  return (
    <Ripples
      className={css(styles.container, isRead && styles.read)}
      onClick={handleNavigation}
    >
      <div className={css(styles.authorAvatar)}>
        <AuthorAvatar
          size={35}
          author={notification?.created_by?.author_profile ?? ""}
        />
      </div>
      <div className={css(styles.body)}>
        {message}
        {actionText}
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "flex-start",
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
  rsc: {
    fontWeight: 500,
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
  row: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    height: 25,
    width: "100%",
  },
  buttonApprove: {
    height: 25,
    width: "100%",
    marginLeft: 10,
  },
  buttonDeny: {
    height: 25,
    width: "100%",
    backgroundColor: colors.RED(0.8),
    ":hover": {
      backgroundColor: colors.RED(),
    },
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 400,
  },
  tagApproved: {
    fontSize: 8,
    color: "#FFF",
    padding: "3px 8px",
    background: colors.BLUE(),
    borderRadius: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 8,
  },
  tagDenied: {
    fontSize: 8,
    color: "#FFF",
    padding: "3px 8px",
    background: colors.RED(),
    borderRadius: 4,
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 8,
  },
  iconCongrats: {
    height: 15,
  },
});

const mapDispatchToProps = {
  updateNotification: NotificationActions.updateNotification,
};

export default connect(
  null,
  mapDispatchToProps
)(NotificationEntry);
