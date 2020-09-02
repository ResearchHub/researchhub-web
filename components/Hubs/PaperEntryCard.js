import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { connect, useStore } from "react-redux";
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
import HubDropDown from "./HubDropDown";

// Utility
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "~/config/constants";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { formatPublishedDate, formatPaperSlug } from "~/config/utils";
import { transformDate } from "~/redux/utils";
import { PaperActions } from "~/redux/paper";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const PaperEntryCard = (props) => {
  let {
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
    reduxPaper,
    promotionSummary,
    onClick,
  } = props;
  let {
    id,
    authors,
    bullet_points,
    discussion_count,
    hubs,
    paper_publish_date,
    title,
    abstract,
    user_vote,
    score,
    paper_title,
    first_figure,
    first_preview,
    uploaded_by,
    external_source,
    promoted,
    raw_authors,
    slug,
  } = paper || null;
  let vote_type = 0;
  let selected = setVoteSelected(paper.user_vote);
  const [lightbox, toggleLightbox] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const [isOpen, setIsOpen] = useState(false); // Hub dropdown
  const [previews] = useState(
    configurePreview([
      first_preview && first_preview,
      first_figure && first_figure,
    ])
  );
  const [figures, setFigures] = useState(
    previews.map((preview, index) => preview && preview.file)
  );
  const [paperSlug, setPaperSlug] = useState(
    slug ? slug : formatPaperSlug(paper_title ? paper_title : title)
  );
  const store = useStore();

  if (discussion_count == undefined) {
    discussion_count = discussionCount;
  }

  useEffect(() => {
    selected = setVoteSelected(props.paper.user_vote);
  }, [props.paper]);

  function setVoteSelected(userVote) {
    if (userVote) {
      vote_type = userVote.vote_type;
      if (vote_type === UPVOTE_ENUM) {
        return UPVOTE;
      } else if (vote_type === DOWNVOTE_ENUM) {
        return DOWNVOTE;
      }
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

  function navigateToSubmitter(e) {
    e && e.stopPropagation();
    let { author_profile } = uploaded_by;
    let authorId = author_profile && author_profile.id;
    Router.push(
      "/user/[authorId]/[tabName]",
      `/user/${authorId}/contributions`
    );
    onClick && onClick();
  }

  function renderPromoter() {
    return <span className={css(styles.promotion)}>Promoted</span>;
  }

  function renderUploadedBy() {
    if (uploaded_by) {
      let {
        first_name,
        last_name,
        profile_image,
        id,
        user,
      } = uploaded_by.author_profile;
      return (
        <div className={css(styles.uploadedBy)} onClick={navigateToSubmitter}>
          Submitted by{" "}
          <span
            className={css(styles.capitalize)}
          >{`${first_name} ${last_name}`}</span>
        </div>
      );
    } else if (external_source) {
      return (
        <div className={css(styles.uploadedBy)}>
          Retrieved from{" "}
          <span className={css(styles.capitalize)}>{external_source}</span>
        </div>
      );
    } else {
      return (
        <div className={css(styles.uploadedBy)}>Submitted by ResearchHub</div>
      );
    }
  }

  /**
   * When the paper is upvoted, update our UI to reflect that as well
   * @param { Integer } index -- the index of the paper to upvote
   */
  async function onUpvote(e) {
    e.stopPropagation();
    let curPaper = { ...paper };
    await postUpvote(curPaper.id);
    let userVote = store.getState().paper.userVote;
    if (
      userVote.doneFetching &&
      userVote.success &&
      userVote.vote.voteType === "upvote"
    ) {
      if (curPaper.user_vote) {
        curPaper.score += 2;
        if (curPaper.promoted) {
          curPaper.promoted += 2;
        }
      } else {
        curPaper.score += 1;
        if (curPaper.promoted) {
          curPaper.promoted += 1;
        }
      }
      curPaper.user_vote = {
        vote_type: UPVOTE_ENUM,
      };
      selected = UPVOTE;

      voteCallback(index, curPaper);
    }
  }

  /**
   * When the paper is downvoted, update our UI to reflect that as well
   * @param { Integer } index -- the index of the paper to downvote
   */
  async function onDownvote(e) {
    e.stopPropagation();
    let curPaper = { ...paper };
    await postDownvote(curPaper.id);
    let userVote = store.getState().paper.userVote;
    if (
      userVote.doneFetching &&
      userVote.success &&
      userVote.vote.voteType === "downvote"
    ) {
      if (curPaper.user_vote) {
        curPaper.score -= 2;
        if (curPaper.promoted !== false) {
          curPaper.promoted -= 2;
        }
      } else {
        curPaper.score -= 1;
        if (curPaper.promoted !== false) {
          curPaper.promoted -= 1;
        }
      }
      curPaper.user_vote = {
        vote_type: DOWNVOTE_ENUM,
      };
      selected = DOWNVOTE;

      voteCallback(index, curPaper);
    }
  }

  function postEvent() {
    if (promoted) {
      let payload = {
        paper: id,
        paper_is_boosted: true,
        interaction: "CLICK",
        utc: new Date(),
        created_location: "FEED",
        created_location_meta: "trending",
      };

      fetch(API.PROMOTION_STATS({}), API.POST_CONFIG(payload))
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {})
        .catch((err) => {});
    }
  }

  function navigateToPage(e) {
    if (e.metaKey || e.ctrlKey) {
      window.open(`/paper/${id}/${paperSlug}`, "_blank");
    } else {
      postEvent();
      Router.push("/paper/[paperId]/[paperName]", `/paper/${id}/${paperSlug}`);
    }
    onClick && onClick();
  }

  function formatDiscussionCount() {
    return `${discussion_count} ${
      discussion_count === 1 ? "Comment" : "Comments"
    }`;
  }

  const renderDiscussionCount = () => {
    return (
      <Link
        href={"/paper/[paperId]/[paperName]"}
        as={`/paper/${id}/${paperSlug}#comments`}
      >
        <a
          className={css(styles.link)}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={css(styles.discussion)}>
            <span className={css(styles.icon)} id={"discIcon"}>
              {icons.chat}
            </span>
            <span className={css(styles.dicussionCount)} id={"discCount"}>
              {formatDiscussionCount()}
            </span>
          </div>
        </a>
      </Link>
    );
  };

  const renderBullet = () => {
    if (bullet_points && bullet_points.length > 0) {
      return (
        <div className={css(styles.summary, styles.text)}>
          <ul className={css(styles.bulletpoints) + " clamp1"}>
            {bullet_points.map((bullet, i) => {
              if (i < 2) {
                return (
                  <li
                    key={`bullet-${bullet.paper}-${i}`}
                    className={css(styles.bullet)}
                  >
                    <div style={{ overflow: "hidden" }} className={"clamp1"}>
                      {bullet.plain_text}
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    } else if (abstract) {
      return (
        <div className={css(styles.summary, styles.text) + " clamp2"}>
          <div className={css(styles.bullet) + " clamp2"}>{abstract}</div>
        </div>
      );
    }
  };

  const renderPreview = () => {
    if (previews.length > 0) {
      return (
        <div
          className={css(styles.column, styles.previewColumn)}
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
              renderBottomCenterControls={null}
              renderCenterLeftControls={null}
              renderCenterRightControls={null}
              wrapAround={true}
              enableKeyboardControls={true}
            >
              {previews.map((preview, i) => {
                if (preview && i == 0) {
                  return (
                    <img src={preview.file} className={css(carousel.image)} />
                  );
                }
              })}
            </Carousel>
          </div>
        </div>
      );
    } else {
      return (
        <div className={css(styles.column, styles.previewColumn)}>
          <div className={css(styles.preview, styles.previewEmpty)} />
        </div>
      );
    }
  };

  const renderHubTags = () => {
    if (hubs && hubs.length > 0) {
      return (
        <div className={css(styles.tags)}>
          {hubs.map(
            (tag, index) =>
              tag &&
              index < 3 && (
                <HubTag
                  key={`hub_${index}`}
                  tag={tag}
                  hubName={hubName}
                  last={index === hubs.length - 1}
                  gray={false}
                  labelStyle={styles.hubLabel}
                />
              )
          )}
          {hubs.length > 3 && (
            <HubDropDown
              hubs={hubs}
              hubName={hubName}
              labelStyle={styles.hubLabel}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
      );
    }
  };

  const renderRawAuthors = () => {
    const formatAuthors = (authors) => {
      let { first_name, last_name } = authors[0];

      if (authors.length >= 6) {
        return `${last_name}, ${first_name}, et al`;
      }

      return authors
        .map((author) => {
          return `${author.first_name} ${author.last_name}`;
        })
        .join(", ");
    };

    // TODO: make sure raw_authors is in the right format
    if (raw_authors && raw_authors.length) {
      if (!Array.isArray(raw_authors)) {
        raw_authors = [JSON.parse(raw_authors)];
      }
      return (
        <div
          className={css(
            styles.publishContainer,
            styles.publishDate,
            styles.authorContainer
          )}
        >
          <div className={css(styles.publishDate)}>
            {raw_authors.length < 2 ? "Author: " : "Authors: "}
          </div>
          <span className={"clamp1"}>{formatAuthors(raw_authors)}</span>
        </div>
      );
    }
  };

  return (
    <Ripples
      className={css(
        styles.papercard,
        style && style,
        isOpen && styles.overflow
      )}
      key={`${id}-${index}-${title}`}
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
      {!promotionSummary && (
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
              type={"Paper"}
              paper={promoted ? paper : null}
              promoted={promoted}
            />
          </span>
        </div>
      )}
      <div className={css(styles.container)}>
        <div className={css(styles.rowContainer)}>
          <div
            className={css(
              styles.column,
              styles.metaData,
              previews.length > 0 && styles.metaDataPreview
            )}
          >
            <Link
              href={"/paper/[paperId]/[paperName]"}
              as={`/paper/${id}/${paperSlug}`}
            >
              <a
                className={css(styles.link)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={css(styles.title, styles.text)}>
                  {title && title}
                  {paper_title && title !== paper_title && (
                    <div
                      className={
                        css(styles.paperTitle, styles.text) + " clamp1"
                      }
                    >
                      From Paper: {paper_title && paper_title}
                    </div>
                  )}
                </div>
              </a>
            </Link>
            {renderRawAuthors()}
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
                  authors && authors.length < 1 && styles.hide
                )}
              ></span>
            </div>
            {renderBullet()}
            {renderUploadedBy()}
            {mobileView && renderHubTags()}
          </div>
          {!mobileView && renderPreview()}
        </div>
        <div className={css(styles.bottomBar)}>
          <div className={css(styles.row)}>{renderDiscussionCount()}</div>
          {!mobileView && renderHubTags()}
        </div>
      </div>
    </Ripples>
  );
};

const styles = StyleSheet.create({
  papercard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    overflow: "hidden",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  overflow: {
    overflow: "visible",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    minHeight: 72,
  },
  paperTitle: {
    color: "rgb(145, 143, 155)",
    marginTop: 5,
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
  },
  title: {
    width: "100%",
    fontSize: 19,
    fontWeight: 500,
    paddingBottom: 5,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
  },
  previewColumn: {
    paddingBottom: 10,
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
  previewEmpty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "unset",
    backgroundColor: "unset",
    height: "usnet",
    maxHeight: "usnet",
    width: "unset",
    minWidth: "unset",
    maxWidth: "unset",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  publishContainer: {
    maxWidth: "100%",
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
  },
  publishDate: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
    marginRight: 5,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  authorContainer: {
    paddingBottom: 5,
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    color: "#4e4c5f",
    fontSize: 14,
    paddingBottom: 8,
  },
  text: {
    fontFamily: "Roboto",
  },
  voting: {
    width: 65,
  },
  voteWidget: {
    marginRight: 15,
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
  },
  votingLink: {
    width: "unset",
  },
  icon: {
    color: "#C1C1CF",
  },
  discussion: {
    cursor: "pointer",
    minWidth: 100,
    fontSize: 14,
    ":hover #discIcon": {
      color: colors.BLUE(1),
    },
    ":hover #discCount": {
      color: colors.BLUE(1),
    },
    "@media only screen and (max-width: 967px)": {
      minWidth: "unset",
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
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
    "@media only screen and (max-width: 970px)": {
      marginBottom: 15,
      justifyContent: "flex-start",
      width: "100%",
      flexWrap: "wrap",
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
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    paddingRight: 15,
    justifyContent: "space-between",
  },
  metaDataPreview: {},
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
    fontSize: 14,
    display: "list-item",
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  hubLabel: {
    fontSize: 9,
  },
  uploadedBy: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 14,
    color: "rgb(145, 143, 155)",
    fontWeight: 400,
    marginBottom: 8,
    cursor: "pointer",
    whiteSpace: "pre-wrap",
    ":hover": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  uploadedByAvatar: {
    marginLeft: 10,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  rhIcon: {
    height: 20,
  },
  divider: {
    margin: "0px 5px",
  },
  promotion: {
    fontSize: 12,
    fontWeight: 400,
    // textTransform: 'uppercase',
    // fontWeight: 'bold',
    // letterSpacing: 1,
    color: "rgb(145, 143, 155)",
    marginLeft: 15,
    // color: '#FFF',
    // backgroundColor: colors.BLUE(),
    // padding: '3px 10px'
    "@media only screen and (max-width: 767px)": {
      // fontSize: 12,
    },
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
  show: {
    opacity: 1,
  },
  image: {
    objectFit: "contain",
    maxHeight: 90,
    height: 90,
  },
  icon: {
    cursor: "pointer",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  active: {
    color: colors.BLUE(),
  },
});

const mapStateToProps = (state) => ({
  vote: state.vote,
});

const mapDispatchToProps = {
  postUpvote: PaperActions.postUpvote,
  postDownvote: PaperActions.postDownvote,
  updatePaperState: PaperActions.updatePaperState,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperEntryCard);
