import React, { useState, useEffect, Fragment } from "react";
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
import AuthorAvatar from "../AuthorAvatar";

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
    summary,
    paper_title,
    first_figure,
    first_preview,
    uploaded_by,
    external_source,
    promoted,
    raw_authors,
    slug,
    paper_type,
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
          <span className={css(styles.submittedSection)}>
            <AuthorAvatar
              author={uploaded_by.author_profile}
              name={first_name + " " + last_name}
              size={25}
            />
            <span
              className={css(styles.capitalize, styles.authorName)}
            >{`${first_name} ${last_name}`}</span>
          </span>
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

      voteCallback && voteCallback(index, curPaper);
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

  const renderContent = () => {
    if (bullet_points && bullet_points.length > 0) {
      return (
        <div className={css(styles.summary)}>
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
        <div className={css(styles.summary) + " clamp2"}>
          <div className={"clamp2"}>{abstract}</div>
        </div>
      );
    } else if (summary) {
      // console.log("summary", summary);
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
                    <img
                      src={preview.file}
                      className={css(carousel.image)}
                      key={`preview_${preview.file}`}
                      alt={`Paper Preview Page ${i + 1}`}
                      loading="lazy"
                    />
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

  const renderRawAuthors = (mobile) => {
    const _formatAuthors = (authors) => {
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

    if (raw_authors && raw_authors.length) {
      if (!Array.isArray(raw_authors)) {
        raw_authors = [JSON.parse(raw_authors)];
      }

      if (mobile) {
        return (
          <div
            className={css(styles.metadataContainer, styles.authorContainer)}
          >
            <div className={css(styles.icon)}>{icons.author}</div>
            <span
              className={css(styles.clampMetadata, styles.metadata) + " clamp1"}
            >
              {_formatAuthors(raw_authors)}
            </span>
          </div>
        );
      } else {
        return (
          <div
            className={css(styles.metadataContainer, styles.authorContainer)}
          >
            <span
              className={
                css(styles.clampMetadata, styles.metadata, styles.authors) +
                " clamp1"
              }
            >
              Authors: {_formatAuthors(raw_authors)}
            </span>
          </div>
        );
      }
    }
  };

  const renderPreregistrationTag = () => {
    if (paper_type === "PRE_REGISTRATION") {
      return (
        <div className={css(styles.preRegContainer)}>
          <img
            src="/static/icons/wip.png"
            className={css(styles.wipIcon)}
            alt="Preregistration Icon"
          />
          Preregistration
        </div>
      );
    }
  };

  const renderPaperTitle = () => {
    if (paper_title && title !== paper_title) {
      return (
        <div className={css(styles.metadataContainer, styles.authorContainer)}>
          <div
            className={
              css(styles.metadataClamp, styles.metadata, styles.removeMargin) +
              " clamp1"
            }
          >
            From Paper: {paper_title}
          </div>
        </div>
      );
    }
  };

  const mobileOnly = (children, options = {}) => {
    const { fullWidth } = options;
    return (
      <div className={css(styles.mobile, fullWidth && styles.fullWidth)}>
        {children}
      </div>
    );
  };

  const desktopOnly = (children) => {
    return <div className={css(styles.desktop)}>{children}</div>;
  };

  const renderMetadata = (mobile = false) => {
    if (
      paper_publish_date ||
      (raw_authors && raw_authors.length) ||
      uploaded_by
    ) {
      return (
        <div className={css(styles.metadataRow)}>
          {renderPaperTitle()}
          {renderRawAuthors(mobile)}
          {renderPublishDate(mobile)}
        </div>
      );
    }
  };

  const renderPublishDate = (mobile) => {
    if (paper_publish_date) {
      function _convertDate() {
        return formatPublishedDate(
          transformDate(paper.paper_publish_date),
          mobile
        );
      }

      if (!mobile) {
        return (
          <div
            className={css(styles.metadataContainer, styles.publishContainer)}
          >
            <span className={css(styles.metadata, styles.removeMargin)}>
              {_convertDate(mobile)}
            </span>
          </div>
        );
      } else {
        return (
          <div
            className={css(styles.metadataContainer, styles.publishContainer)}
          >
            <span className={css(styles.icon)}>{icons.calendar}</span>
            <span className={css(styles.metadata)}>{_convertDate(mobile)}</span>
          </div>
        );
      }
    }
  };

  const renderVoteWidget = (mobile = false) => {
    return (
      <Fragment>
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
                horizontalView={mobile}
              />
            </span>
          </div>
        )}
      </Fragment>
    );
  };

  const renderMainTitle = () => {
    return (
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
          <div className={css(styles.title)}>{title && title}</div>
        </a>
      </Link>
    );
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
      {desktopOnly(renderVoteWidget())}
      <div className={css(styles.container)}>
        <div className={css(styles.rowContainer)}>
          <div
            className={css(
              styles.column,
              styles.metaData,
              previews.length > 0 && styles.metaDataPreview
            )}
          >
            <div className={css(styles.topRow)}>
              {mobileOnly(renderVoteWidget(true))}
              {mobileOnly(renderPreregistrationTag())}
              {desktopOnly(renderMainTitle())}
            </div>
            {mobileOnly(renderMainTitle())}
            {desktopOnly(renderMetadata())}
            {mobileOnly(renderMetadata())}
            {renderContent()}
            {mobileOnly(renderUploadedBy())}
          </div>
          {desktopOnly(renderPreview())}
        </div>
        <div className={css(styles.bottomBar)}>
          <div className={css(styles.rowContainer)}>
            {desktopOnly(renderUploadedBy())}
          </div>
          {desktopOnly(
            <div className={css(styles.row)}>
              {renderPreregistrationTag()}
              {renderHubTags()}
            </div>
          )}
        </div>
        <div className={css(styles.bottomBar, styles.mobileHubTags)}>
          {renderHubTags()}
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
    boxSizing: "border-box",
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
    color: colors.BLACK(),
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
      paddingBottom: 10,
    },
  },
  previewColumn: {
    paddingBottom: 10,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
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
    height: "unset",
    maxHeight: "unset",
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
  publishDate: {
    fontSize: 14,
    fontWeight: 400,
    color: "#918F9B",
    marginRight: 5,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
    },
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 5,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
      paddingBottom: 10,
    },
  },
  metadataRow: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    width: "100%",
    paddingTop: 3,
    paddingBottom: 5,
    "@media only screen and (max-width: 767px)": {
      paddingTop: 0,
      paddingBottom: 5,
    },
  },
  metadataContainer: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
  },
  publishContainer: {
    marginRight: 10,
  },
  authorContainer: {
    marginBottom: 5,
  },
  clampMetadata: {
    maxWidth: 180,
    color: "#C1C1CF",
    fontSize: 14,
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    color: colors.BLACK(),
    fontSize: 14,
    padding: "3px 0 3px",
    lineHeight: 1.3,
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  voting: {
    width: 60,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
    },
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
    fontSize: 14,
    color: "#C1C1CF",
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  metadata: {
    fontSize: 14,
    color: "#918f9b",
    marginLeft: 7,
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  removeMargin: {
    marginLeft: 0,
  },
  authors: {
    marginLeft: 0,
    maxWidth: "100%",
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
      fontSize: 13,
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
    flexWrap: "wrap-reverse",
    marginLeft: "auto",
    width: "max-content",
    "@media only screen and (max-width: 970px)": {
      flexWrap: "wrap",
    },
    "@media only screen and (max-width: 767px)": {
      margin: 0,
      padding: 0,
      width: "max-content",
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
      fontSize: 13,
    },
  },
  hubLabel: {
    fontSize: 9,
    "@media only screen and (max-width: 415px)": {
      maxWidth: 60,
      flexWrap: "unset",
    },
  },
  submittedSection: {
    display: "flex",
    alignItems: "center",
    ":hover": {
      color: colors.BLUE(1),
    },
  },
  uploadedBy: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 14,
    color: "rgba(145, 143, 155, 1)",
    letterSpacing: 0.2,
    fontWeight: 400,
    cursor: "pointer",
    whiteSpace: "pre-wrap",
    ":hover": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
      marginTop: 8,
    },
  },
  uploadedByAvatar: {
    marginLeft: 10,
  },
  capitalize: {
    marginRight: 8,
    textTransform: "capitalize",
  },
  authorName: {
    marginLeft: 4,
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
    color: "rgb(145, 143, 155)",
    marginLeft: 15,
  },
  preRegContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 14,
    width: "max-content",
    color: "#918f9b",
    marginRight: 10,
    "@media only screen and (max-width: 767px)": {
      fontSize: 12,
      marginLeft: 0,
    },
  },
  wipIcon: {
    marginRight: 5,
    height: 15,
  },
  calendarIcon: {
    marginRight: 5,
  },
  desktop: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
    },
  },
  mobileHubTags: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
      marginTop: 0,
    },
  },
  fullWidth: {
    width: "100%",
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
