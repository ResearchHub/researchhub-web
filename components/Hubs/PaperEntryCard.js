import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import VoteWidget from "../VoteWidget";
import AuthorAvatar from "~/components/AuthorAvatar";
import HubTag from "./HubTag";
import TextEditor from "../TextEditor/index";

// Utility
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { convertNumToMonth } from "~/config/utils/options";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "~/config/constants";

// Redux
import * as VoteActions from "~/redux/vote/actions";

const PaperEntryCard = ({
  paper,
  index,
  hubName,
  onUpvote,
  onDownvote,
  mobileView,
}) => {
  const {
    id,
    authors,
    discussion,
    hubs,
    paper_publish_date,
    title,
    tagline,
    user_vote,
    score,
  } = paper;
  let selected = null;
  let vote_type = 0;

  if (user_vote) {
    vote_type = user_vote.vote_type;
    if (vote_type === UPVOTE_ENUM) {
      selected = UPVOTE;
    } else if (vote_type === DOWNVOTE_ENUM) {
      selected = DOWNVOTE;
    }
  }

  function convertDate() {
    let dateArr = paper_publish_date.split("-");
    dateArr[1] = convertNumToMonth[dateArr[1]];
    if (dateArr.length > 2) {
      return `Published: ${dateArr[0]} ${dateArr[1]}, ${dateArr[2]}`;
    } else {
      return `Published: ${dateArr[1]}, ${dateArr[2]}`;
    }
  }

  async function upvote(e) {
    e.stopPropagation();
    onUpvote({ index });
  }

  async function downvote(e) {
    e.stopPropagation();
    onDownvote({ index });
  }

  if (mobileView) {
    return (
      <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
        <div
          className={css(mobileStyles.papercard)}
          key={`${id}-${index}-${title}`}
        >
          <div className={css(mobileStyles.title, styles.text)}>
            {title && title}
          </div>
          <span
            className={css(mobileStyles.voting)}
            onClick={(e) => e.stopPropagation()}
          >
            <VoteWidget
              score={score}
              onUpvote={upvote}
              onDownvote={downvote}
              selected={selected}
              horizontalView={true}
            />
          </span>
          <div
            className={css(
              styles.publishDate,
              styles.text,
              mobileStyles.publishDate
            )}
          >
            {convertDate()}
          </div>
          <div
            className={css(
              mobileStyles.summary,
              styles.text,
              !tagline && mobileStyles.hide
            )}
          >
            {tagline && tagline}
          </div>
          <div className={css(styles.bottomBar, mobileStyles.bottomBar)}>
            <div className={css(styles.row)}>
              <span
                className={css(
                  styles.avatars,
                  authors.length < 1 && styles.hide
                )}
              >
                {authors.length > 0 &&
                  authors.map((author) => (
                    <AuthorAvatar
                      key={`author_${author.id}_${id}`}
                      avatarClassName={css(styles.avatar)}
                      size={30}
                      textSizeRatio={2.5}
                      author={author}
                    />
                  ))}
              </span>
              <Link
                href={"/paper/[paperId]/[tabName]"}
                as={`/paper/${id}/discussion`}
              >
                <div className={css(styles.discussion)}>
                  <span className={css(styles.icon)} id={"discIcon"}>
                    {icons.chat}
                  </span>
                  <span
                    className={css(
                      styles.dicussionCount,
                      mobileStyles.discussionCount
                    )}
                    id={"discCount"}
                  >
                    {`${discussion.count}`}{" "}
                    {discussion.count === 1 ? "discussion" : "discussions"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className={css(styles.tags, mobileStyles.tags)}>
            {hubs.length > 0 &&
              hubs.map((tag, index) => (
                <HubTag key={`hub_${index}`} tag={tag} hubName={hubName} />
              ))}
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
        <div className={css(styles.papercard)} key={`${id}-${index}-${title}`}>
          <div className={css(styles.column)}>
            <span
              className={css(styles.voting)}
              onClick={(e) => e.stopPropagation()}
            >
              <VoteWidget
                score={score}
                onUpvote={upvote}
                onDownvote={downvote}
                selected={selected}
              />
            </span>
          </div>
          <div className={css(styles.column, styles.metaData)}>
            <div className={css(styles.title, styles.text)}>
              {title && title}
            </div>
            <div className={css(styles.publishDate, styles.text)}>
              {convertDate()}
            </div>
            <div className={css(styles.summary, styles.text)}>
              {tagline ? tagline : null}
            </div>
            <div className={css(styles.bottomBar)}>
              <div className={css(styles.row)}>
                <span
                  className={css(
                    styles.avatars,
                    authors.length < 1 && styles.hide
                  )}
                >
                  {authors.length > 0 &&
                    authors.map((author) => (
                      <AuthorAvatar
                        key={`author_${author.id}_${id}`}
                        avatarClassName={css(styles.avatar)}
                        size={30}
                        textSizeRatio={2.5}
                        author={author}
                      />
                    ))}
                </span>
                <Link
                  href={"/paper/[paperId]/[tabName]"}
                  as={`/paper/${id}/discussion`}
                >
                  <div className={css(styles.discussion)}>
                    <span
                      className={css(styles.icon, mobileStyles.icon)}
                      id={"discIcon"}
                    >
                      {icons.chat}
                    </span>
                    <span
                      className={css(styles.dicussionCount)}
                      id={"discCount"}
                    >
                      {`${discussion.count}`}{" "}
                      {discussion.count === 1 ? "discussion" : "discussions"}
                    </span>
                  </div>
                </Link>
              </div>
              <div className={css(styles.tags)}>
                {hubs.length > 0 &&
                  hubs.map((tag, index) => (
                    <HubTag key={`hub_${index}`} tag={tag} hubName={hubName} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
};

const mobileStyles = StyleSheet.create({
  papercard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxHeight: 513,
    // width: '100%',
    padding: 30,
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    maxHeight: 72,
    textOverflow: "ellipsis",
    margin: 0,
    padding: 0,
  },
  voting: {
    margin: "15px 0 15px 0",
  },
  publishDate: {
    height: 16,
    margin: 0,
    "@media only screen and (max-width: 416px)": {
      fontSize: 12,
    },
  },
  summary: {
    maxHeight: 176,
    marginTop: 15,
    textOverflow: "ellipsis",
    width: "calc(100% - 15px)",
    overflow: "hidden",
  },
  hide: {
    display: "none",
  },
  bottomBar: {
    margin: "15px 0 15px 0",
    overflowX: "scroll",
  },
  discussionCount: {
    "@media only screen and (max-width: 416px)": {
      fontSize: 12,
    },
  },
  tags: {
    overflowX: "scroll",
  },
});

const styles = StyleSheet.create({
  papercard: {
    // width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "27px 15px 27px 15px",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  title: {
    maxWidth: "95%",
    fontSize: 22,
    fontWeight: 500,
  },
  publishDate: {
    maxWidth: "100%",
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
    marginTop: 10,
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    maxHeight: 90,
    whiteSpace: "pre-wrap",
    color: "#4e4c5f",
    fontSize: 16,
    marginTop: 15,
    overflow: "hidden",
  },
  text: {
    fontFamily: "Roboto",
  },
  voting: {
    marginTop: -20,
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    left: 0,
    marginTop: 16,
    bottom: 10,
    width: "100%",
  },
  icon: {
    color: "#C1C1CF",
  },
  discussion: {
    cursor: "pointer",
    ":hover #discIcon": {
      color: colors.BLUE(1),
    },
    ":hover #discCount": {
      color: colors.BLUE(1),
    },
  },
  dicussionCount: {
    color: "#918f9b",
    marginLeft: 7,
  },
  tags: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    display: "flex",
    alignItems: "center",
    height: 30,
  },
  avatars: {
    display: "flex",
    justifyContent: "flex-start",
    marginRight: 16,
    // width: 105
  },
  avatar: {
    marginRight: 5,
  },
  hide: {
    display: "none",
    marginRight: 0,
  },
  metaData: {
    width: "calc(100% - 48px)",
    // minHeight: 130,
  },
});

const mapStateToProps = ({ vote }) => ({
  vote,
});

const mapDispatchToProps = {
  // postUpvote: VoteActions.postUpvote,
  // postUpvotePending: VoteActions.postUpvotePending,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperEntryCard);
