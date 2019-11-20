import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";

// Components
import VoteWidget from "../VoteWidget";
import AuthorAvatar from "~/components/AuthorAvatar";
import HubTag from "./HubTag";

// Utility
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "~/config/constants";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { formatPublishedDate } from "~/config/utils";
import { transformDate } from "~/redux/utils";

const PaperEntryCard = ({
  paper,
  index,
  hubName,
  onUpvote,
  onDownvote,
  discussionCount,
  mobileView,
  style,
  searchResult,
}) => {
  let {
    id,
    authors,
    discussion,
    hubs,
    paper_publish_date,
    title,
    tagline,
    user_vote,
    score,
  } = paper || null;

  let selected = null;
  let vote_type = 0;
  let discussion_count = null;

  if (discussionCount !== undefined) {
    discussion_count = discussionCount;
  } else if (discussion) {
    discussion_count = discussion.count;
  }

  if (user_vote) {
    vote_type = user_vote.vote_type;
    if (vote_type === UPVOTE_ENUM) {
      selected = UPVOTE;
    } else if (vote_type === DOWNVOTE_ENUM) {
      selected = DOWNVOTE;
    }
  }

  function convertDate() {
    return formatPublishedDate(transformDate(paper.paper_publish_date));
  }

  async function upvote(e) {
    e.stopPropagation();
    if (onUpvote) {
      onUpvote({ index });
    }
  }

  async function downvote(e) {
    e.stopPropagation();
    if (onDownvote) {
      onDownvote({ index });
    }
  }

  function renderDiscussionCount() {
    if (discussion) {
      return `${discussion.count} ${
        discussion.count === 1 ? "discussion" : "discussions"
      }`;
    }
  }

  if (mobileView) {
    return (
      <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
        <div
          className={css(mobileStyles.papercard, style && style)}
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
              mobileStyles.publishDate,
              !paper_publish_date && styles.hide
            )}
          >
            {paper_publish_date && convertDate()}
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
              <div
                className={css(
                  styles.avatars,
                  authors.length < 1 && styles.hide
                )}
              >
                {authors.length > 0 &&
                  authors.map((author) => (
                    <div
                      className={css(styles.avatar)}
                      key={`author_${author.id}_${id}_${Math.random()}`}
                    >
                      <AuthorAvatar
                        size={30}
                        textSizeRatio={2.5}
                        author={author}
                      />
                    </div>
                  ))}
              </div>
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
                    {renderDiscussionCount()}
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className={css(styles.tags, mobileStyles.tags)}>
            {hubs.length > 0 &&
              hubs.map(
                (tag, index) =>
                  tag && (
                    <HubTag key={`hub_${index}`} tag={tag} hubName={hubName} />
                  )
              )}
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
        <div
          className={css(styles.papercard, style && style)}
          key={`${id}-${index}-${title}`}
        >
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
                searchResult={searchResult}
              />
            </span>
          </div>
          <div className={css(styles.column, styles.metaData)}>
            <div className={css(styles.title, styles.text)}>
              {title && title}
            </div>
            <div
              className={css(
                styles.publishDate,
                styles.text,
                !paper_publish_date && styles.hide
              )}
            >
              {paper_publish_date && convertDate()}
            </div>
            <div
              className={css(
                styles.summary,
                styles.text,
                !tagline && styles.hide
              )}
            >
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
                      <div className={css(styles.avatar)}>
                        <AuthorAvatar
                          key={`author_${author.id}_${id}`}
                          size={30}
                          textSizeRatio={2.5}
                          author={author}
                        />
                      </div>
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
                      {renderDiscussionCount()}
                    </span>
                  </div>
                </Link>
              </div>
              <div className={css(styles.tags)}>
                {hubs.length > 0 &&
                  hubs.map(
                    (tag, index) =>
                      tag && (
                        <HubTag
                          key={`hub_${index}`}
                          tag={tag}
                          hubName={hubName}
                          last={index === tag.length - 1}
                        />
                      )
                  )}
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
    padding: 30,
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,

    "@media only screen and (max-width: 767px)": {
      maxHeight: "unset",
    },
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
    paddingTop: 2,
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
    marginBottom: 15,
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    whiteSpace: "pre-wrap",
    color: "#4e4c5f",
    fontSize: 16,
    marginBottom: 16,
  },
  text: {
    fontFamily: "Roboto",
  },
  voting: {
    marginTop: -20,
    width: 65,
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    left: 0,
    // marginTop: 16,
    bottom: 10,
    width: "100%",
  },
  icon: {
    color: "#C1C1CF",
  },
  discussion: {
    cursor: "pointer",
    minWidth: 140,
    ":hover #discIcon": {
      color: colors.BLUE(1),
    },
    ":hover #discCount": {
      color: colors.BLUE(1),
    },
    "@media only screen and (max-width: 967px)": {
      minWidth: "unset",
    },
  },
  dicussionCount: {
    color: "#918f9b",
    marginLeft: 7,
  },
  tags: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    "@media only screen and (max-width: 967px)": {
      justifyContent: "flex-start",
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    // height: 30,
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      height: "unset",
      alignItems: "flex-start",
    },
  },
  avatars: {
    display: "flex",
    justifyContent: "flex-start",
    marginRight: 16,

    "@media only screen and (max-width: 767px)": {
      marginBottom: 5,
      marginTop: 5,
    },
  },
  avatar: {
    marginRight: 5,
  },
  hide: {
    display: "none",
    margin: 0,
  },
  metaData: {
    width: "calc(100% - 48px)",
  },
  hide: {
    display: "none",
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
