import { buildSlug } from "~/config/utils/buildSlug";
import { connect, useDispatch, useStore } from "react-redux";
import { doesNotExist, isNullOrUndefined } from "~/config/utils/nullchecks";
import { FLAG_REASON } from "~/components/Flag/config/flag_constants";
import { Fragment, useState } from "react";
import { getEtherscanLink } from "~/config/utils/crypto";
import { HyperLink, TimeStamp } from "./NotificationHelpers";
import { NotificationActions } from "~/redux/notification";
import { StyleSheet, css } from "aphrodite";
import { timeAgoStamp } from "~/config/utils/dates";
import AuthorAvatar from "../AuthorAvatar";
import colors from "../../config/themes/colors";
import Link from "next/link";
import Ripples from "react-ripples";
import Router from "next/router";

const NotificationEntry = (props) => {
  const { notification, data } = props;
  const [isRead, toggleRead] = useState(data.read);

  const dispatch = useDispatch();

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

    if (content_type === "withdrawal") {
      return null;
    }

    const formattedSlug = !isNullOrUndefined(slug)
      ? slug
      : buildSlug(paper_official_title ?? paper_title);
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
      action_item,
      action_tip,
      content_type,
      created_by,
      created_date,
      document_id: documentId,
      document_title,
      document_type,
      slug,
      thread_id: threadId,
      toAddress,
      txHash,
      withdrawnAmount,
    } = notification;

    if (content_type === "verdict" && !action_item?.is_content_removed) {
      return;
    }

    const {
      first_name: creatorFName,
      last_name: creatorLName,
      author_profile: creatorProfile,
    } = created_by;

    const authorId = creatorProfile?.id ?? null;
    const formattedSlug = slug ?? buildSlug(document_title);
    const creatorName = creatorFName ?? "" + creatorLName ?? "";

    const onClick = (e) => {
      e.stopPropagation();
      markAsRead(data);
      props.closeMenu();
    };

    const authorLink = {
      href: "/user/[authorId]/[tabName]",
      as: `/user/${authorId}/overview`,
    };

    let documentLink;
    let discussionLink;
    if (document_type === "paper") {
      documentLink = {
        href: "/paper/[paperId]/[paperName]",
        as: `/${document_type}/${documentId}/${formattedSlug}`,
      };
      discussionLink = {
        href: "/paper/[paperId]/[paperName]",
        as: `/${document_type}/${documentId}/${formattedSlug}`,
      };
    } else {
      documentLink = {
        href: "/[document_type]/[documentId]/[title]",
        as: `/${document_type}/${documentId}/${formattedSlug}`,
      };
      discussionLink = {
        href: "/[document_type]/[documentId]/[title]",
        as: `/${document_type}/${documentId}/${formattedSlug}`,
      };
    }

    const sectionLink = (section) => {
      let as = documentLink.as + "#" + section;
      return { ...documentLink, as };
    };

    const timeStamp = <TimeStamp date={created_date} />;
    const notifCreator = (
      <HyperLink
        link={authorLink}
        onClick={onClick}
        style={styles.username}
        text={creatorName}
      />
    );

    const etherscanLink = getEtherscanLink(txHash);

    switch (content_type) {
      case "withdrawal":
        return (
          <div className={css(styles.message)}>
            Your withdrawal of {withdrawnAmount} RSC has now been completed!
            <br />
            <br />
            View the transaction at{" "}
            <a
              href={etherscanLink}
              target="_blank"
              className={css(styles.metatext, styles.noUnderline)}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className={css(styles.metatext)}>{etherscanLink}</div>
            </a>
          </div>
        );
      case "verdict":
        const flaggedContentName = action_item?.flagged_content_name;
        const isDiscussionFlagged = ["comment", "thread", "reply"].includes(
          flaggedContentName
        );
        return (
          <div className={css(styles.message)}>
            {notifCreator}
            {` removed your `}
            <HyperLink
              link={documentLink}
              onClick={onClick}
              style={styles.link}
              text={flaggedContentName}
            />
            {`for ${FLAG_REASON[action_item?.verdict_choice ?? ""] ?? "spam"}`}
            {isDiscussionFlagged && (
              <Fragment>
                {" in "}
                <HyperLink
                  link={documentLink}
                  onClick={onClick}
                  style={styles.link}
                  text={truncateText(document_title)}
                />
              </Fragment>
            )}
            {timeStamp}
          </div>
        );
      case "paper":
      case "post":
        return (
          <div className={css(styles.message)}>
            {notifCreator}
            {` uploaded a new paper ${content_type}`}
            <HyperLink
              link={documentLink}
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
            {notifCreator}
            {" created a "}
            <HyperLink
              link={discussionLink}
              onClick={onClick}
              link={sectionLink("comments")}
              style={styles.link}
              text={"thread"}
            />
            {"in "}
            <HyperLink
              link={documentLink}
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
            {notifCreator}
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
            {notifCreator}
            {" left a "}
            <HyperLink
              dataTip={action_tip}
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
      case "purchase": // synanomous to "support"
        return renderContentSupportNotification();
      default:
        return;
    }
  };

  const renderContentSupportNotification = () => {
    const {
      contribution_amount,
      created_by,
      created_date,
      document_id: documentId,
      document_type: documentType,
      slug,
    } = props.notification;

    const {
      first_name: creatorFName,
      last_name: creatorLName,
      author_profile: creatorProfile,
    } = created_by;

    const formattedSlug = slug ?? buildSlug(documentType);
    const creatorName = creatorFName ?? "" + creatorLName ?? "";

    const formatLink = () => {
      const link = {
        // href: "/[documentType]/[paperId]/[paperName]",
        href: `/${documentType}/${documentId}/${formattedSlug}`,
      };

      switch (documentType) {
        case "thread":
        case "comment":
        case "reply":
          link.as += "#comments";
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
        <Link {...formatLink()}>
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.link)}
          >
            {documentType}
          </a>
        </Link>
        {"has been awarded "}
        <span className={css(styles.rsc)}>{`${Number(
          contribution_amount
        )} RSC`}</span>
        {" by "}
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${creatorProfile?.id ?? ""}/overview`}
        >
          <a
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(data);
              props.closeMenu();
            }}
            className={css(styles.username)}
          >
            {creatorName + ". "}
          </a>
        </Link>
        <span className={css(styles.timestamp)}>
          <span className={css(styles.timestampDivider)}>•</span>
          {timeAgoStamp(created_date)}
        </span>
      </div>
    );
  };

  const message = renderMessage();

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
      <div className={css(styles.body)}>{message}</div>
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
    wordBreak: "break-word",
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

export default connect(null, mapDispatchToProps)(NotificationEntry);
