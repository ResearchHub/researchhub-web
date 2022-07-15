import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { Fragment, useState, useRef } from "react";
import { useAlert } from "react-alert";
import { useRouter } from "next/router";
import * as moment from "dayjs";
import Link from "next/link";
import PropTypes from "prop-types";
import Ripples from "react-ripples";

// Components
import { ClientLinkWrapper } from "~/components/LinkWrapper";
import AuthorAvatar from "~/components/AuthorAvatar";
import WidgetContentSupport from "~/components/Widget/WidgetContentSupport";
import UserRoleTag from "~/components/shared/UserRoleTag";
import ShareModal from "~/components/ShareModal";

// Config
import { createUserSummary } from "~/config/utils/user";
import { timeSince } from "~/config/utils/dates";
import colors, { badgeColors, voteWidgetColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";

// Dynamic modules
import dynamic from "next/dynamic";
import postTypes, { POST_TYPES } from "./TextEditor/config/postTypes";
const ContentSupportModal = dynamic(() =>
  import("./Modals/ContentSupportModal")
);

const DYNAMIC_HREF = "/paper/[paperId]/[paperName]/[discussionThreadId]";
const POST_HREF = "/post/[documentId]/[title]/[discussionThreadId]";

const DiscussionPostMetadata = (props) => {
  const {
    authorProfile,
    containerStyle,
    currentAuthorId,
    data,
    fetching,
    hideHeadline,
    isCreatedByEditor,
    isLoggedIn,
    metaData,
    noTimeStamp,
    twitterUrl,
    username,
  } = props;

  const smaller = false;
  const alert = useAlert();
  // const store = useStore();
  const router = useRouter();

  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const dropdown = useRef();
  const ellipsis = useRef();
  let isUserOwnInlineComment = false;

  if (isLoggedIn) {
    isUserOwnInlineComment = metaData
      ? currentAuthorId === metaData.authorId
      : true;
  }

  const renderHeadline = () => {
    const showHeadline =
      authorProfile &&
      (authorProfile.headline || authorProfile.education) &&
      !hideHeadline;

    if (showHeadline) {
      return (
        <div className={css(styles.headline) + " clamp1"}>
          {createUserSummary(authorProfile)}
        </div>
      );
    }
  };

  const renderBadge = ({ type }) => {
    const postType = postTypes.find((t) => t.value === type);

    if (type === POST_TYPES.REVIEW) {
      return (
        <span className={css(badge.container, badge.review)}>
          <span className={css(badge.icon)}>{icons.starFilled}</span>
          <span className={css(badge.label)}>{postType.label}</span>
        </span>
      );
    }
  };

  const discussionType = data.thread_type;

  let text = "commented";

  if (discussionType === POST_TYPES.REVIEW) {
    text = "peer reviewed";
  }

  return (
    <div className={css(styles.container, containerStyle && containerStyle)}>
      <ContentSupportModal />
      <ShareModal
        isOpen={shareModalIsOpen}
        setIsOpen={setShareModalIsOpen}
        title={"Share this discussion"}
        url={`${process.env.HOST}${router.asPath}#comments`}
      />
      <AuthorAvatar
        author={authorProfile}
        name={username}
        size={smaller ? 25 : 30}
        twitterUrl={twitterUrl}
      />
      <div className={css(styles.column)}>
        <div className={css(styles.firstRow)}>
          <User {...props} />
          {isCreatedByEditor && (
            <UserRoleTag
              backgroundColor={colors.EDITOR_TAG_BACKGROUND}
              color={colors.EDITOR_TAG_TEXT}
              fontSize="12px"
              label="Editor"
              padding="2px 10px"
              margin="0 0 0 8px"
            />
          )}
          {<span className={css(styles.topLineText)}>{text}</span>}

          {/* <WidgetContentSupport
            data={data}
            metaData={metaData}
            fetching={fetching}
          /> */}
          {noTimeStamp ? null : <Timestamp {...props} />}
        </div>
        {/* {renderHeadline()} */}
      </div>
      {renderBadge({ type: discussionType })}
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
  const { username, paper, authorProfile, smaller, twitterUrl } = props;
  let isAuthor;
  let authorId = authorProfile.id; // for the user

  if (paper && paper.authors && paper.authors.length && authorProfile) {
    paper.authors.forEach((author) => {
      if (author.id === authorProfile.id) {
        isAuthor = true;
      }
    });
  }

  return (
    <Link href={"/user/[authorId]/[tabName]"} as={`/user/${authorId}/overview`}>
      <a href={`/user/${authorId}/overview`} className={css(styles.atag)}>
        <div
          className={css(
            styles.userContainer,
            smaller && styles.smallerUserContainer
          )}
        >
          <div
            className={css(
              styles.name,
              smaller && styles.smallerName,
              isAuthor && styles.authorName
            )}
          >
            {username}
          </div>
          {isAuthor && <div className={css(styles.status)}>Author</div>}
        </div>
      </a>
    </Link>
  );
};

const Timestamp = (props) => {
  const timestamp = formatTimestamp(props);

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
          rel="noreferrer noopener"
        >
          <span
            className={css(
              styles.timestampDivider,
              props.smaller && styles.smallerTimestamp
            )}
          >
            •
          </span>
          {timestamp} from Twitter
          <div className={css(styles.twitterIcon)}>{icons.twitter}</div>
        </a>
      </div>
    );
  }

  return (
    <div className={css(styles.timestampContainer)}>
      <span
        className={css(
          styles.timestampDivider,
          props.smaller && styles.smallerTimestampDivider
        )}
      >
        •
      </span>
      {timestamp}
    </div>
  );
};

function formatTimestamp(props) {
  let { date } = props;
  date = new Date(date);
  if (isNaN(date)) {
    return null;
  }
  if (props.fullDate) {
    return moment(date).format("MMM D, YYYY");
  }

  return timeSince(date);
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
          {hideState ? icons.eyeSlash : icons.eye}
        </span>
        <span className={css(styles.text)} id={"hideText"}>
          {hideState ? "Show" : "Hide"}
        </span>
      </div>
    </Fragment>
  );
};

const ExpandButton = (props) => {
  let { threadPath, metaData } = props;

  return (
    <Ripples className={css(styles.dropdownItem)}>
      <ClientLinkWrapper
        dynamicHref={metaData.postId ? POST_HREF : DYNAMIC_HREF}
        path={threadPath}
      >
        <span className={css(styles.icon, styles.expandIcon)} id={"expandIcon"}>
          {icons.expandArrows}
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

const badge = StyleSheet.create({
  review: {
    background: colors.ORANGE(),
    color: "white",
  },
  container: {
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 2,
    textTransform: "uppercase",
    marginLeft: "auto",
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontWeight: 500,
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  topLineText: {
    color: colors.MEDIUM_GREY2(),
    fontWeight: 400,
    fontSize: 15,
    marginLeft: 8,
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    whiteSpace: "",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // width: "100%",
  },

  firstRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  userContainer: {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
    alignItems: "center",
    fontWeight: 500,
    "@media only screen and (max-width: 436px)": {
      fontSize: 14,
    },
  },
  atag: {
    cursor: "pointer",
    textDecoration: "unset",
    color: "unset",
  },
  smallerUserContainer: {
    // fontSize: 13,
  },
  timestampContainer: {
    display: "flex",
    alignItems: "center",
    fontWeight: "normal",
    color: colors.MEDIUM_GREY2(),
    fontSize: 15,
    fontWeight: 400,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 10,
    },
  },
  smallerTimestamp: {
    fontSize: 12,
    marginRight: 8,
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
    fontSize: 15,
    "@media only screen and (max-width: 767px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
  smallerName: {},
  authorName: {
    fontWeight: 500,
  },
  status: {
    marginLeft: 10,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 500,
    backgroundColor: voteWidgetColors.BACKGROUND,
    color: "#056d4e",
    padding: "2px 10px",
  },
  headline: {
    marginTop: 2,
    marginLeft: 8,
    color: colors.MEDIUM_GREY(),
    fontWeight: 400,
    fontSize: 14,

    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  timestampDivider: {
    fontSize: 16,
    padding: "0px 8px",
    color: colors.GREY(1),
    "@media only screen and (max-width: 767px)": {
      padding: "0px 8px",
    },
  },
  smallerTimestampDivider: {
    fontSize: 12,
    padding: "0 8px",
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
    marginLeft: "auto",
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
  editorTag: {
    color: colors.TEXT_GREY,
  },
});

// TODO: Change this to useSelector
const mapStateToProps = ({ auth }) => ({
  isLoggedIn: auth.isLoggedIn,
  isModerator: auth.user.moderator,
  currentUser: auth.user,
  currentAuthorId:
    auth.user && auth.user.author_profile ? auth.user.author_profile.id : null,
});

export default connect(mapStateToProps)(DiscussionPostMetadata);
