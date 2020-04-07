import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";
import { StyleSheet, css } from "aphrodite";
import Carousel from "nuka-carousel";
import Ripples from "react-ripples";
import FsLightbox from "fslightbox-react";
import "react-placeholder/lib/reactPlaceholder.css";
import "~/components/Paper/CitationCard.css";

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
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

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
    bullet_points,
    discussion,
    discussion_count,
    hubs,
    paper_publish_date,
    title,
    tagline,
    user_vote,
    score,
    paper_title,
    first_figure,
    first_preview,
  } = paper || null;

  let selected = null;
  let vote_type = 0;
  const [hovered, toggleHover] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightbox, toggleLightbox] = useState(false);
  const [bullets, setBullets] = useState([]);
  const [slideIndex, setSlideIndex] = useState(1);
  const [previews, setPreviews] = useState(
    configurePreview([
      first_figure && first_figure,
      first_preview && first_preview,
    ])
  );
  const [figures, setFigures] = useState(
    previews.map((preview, index) => preview.file)
  );

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

  function configurePreview(arr, setFigures) {
    return arr.filter((el) => {
      return el !== null;
    });
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

  function navigateToPage(e) {
    e.preventDefault();
    e.stopPropagation();
    Router.push("/paper/[paperId]/[tabName]", `/paper/${id}/summary`);
  }

  function renderDiscussionCount() {
    return `${discussion_count} ${
      discussion_count === 1 ? "Discussion" : "Discussions"
    }`;
  }

  const renderBullet = () => {
    if (bullet_points.length > 0) {
      return (
        <div className={css(styles.summary, styles.text)}>
          <ul className={css(styles.bulletpoints)}>
            {bullet_points.map((bullet, i) => {
              if (i < 3) {
                return (
                  <li
                    key={`bullet-${bullet.id}`}
                    className={css(styles.bullet)}
                  >
                    {bullet.plain_text}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    } else if (tagline) {
      return (
        <div className={css(styles.summary, styles.text)}>
          <div className={css(styles.bullet)} id={"clamp2"}>
            {tagline && tagline}
          </div>
        </div>
      );
    }
  };

  const renderPreview = () => {
    if (previews.length > 0) {
      return (
        <div
          className={css(styles.column)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className={css(styles.preview)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLightbox(!lightbox);
            }}
          >
            <Carousel
              afterSlide={(slideIndex) => setSlideIndex(slideIndex + 1)}
              renderBottomCenterControls={(arg) => {
                let {
                  currentSlide,
                  slideCount,
                  previousSlide,
                  nextSlide,
                } = arg;
                return (
                  <div
                    className={css(
                      carousel.bottomControl,
                      hovered && carousel.show
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        previousSlide(e);
                      }}
                      className={css(
                        carousel.button,
                        carousel.left,
                        hovered && carousel.show
                      )}
                    >
                      <i className="far fa-angle-left" />
                    </span>
                    {`${currentSlide + 1} / ${slideCount}`}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        nextSlide(e);
                      }}
                      className={css(
                        carousel.button,
                        carousel.right,
                        hovered && carousel.show
                      )}
                    >
                      <i className="far fa-angle-right" />
                    </span>
                  </div>
                );
              }}
              renderCenterLeftControls={null}
              renderCenterRightControls={null}
              wrapAround={true}
              enableKeyboardControls={true}
            >
              {previews.map((preview) => {
                if (preview) {
                  return (
                    <img src={preview.file} className={css(carousel.image)} />
                  );
                }
              })}
            </Carousel>
          </div>
        </div>
      );
    }
  };

  // if (mobileView) {
  if (false) {
    return (
      <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
        <a className={css(styles.link)}>
          <div
            className={css(mobileStyles.papercard, style && style)}
            key={`${id}-${index}-${title}`}
          >
            <div className={css(mobileStyles.title, styles.text)}>
              {title && title}
            </div>
            {paper_title !== title && paper_title && (
              <div
                className={css(
                  styles.paperTitle,
                  styles.text,
                  styles.publishDate
                )}
              >
                From Paper: {paper_title && paper_title}
              </div>
            )}
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
              {/* {tagline && tagline} */}
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
                      <HubTag
                        key={`hub_${index}`}
                        tag={tag}
                        hubName={hubName}
                      />
                    )
                )}
            </div>
          </div>
        </a>
      </Link>
    );
  } else {
    return (
      // <Link href={"/paper/[paperId]/[tabName]"} as={`/paper/${id}/summary`}>
      // <a
      //   className={css(styles.link)}
      //   onClick={e => false}
      //   href={`/paper/${id}/summary`}
      // >
      <Ripples
        className={css(styles.papercard, style && style)}
        key={`${id}-${index}-${title}`}
        onMouseEnter={() => !hovered && toggleHover(true)}
        onMouseLeave={() => hovered && toggleHover(false)}
        onClick={navigateToPage}
      >
        {figures.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <FsLightbox
              toggler={lightbox}
              type="image"
              sources={[...figures]}
              slide={slideIndex}
            />
          </div>
        )}
        <a className={css(styles.link)} href={`/paper/${id}/summary`}>
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
                styles={styles.voteWidget}
              />
            </span>
          </div>
          <div
            className={css(
              styles.column,
              styles.metaData,
              previews.length > 0 && styles.metaDataPreview
            )}
          >
            <div className={css(styles.title, styles.text)}>
              {title && title}
              {paper_title !== title && paper_title && (
                <div
                  className={css(styles.paperTitle, styles.text)}
                  id={"clamp1"}
                >
                  From Paper: {paper_title && paper_title}
                </div>
              )}
            </div>
            {renderBullet()}
            <div
              className={css(
                styles.publishContainer,
                !paper_publish_date && styles.hide
              )}
            >
              <span className={css(styles.publishDate, styles.text)}>
                {paper_publish_date && convertDate()}
              </span>
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
                        size={25}
                        textSizeRatio={2.5}
                        author={author}
                      />
                    </div>
                  ))}
              </span>
            </div>
            <div className={css(styles.bottomBar)}>
              <div className={css(styles.row)}>
                <Link
                  href={"/paper/[paperId]/[tabName]"}
                  as={`/paper/${id}/summary#discussions`}
                >
                  <a className={css(styles.link)}>
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
                  </a>
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
                          last={index === hubs.length - 1}
                          gray={true}
                          labelStyle={styles.hubLabel}
                        />
                      )
                  )}
              </div>
            </div>
          </div>
        </a>
        {renderPreview()}
      </Ripples>
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
    // padding: "27px 15px 27px 15px",
    padding: 15,
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
  paperTitle: {
    color: "rgb(145, 143, 155)",
    marginTop: 5,
    fontSize: 12,
    fontWeight: 400,
    color: "#918F9B",
  },
  preview: {
    height: 90,
    maxHeight: 90,
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    fontSize: 18,
    fontWeight: 500,
    paddingBottom: 8,
  },
  publishContainer: {
    maxWidth: "100%",
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
  },
  publishDate: {
    fontSize: 12,
    fontWeight: 400,
    color: "#918F9B",
    marginRight: 15,
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    whiteSpace: "pre-wrap",
    color: "#4e4c5f",
    fontSize: 16,
    paddingBottom: 8,
  },
  text: {
    fontFamily: "Roboto",
  },
  voting: {
    // marginTop: -20,
    width: 65,
  },
  voteWidget: {
    marginRight: 15,
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    left: 0,
    bottom: -10,
    width: "100%",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },
  icon: {
    color: "#C1C1CF",
  },
  discussion: {
    cursor: "pointer",
    minWidth: 140,
    fontSize: 12,
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
    minHeight: 72,
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    paddingRight: 15,
    justifyContent: "space-between",
    // position: 'relative'
  },
  metaDataPreview: {
    minHeight: 90,
  },
  hide: {
    display: "none",
  },
  bulletpoints: {
    margin: 0,
    padding: 0,
    paddingLeft: 15,
  },
  bullet: {
    margin: 0,
    padding: 0,
    fontSize: 12,
  },
  hubLabel: {
    fontSize: 9,
  },
});

const carousel = StyleSheet.create({
  bottomControl: {
    background: "rgba(36, 31, 58, 0.65)",
    borderRadius: 230,
    height: 30,
    minWidth: 60,
    color: "#FFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    opacity: 0,
    fontSize: 9,
    transition: "all ease-out 0.3s",
  },
  button: {
    border: 0,
    textTransform: "uppercase",
    cursor: "pointer",
    opacity: 0,
    transition: "all ease-out 0.3s",
    fontSize: 18,
    userSelect: "none",
    paddingTop: 1,
    color: "rgba(255, 255, 255, 0.45)",
    ":hover": {
      color: "#FFF",
    },
  },
  left: {
    marginLeft: 8,
    marginRight: 5,
  },
  right: {
    marginRight: 8,
    marginLeft: 5,
  },
  pointer: {
    cursor: "not-allowed",
  },
  show: {
    opacity: 1,
  },
  image: {
    objectFit: "contain",
    maxHeight: 90,
    height: 90,
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
