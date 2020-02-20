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

import { PaperActions } from "~/redux/paper";

const PaperEntryCard = ({
  paper,
  index,
  hubName,
  discussionCount,
  mobileView,
  style,
  searchResult,
  voteCallback,
  postUpvote,
  postDownvote,
}) => {
  let {
    id,
    authors,
    discussion,
    discussion_count,
    hubs,
    paper_publish_date,
    title,
    tagline,
    user_vote,
    score,
  } = paper || null;

  let selected = null;
  let vote_type = 0;
  if (discussion_count == undefined) {
    discussion_count = discussionCount;
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

  /**
   * When the paper is upvoted, update our UI to reflect that as well
   * @param { Integer } index -- the index of the paper to upvote
   */
  async function onUpvote(e) {
    e.stopPropagation();
    let curPaper = { ...paper };
    postUpvote(curPaper.id);
    if (curPaper.user_vote) {
      curPaper.score += 2;
    } else {
      curPaper.score += 1;
    }
    curPaper.user_vote = {
      vote_type: UPVOTE_ENUM,
    };
    selected = UPVOTE;

    voteCallback(index, curPaper);
  }

  /**
   * When the paper is downvoted, update our UI to reflect that as well
   * @param { Integer } index -- the index of the paper to downvote
   */
  async function onDownvote(e) {
    e.stopPropagation();
    let curPaper = { ...paper };
    postDownvote(curPaper.id);
    if (curPaper.user_vote) {
      curPaper.score -= 2;
    } else {
      curPaper.score -= 1;
    }
    curPaper.user_vote = {
      vote_type: DOWNVOTE_ENUM,
    };
    selected = DOWNVOTE;

    voteCallback(index, curPaper);
  }

  function renderDiscussionCount() {
    return `${discussion_count} ${
      discussion_count === 1 ? "discussion" : "discussions"
    }`;
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
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              selected={selected}
              horizontalView={true}
              isPaper={true}
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
                        key={`author_${author.id}_${id}`}
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
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                selected={selected}
                searchResult={searchResult}
                isPaper={true}
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
                      <div
                        key={`author_${author.id}_${id}`}
                        className={css(styles.avatar)}
                      >
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
    textOverflow: "ellipsis",
    marginBottom: 15,
    padding: 0,
  },
  voting: {
    marginBottom: 15,
  },
  publishDate: {
    height: 16,
    marginBottom: 15,
    "@media only screen and (max-width: 416px)": {
      fontSize: 12,
    },
  },
  summary: {
    marginBottom: 15,
    textOverflow: "ellipsis",
    width: "calc(100% - 15px)",
    overflow: "hidden",
  },
  hide: {
    display: "none",
  },
  bottomBar: {
    marginBottom: 15,
    // overflowX: "scroll",
    paddingTop: 2,
  },
  discussionCount: {
    "@media only screen and (max-width: 416px)": {
      fontSize: 12,
    },
  },
  tags: {
    // overflowX: "scroll",
  },
});

const styles = StyleSheet.create({
  papercard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "27px 15px 27px 15px",
    boxSizing: "border-box",
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
    marginBottom: 10,
  },
  publishDate: {
    maxWidth: "100%",
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
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
  postUpvote: PaperActions.postUpvote,
  postDownvote: PaperActions.postDownvote,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperEntryCard);
