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
import { doesNotExist, getNestedValue, formatPaperSlug } from "~/config/utils";
import { timeAgo } from "~/config/utils/dates";

const getNotifMetadata = (notification) => {
  // Grab notification metadata for Discussions, Papers, and Comments + Replies on both.
  const {
    content_type: notifType,
    created_by: createdBy,
    created_date: createdDate,
    item,
  } = notification;

  const { unified_document: unifiedDocument } = item;
  const { document_type: sourceType } = unifiedDocument;

  let doc, href, hrefAs, postId, postTitle, slug;
  switch (sourceType) {
    case "DISCUSSION":
      href = "/post/[documentId]/[title]";
      doc = unifiedDocument.documents[0]; // For posts, documents is an array of objects
      postId = doc.id;
      postTitle = doc.title || doc.post_title;
      slug = doc.slug;
      hrefAs = `/post/${postId}/${slug}`;
      break;
    case "PAPER":
      href = "/paper/[paperId]/[paperName]";
      doc = unifiedDocument.documents; // For papers, documents is an object
      postId = doc.id;
      postTitle = doc.title || doc.paper_title;
      slug = doc.slug;
      hrefAs = `/paper/${postId}/${slug}`;
      break;
  }
  if (["thread", "comment", "reply"].includes(notifType)) {
    hrefAs += "#comments"; // TODO: briansantoso - link directly to specific comment with threadId
  }
  const timestamp = formatTimestamp(createdDate);
  const username = formatUsername(createdBy);
  const authorId = getNestedValue(createdBy, ["author_profile", "id"]);
  return {
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

  handleClickNavigation = (e) => {
    e && e.stopPropagation();
    let { notification } = this.props;
    let { content_type, paper_id, thread_id } = notification;
    let type = content_type;

    let paperId = paper_id;
    let threadId = thread_id;
    let href;
    let route;
    let slug = notification.slug
      ? notification.slug
      : formatPaperSlug(
          notification.paper_official_title
            ? notification.paper_official_title
            : notification.paper_title
        );

    if (type === "summary") {
      href = "/paper/[paperId]/[paperName]";
      route = `/paper/${paperId}/${slug}`;
    } else if (
      ["paper", "researchhub post", "thread", "comment", "reply"].includes(type)
    ) {
      const metaData = getNotifMetadata(notification);
      href = metaData.href;
      route = metaData.hrefAs;
    } else if (type === "bullet_point") {
      href = "/paper/[paperId]/[paperName]";
      route = `/paper/${paperId}/${slug}#takeaways`;
    }

    href && route && Router.push(href, route);
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
        verb = "created a new post";
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
        >
          <a
            className={css(styles.username)}
            onClick={(e) => e.stopPropagation()}
          >
            {username}
          </a>
        </Link>
        {` ${verb} `}
        <Link href={href} as={hrefAs}>
          <a className={css(styles.link)} onClick={(e) => e.stopPropagation()}>
            {subject.linkText}
          </a>
        </Link>
        <em>{subject.plainText}</em>
        {preposition ? (
          <Fragment>
            {" in "}
            <Link href={href} as={hrefAs}>
              <a
                className={css(styles.paper)}
                data-tip={postTitle}
                onClick={(e) => e.stopPropagation()}
              >
                {preposition.linkText}
              </a>
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
    let notificationType = content_type;
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

        let formattedSupportType;
        let href;
        let as;
        let title;
        let plainText;
        let doc;
        if (supportType === "paper") {
          formattedSupportType = "paper";
          href = "/paper/[paperId]/[paperName]";
          as = `/paper/${sourceId}/${slug}`;
          title = notification.item.source.paper_title;
        } else if (supportType === "researchhubpost") {
          formattedSupportType = "post";
          href = "/post/[documentId]/[title]";
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

          if (commentOnPaper) {
            doc = unifiedDocument.documents;
          } else {
            doc = unifiedDocument.documents[0];
          }

          formattedSupportType = "comment";
          plainText = this.truncateComment(notification.item.source.plain_text);
          href = commentOnPaper
            ? "/paper/[paperId]/[paperName]"
            : "/post/[documentId]/[title]";
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
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {username}
              </a>
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
            >
              <a
                className={css(styles.username)}
                onClick={(e) => e.stopPropagation()}
              >
                {recipientName}
              </a>
            </Link>
            {` for their ${formattedSupportType} `}
            {formattedSupportType === "comment" ? (
              <>
                <em>{plainText}</em>
                {" in "}
              </>
            ) : null}
            <Link href={href} as={as}>
              <a
                className={css(styles.paper)}
                data-tip={title}
                onClick={(e) => e.stopPropagation()}
              >
                {title && this.truncatePaperTitle(title)}
              </a>
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

  promptFlagConfirmation = (e) => {
    e && e.stopPropagation();
    let { alert, auth, openLoginModal } = this.props;
    let { userFlag } = this.state;
    let isLoggedIn = auth.isLoggedIn;

    if (!isLoggedIn) {
      openLoginModal(true, "Please Sign in with Google to continue.");
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
    let { paperId, threadId, commentId, replyId, postId } = metaData;
    let config = this.state.userFlag
      ? API.DELETE_CONFIG()
      : await API.POST_CONFIG({ reason: "censor" });
    fetch(
      API.FLAG_POST({ paperId, threadId, commentId, replyId, postId }),
      config
    )
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
        if (err.response.status === 429) {
          showMessage({ show: false });
          returnthis.props.openRecaptchaPrompt(true);
        }
        showMessage({ show: false });
        setMessage("Something went wrong");
        showMessage({ show: true, error: true });
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
      let unifiedDocument = notification.item.unified_document;
      let document_type = unifiedDocument.document_type;

      if (document_type === "DISCUSSION") {
        metaData.postId = unifiedDocument.documents[0].id;
      } else {
        metaData.paperId = unifiedDocument.documents.id;
      }
    }

    metaData.authorId = notification.created_by.author_profile.id;

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
        return icons.file;
      case "vote_comment":
      case "comment":
        return icons.commentAltDots;
      case "reply":
      case "vote_reply":
        return icons.commentAltDots;
      case "thread":
      case "vote_thread":
        return icons.commentAltLines;
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
                icon={icons.ban}
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
