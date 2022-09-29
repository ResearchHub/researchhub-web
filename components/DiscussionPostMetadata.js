import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { useState, useRef } from "react";
import { useAlert } from "react-alert";
import { useRouter } from "next/router";
import * as moment from "dayjs";
import Link from "next/link";
import PropTypes from "prop-types";

// Components
import AuthorAvatar from "~/components/AuthorAvatar";
import WidgetContentSupport from "~/components/Widget/WidgetContentSupport";
import UserRoleTag from "~/components/shared/UserRoleTag";
import ShareModal from "~/components/ShareModal";

// Config
import { createUserSummary } from "~/config/utils/user";
import { timeSince } from "~/config/utils/dates";
import colors, { voteWidgetColors } from "~/config/themes/colors";
import icons from "~/config/themes/icons";

// Dynamic modules
import dynamic from "next/dynamic";
import postTypes, {
  POST_TYPES,
  questionPostTypes,
} from "./TextEditor/config/postTypes";
import { breakpoints } from "~/config/themes/screen";
import { formatBountyAmount } from "~/config/types/bounty";
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
    bounties,
    awardedBountyAmount,
    isAcceptedAnswer,
    bountyType,
    commentBounties,
  } = props;

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

  const renderBadge = ({ type, isAcceptedAnswer = false, bounties = [] }) => {
    const openBounty =
      bounties.find((b) => b.status === "OPEN") && bountyType !== "question";
    if (openBounty) {
      return (
        <div className={css(styles.badgeContainer)}>
          <span className={css(badge.container, badge.bounty)}>
            <span className={css(badge.label)}>Open Bounty</span>
          </span>
        </div>
      );
    } else if (type === POST_TYPES.REVIEW || type === POST_TYPES.SUMMARY) {
      const postType = postTypes.find((t) => t.value === type);
      return (
        <div className={css(styles.badgeContainer)}>
          <span className={css(badge.container, badge.review)}>
            <span className={css(badge.icon)}>{postType.icon}</span>
            <span className={css(badge.label)}>{postType.label}</span>
          </span>
        </div>
      );
    } else if (type === POST_TYPES.ANSWER || isAcceptedAnswer) {
      const postType = questionPostTypes.find((t) => t.value === type);
      return (
        <div className={css(styles.badgeContainer)}>
          <span
            className={css(
              badge.container,
              badge.answer,
              isAcceptedAnswer && badge.acceptedAnswer
            )}
          >
            <span className={css(badge.icon)}>
              {isAcceptedAnswer ? icons.check : postType.icon}
            </span>
            <span className={css(badge.label)}>ANSWER</span>
          </span>
        </div>
      );
    }
  };

  const discussionType = data.discussion_post_type;

  let text = "commented";

  if (discussionType === POST_TYPES.REVIEW) {
    text = "peer reviewed";
  } else if (discussionType === POST_TYPES.ANSWER) {
    text = "answered";
  } else if (discussionType === POST_TYPES.SUMMARY) {
    text = "posted summary";
  } else if (
    bounties &&
    bounties.length > 0 &&
    bounties[0].status === "CLOSED"
  ) {
    text = (
      <span>
        awarded{" "}
        <span className={css(styles.strong)}>
          {formatBountyAmount({
            amount: bounties[0].amount,
          })}{" "}
          RSC
        </span>
      </span>
    );
  } else if (commentBounties && commentBounties.length > 0) {
    text = (
      <span>
        is offering{" "}
        <span className={css(styles.strong)}>
          {formatBountyAmount({
            amount: commentBounties[0].amount,
          })}{" "}
          RSC
        </span>
      </span>
    );
  }
  return (
    <div className={css(styles.container, containerStyle && containerStyle)}>
      <div className={css(styles.authorDetails)}>
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
          size={30}
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
            {
              <span className={css(styles.topLineText, styles.action)}>
                {text}
              </span>
            }
            {noTimeStamp ? null : <Timestamp {...props} />}
            <span className={css(styles.divider)}>•</span>
            <WidgetContentSupport
              data={data}
              metaData={metaData}
              fetching={fetching}
              awardedBountyAmount={awardedBountyAmount}
            />
          </div>
          {/* {renderHeadline()} */}
        </div>
      </div>
      {renderBadge({
        type: discussionType,
        isAcceptedAnswer: isAcceptedAnswer || data.is_accepted_answer,
        bounties: commentBounties,
      })}
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
  const { username, paper, authorProfile } = props;
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
        <div className={css(styles.userContainer)}>
          <div
            className={css(
              styles.topLineText,
              styles.name,
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
      <div className={css(styles.topLineText, styles.timestampContainer)}>
        <a
          target="_blank"
          href={props.twitterUrl}
          className={css(styles.twitterTag)}
          rel="noreferrer noopener"
        >
          <span className={css(styles.divider)}>•</span>
          {timestamp} from Twitter
          <div className={css(styles.twitterIcon)}>{icons.twitter}</div>
        </a>
      </div>
    );
  }

  return (
    <div className={css(styles.topLineText, styles.timestampContainer)}>
      <span className={css(styles.divider)}>•</span>
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

const badge = StyleSheet.create({
  review: {},
  bounty: {
    background: colors.ORANGE_DARK(1),
    color: "white",
    display: "unset",
  },
  answer: {
    background: colors.NEW_GREEN(0.1),
    color: colors.NEW_GREEN(),
  },
  acceptedAnswer: {
    background: colors.NEW_GREEN(),
    color: "white",
  },
  container: {
    background: colors.LIGHT_GREY(),
    color: colors.BLACK(),
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 3,
    textTransform: "uppercase",
    marginLeft: "auto",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "6px 15px",
    },
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
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
    },
  },
  expiryDate: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 15,
    fontWeight: 400,
    fontSize: 15,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 14,
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  action: {
    marginLeft: 6,
    [`@media only screen and (max-width: 615px)`]: {
      display: "none",
    },
  },
  tipAuthorText: {
    marginLeft: 0,
  },
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    whiteSpace: "",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  authorDetails: {
    display: "flex",
    alignItems: "center",
  },
  badgeContainer: {
    marginLeft: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "inline-block",
      marginTop: 15,
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 8,
    // width: "100%",
  },

  firstRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gap: "6px 0px",
    },
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
  timestampContainer: {
    display: "flex",
    alignItems: "center",
    fontWeight: "normal",
    color: colors.MEDIUM_GREY2(),
    fontWeight: 400,
    margin: 0,
  },
  twitterTag: {
    color: "unset",
    textDecoration: "unset",
    display: "flex",
    alignItems: "center",
  },
  name: {
    color: colors.BLACK(1),
    fontWeight: 500,
  },
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
  divider: {
    fontSize: 16,
    padding: "0px 8px",
    color: colors.GREY(1),
    "@media only screen and (max-width: 767px)": {
      padding: "0px 8px",
    },
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
  strong: {
    color: "#111",
    fontWeight: 500,
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
