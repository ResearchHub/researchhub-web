import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/pro-solid-svg-icons";
import { faCommentLines } from "@fortawesome/pro-solid-svg-icons";
import { faCommentAltDots } from "@fortawesome/pro-duotone-svg-icons";
import { faFile } from "@fortawesome/pro-solid-svg-icons";
import { Component, Fragment } from "react";

// NPM Modules
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Router from "next/router";
import ReactTooltip from "react-tooltip";
import { withAlert } from "react-alert";

// Component
import AuthorAvatar from "../AuthorAvatar";
import ModeratorDeleteButton from "../Moderator/ModeratorDeleteButton";

// Redux
import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config

import colors from "~/config/themes/colors";
import { getNestedValue } from "~/config/utils/misc";
import { buildSlug } from "~/config/utils/buildSlug";
import { doesNotExist } from "~/config/utils/nullchecks";
import { UNIFIED_DOC_PAGE_URL_PATTERN } from "~/config/utils/url_patterns";
import { getUrlToUniDoc } from "~/config/utils/routing";

const getNotifMetadata = (notification) => {
  // Grab notification metadata for Discussions, Papers, and Comments + Replies on both.
  const {
    created_by: createdBy,
    created_date: createdDate,
    item,
    action,
  } = notification;
  const notifType = notification.content_type.name;
  const { unified_document: unifiedDocument } = item;
  const { document_type: documentType } = unifiedDocument;
  const authorId = getNestedValue(createdBy, ["author_profile", "id"]);
  const timestamp = formatTimestamp(createdDate);
  const username = formatUsername(createdBy);
  const shouldLeadToComments = ["thread", "comment", "reply"].includes(
    notifType
  );

  const { id: documentID, paper_title, slug, title } = item ?? {};
  let hrefAs = getUrlToUniDoc(unifiedDocument);

  return {
    authorId,
    href: UNIFIED_DOC_PAGE_URL_PATTERN,
    hrefAs: !shouldLeadToComments ? hrefAs : hrefAs + "#comments",
    notifType,
    postId: documentID,
    postTitle: title ?? paper_title ?? item?.title,
    slug: slug,
    sourceType: documentType,
    timestamp,
    username,
  };
};

const formatUsername = (userObject) => {
  if (!doesNotExist(userObject)) {
    let { first_name, last_name } = userObject;
    return `${first_name} ${last_name}`;
  }
  return "";
};

const formatTimestamp = (date_str) => {
  if (!date_str) {
    return;
  }
  date_str = date_str.trim();
  date_str = date_str.replace(/\.\d\d\d+/, ""); // remove the milliseconds
  date_str = date_str.replace(/-/, "/").replace(/-/, "/"); //substitute - with /
  date_str = date_str.replace(/T/, " ").replace(/Z/, " UTC"); //remove T and substitute Z with UTC
  date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // +08:00 -> +0800
  const parsed_date = new Date(date_str);
  const relative_to = new Date();
  const delta = Math.max(
    2,
    parseInt((relative_to.getTime() - parsed_date) / 1000)
  );
  let r = "";
  if (delta < 60) {
    r = delta + " seconds ago";
  } else if (delta < 120) {
    r = "a minute ago";
  } else if (delta < 45 * 60) {
    r = parseInt(delta / 60, 10).toString() + " minutes ago";
  } else if (delta < 2 * 60 * 60) {
    r = "an hour ago";
  } else if (delta < 24 * 60 * 60) {
    r = "" + parseInt(delta / 3600, 10).toString() + " hours ago";
  } else if (delta < 48 * 60 * 60) {
    r = "a day ago";
  } else {
    r = parseInt(delta / 86400, 10).toString() + " days ago";
  }
  return "about " + r;
};

class LiveFeedNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // hideCard: false,
      showDropdown: false,
      showPreview: false,
      isRemoved: false,
    };
    this.dropdownIcon;
    this.dropdownMenu;
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.handleOutsideClick);
    this.setState({
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

  handleClickNavigation = (e) => {
    e && e.stopPropagation();
    let { notification } = this.props;
    let { content_type, paper_id, thread_id } = notification;
    let type = content_type;

    let route;
    let slug = notification.slug
      ? notification.slug
      : buildSlug(
          notification.paper_official_title
            ? notification.paper_official_title
            : notification.paper_title
        );

    if (type === "summary") {
      route = `/paper/${paper_id}/${slug}`;
    } else if (
      [
        "comment",
        "hypothesis",
        "paper",
        "reply",
        "researchhub post",
        "thread",
      ].includes(type)
    ) {
      route = getNotifMetadata(notification)?.hrefAs;
    } else if (type === "bullet_point") {
      route = `/paper/${paperId}/${slug}#takeaways`;
    }

    route && Router.push(UNIFIED_DOC_PAGE_URL_PATTERN, route);
    document.body.scrollTop = 0; // For Safari
    return (document.documentElement.scrollTop = 0);
  };

  handleNewCases = () => {
    const { notification } = this.props;
    const {
      authorId,
      href,
      hrefAs,
      notifType,
      postId,
      postTitle,
      slug,
      sourceType,
      timestamp,
      username,
    } = getNotifMetadata(notification);
    const threadTip = notification.thread_title
      ? notification.thread_title
      : notification.thread_plain_text;

    let verb, subject, preposition;
    switch (notifType) {
      case "paper":
        verb = `uploaded a new ${
          notification.paper_type === "PRE_REGISTRATION"
            ? "funding request"
            : "paper"
        }`;
        subject = {
          linkText: this.truncatePaperTitle(postTitle),
          plainText: "",
        };
        break;
      case "researchhubpost":
        const rhPostType =
          notification.item?.unified_document?.document_type === "QUESTION"
            ? "question"
            : "post";
        verb = `created a new ${rhPostType}`;
        subject = {
          linkText: this.truncatePaperTitle(postTitle),
          plainText: "",
        };
        break;
      case "hypothesis":
        verb = "created a new hypothesis";
        subject = {
          linkText: this.truncatePaperTitle(postTitle),
          plainText: "",
        };
        break;
      case "thread":
        const plainText = notification.item.plain_text;
        verb = "left a";
        subject = {
          linkText: "comment",
          plainText: this.truncateComment(plainText),
        };
        preposition = {
          linkText: this.truncatePaperTitle(postTitle),
          plainText: "",
        };
        break;
      case "comment":
        const commentTip = notification.item.plain_text;
        verb = "left a";
        subject = {
          linkText: "comment",
          plainText: this.truncateComment(commentTip),
        };
        preposition = {
          linkText: this.truncatePaperTitle(postTitle),
          plainText: "",
        };
        break;
      case "reply":
        const replyTip = notification.item.plain_text;
        verb = "left a";
        subject = {
          linkText: "comment",
          plainText: this.truncateComment(replyTip),
        };
        preposition = {
          linkText: this.truncatePaperTitle(postTitle),
          plainText: "",
        };
        break;
    }
    return (
      <div className={css(styles.message)}>
        <Link
          href={"/user/[authorId]/[tabName]"}
          as={`/user/${authorId}/overview`}
          className={css(styles.username)}
          onClick={(e) => e.stopPropagation()}
        >
          {username}
        </Link>
        {` ${verb} `}
        <Link
          href={href ?? ""}
          as={hrefAs ?? ""}
          className={css(styles.link)}
          onClick={(e) => e.stopPropagation()}
        >
          {subject.linkText}
        </Link>
        <em>{subject.plainText}</em>
        {preposition ? (
          <Fragment>
            {" in "}
            <Link
              href={href ?? ""}
              as={hrefAs}
              className={css(styles.paper)}
              data-tip={postTitle}
              onClick={(e) => e.stopPropagation()}
            >
              {preposition.linkText}
            </Link>
            <em>{preposition.plainText}</em>
          </Fragment>
        ) : null}
        <span className={css(styles.timestamp)}>
          <span className={css(styles.timestampDivider)}>•</span>
          {timestamp}
        </span>
      </div>
    );
  };

  renderNotification = () => {
    const { notification } = this.props;
    let { created_date, created_by, content_type, slug } = notification;
    let notificationType = notification.content_type.name;
    const timestamp = formatTimestamp(created_date);

    switch (notificationType) {
      case "purchase":
        const { created_by: recipient } = notification;
        const authorId = getNestedValue(notification.item.user, [
          "author_profile",
          "id",
        ]);
        const recipientAuthorId = getNestedValue(created_by, [
          "author_profile",
          "id",
        ]);
        const recipientName = formatUsername(recipient);
        const username = formatUsername(notification.item.user);
        const supportType = notification.item.content_type.model;
        const slug = notification.item.source.slug;
        const sourceId = notification.item.source.id;

        const href = UNIFIED_DOC_PAGE_URL_PATTERN;
        let formattedSupportType;
        let as;
        let title;
        let plainText;
        let doc;
        if (supportType === "paper") {
          formattedSupportType = "paper";
          as = `/paper/${sourceId}/${slug}`;
          title = notification.item.source.paper_title;
        } else if (supportType === "researchhubpost") {
          formattedSupportType = "post";
          as = `/post/${sourceId}/${slug}`;
          title = notification.item.source.title;
        } else if (supportType === "bulletpoint") {
          formattedSupportType = "key takeaway";
        } else if (supportType === "summary") {
          formattedSupportType = "summary";
        } else {
          const unifiedDocument = notification.item.source.unified_document;
          const parentContentType = unifiedDocument.document_type;
          const commentOnPaper = parentContentType === "PAPER";

          if (Array.isArray(unifiedDocument.documents)) {
            doc = unifiedDocument.documents[0];
          } else {
            doc = unifiedDocument.documents;
          }

          formattedSupportType = "comment";
          plainText = this.truncateComment(notification.item.source.plain_text);
          as = commentOnPaper
            ? `/paper/${doc.id}/${doc.slug}`
            : `/post/${doc.id}/${doc.slug}`;
          title = commentOnPaper ? doc.title : doc.title;
        }

        return (
          <div className={css(styles.message)}>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${authorId}/overview`}
              className={css(styles.username)}
              onClick={(e) => e.stopPropagation()}
            >
              {username}
            </Link>
            {` awarded ${notification.item.amount} RSC `}
            <img
              className={css(styles.coinIcon)}
              src={"/static/icons/coin-filled.png"}
              alt="RSC Coin"
            />
            {" to "}
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${recipientAuthorId}/overview`}
              className={css(styles.username)}
              onClick={(e) => e.stopPropagation()}
            >
              {recipientName}
            </Link>
            {` for their ${formattedSupportType} `}
            {formattedSupportType === "comment" ? (
              <>
                <em>{plainText}</em>
                {" in "}
              </>
            ) : null}
            <Link
              href={href}
              as={as}
              className={css(styles.paper)}
              data-tip={title}
              onClick={(e) => e.stopPropagation()}
            >
              {title && this.truncatePaperTitle(title)}
            </Link>
            <span className={css(styles.timestamp)}>
              <span className={css(styles.timestampDivider)}>•</span>
              {timestamp}
            </span>
          </div>
        );
      default:
        return this.handleNewCases();
    }
  };

  truncatePaperTitle = (title) => {
    if (title && title.length >= 90) {
      return title.slice(0, 90) + "...";
    }
    return title;
  };

  truncateComment = (comment) => {
    if (comment && comment.length >= 300) {
      return comment.slice(0, 300) + "...";
    }
    return comment;
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

  formatMetaData = () => {
    let { notification } = this.props;
    let contentType = notification.content_type;
    let metaData = {};

    if (
      contentType === "thread" ||
      contentType === "comment" ||
      contentType === "reply"
    ) {
      metaData.threadId = notification.id;
    }
    if (contentType === "comment" || contentType === "reply") {
      metaData.commentId = notification.id;
    }
    if (contentType === "reply") {
      metaData.replyId = notification.id;
    }

    if (contentType === "purchase") {
      let item = notification.item;

      if (item.content_type.model === "paper") {
        metaData.paperId = item.source.id;
      }
    } else {
      let unifiedDocument = notification?.item.unified_document;
      let document_type =
        unifiedDocument?.document_type ?? notification?.content_type;
      if (document_type === "DISCUSSION") {
        metaData.postId = unifiedDocument?.documents[0]?.id;
      } else if (document_type === "hypothesis") {
        metaData.hypoId = unifiedDocument?.id;
      } else {
        metaData.paperId = unifiedDocument?.documents?.id;
      }
    }

    metaData.authorId = notification?.created_by?.author_profile?.id;

    return metaData;
  };

  hideCard = (e) => {
    e && e.stopPropagation();
    this.setState({ hideCard: true });
  };

  convertDate = () => {
    return formatPublishedDate(transformDate(paper.paper_publish_date));
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
        return <FontAwesomeIcon icon={faFile}></FontAwesomeIcon>;
      case "vote_comment":
      case "comment":
        return <FontAwesomeIcon icon={faCommentAltDots}></FontAwesomeIcon>;
      case "reply":
      case "vote_reply":
        return <FontAwesomeIcon icon={faCommentAltDots}></FontAwesomeIcon>;
      case "thread":
      case "vote_thread":
        return <FontAwesomeIcon icon={faCommentLines}></FontAwesomeIcon>;
    }
  };

  renderDropDown = () => {
    let { showDropdown } = this.state;
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
            {correctContent(
              this.props.notification.content_type,
              moderator
            ) && (
              <ModeratorDeleteButton
                containerStyle={styles.dropdownItem}
                labelStyle={[styles.text, styles.removeText]}
                iconStyle={styles.expandIcon}
                label={"Remove Content"}
                actionType={"post"}
                metaData={metaData}
                onRemove={this.removeContent}
              />
            )}
            {correctContent(
              this.props.notification.content_type,
              moderator
            ) && (
              <ModeratorDeleteButton
                containerStyle={styles.dropdownItem}
                labelStyle={[styles.text, styles.removeText]}
                iconStyle={styles.expandIcon}
                icon={<FontAwesomeIcon icon={faBan}></FontAwesomeIcon>}
                label={"Ban User"}
                actionType={"user"}
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
    let contentType = notification.content_type;
    let authorProfile = notification.created_by.author_profile;

    if (contentType === "purchase") {
      authorProfile = notification.item.user.author_profile;
    }

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
        <div className={css(styles.row, styles.container)}>
          <div
            className={css(styles.column, styles.left)}
            onClick={(e) => e.stopPropagation()}
          >
            <AuthorAvatar author={authorProfile} size={35} />
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
    wordBreak: "break-word",
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
    top: 30,
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
    // bottom: -20,
    width: 160,
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
  coinIcon: {
    maxWidth: 11,
    maxHeight: 11,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  openLoginModal: ModalActions.openLoginModal,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(LiveFeedNotification));
