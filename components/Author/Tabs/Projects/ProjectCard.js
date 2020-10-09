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
import VoteWidget from "~/components//VoteWidget";
import HubTag from "~/components/Hubs/HubTag";
import HubDropDown from "~/components/Hubs/HubDropDown";
import SupportList from "./SupportList";

// Redux
import { ModalActions } from "~/redux/modals";
import { transformDate } from "~/redux/utils";
import { PaperActions } from "~/redux/paper";

// Utility
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "~/config/constants";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { formatDateYMD, formatPaperSlug } from "~/config/utils";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const ProjectCard = (props) => {
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
    paper_type,
  } = paper || null;
  let vote_type = 0;
  let selected = setVoteSelected(paper.user_vote);
  const [lightbox, toggleLightbox] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const [isOpen, setIsOpen] = useState(false); // Hub dropdown
  const [supporters, setSupporters] = useState([]);
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

  const fetchSupported = () => {
    let endpoint = API.SUPPORT({ paperId: id && id, route: "get_supported" });
    return fetch(endpoint, API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setSupporters(res.results);
      });
  };

  useEffect(() => {
    fetchSupported();
  }, []);

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

  function convertDate(date) {
    return formatDateYMD(transformDate(date));
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

  function openAuthorSupportModal() {
    props.openAuthorSupportModal(true, { paper: props.paper });
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
          <div className={"clamp2"}>{abstract}</div>
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
                    <img
                      src={preview.file}
                      className={css(carousel.image)}
                      key={`preview_${preview.file}`}
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
          {hubs.slice(0, 2).map(
            (tag, index) =>
              tag &&
              index < 3 && (
                <HubTag
                  key={`hub_${index}`}
                  tag={tag}
                  last={index === hubs.length - 1}
                  // gray={true}
                  labelStyle={styles.hubLabel}
                />
              )
          )}
          {hubs.length > 3 && (
            <HubDropDown
              hubs={hubs}
              labelStyle={styles.hubLabel}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
      );
    }
  };

  const renderPreregistrationTag = () => {
    return (
      <div className={css(styles.preRegContainer)}>
        <img src="/static/icons/wip.png" className={css(styles.wipIcon)} />
        Preregistration
      </div>
    );
  };

  const renderFundProject = () => {
    return (
      <Ripples
        className={css(styles.fundProjectButton)}
        onClick={openAuthorSupportModal}
      >
        Fund Preregistration
      </Ripples>
    );
  };

  const renderSubmitDate = () => {
    return (
      <div className={css(styles.submitDateContainer)}>
        <span className={css(styles.publishDate, styles.text)}>
          Submitted: {convertDate(paper.created_date)}
        </span>
      </div>
    );
  };

  const mobileOnly = (children) => {
    return <div className={css(styles.mobile)}>{children}</div>;
  };

  const desktopOnly = (children) => {
    return <div className={css(styles.desktop)}>{children}</div>;
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
            {mobileOnly(renderVoteWidget(true))}
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
            <div className={css(styles.row)}>
              {renderSubmitDate()}
              <span className={css(styles.mobilePreregRoot)}>
                {renderPreregistrationTag()}
              </span>
            </div>
            <span className={css(styles.mobilePreviewRoot)}>
              {renderPreview()}
            </span>
            {renderBullet()}
          </div>
          <span className={css(styles.previewRoot)}>{renderPreview()}</span>
        </div>
        <div className={css(styles.mobileHubtagContainer)}>
          <div className={css(styles.supportlist)}>
            {renderDiscussionCount()}
          </div>
          {renderHubTags()}
        </div>
        <div className={css(styles.hubtagContainer)}>{renderHubTags()}</div>
        <div className={css(styles.bottomBar)}>
          {desktopOnly(renderDiscussionCount())}
          <div className={css(styles.fundProjectContainer)}>
            <span className={css(styles.preregRoot)}>
              {renderPreregistrationTag()}
            </span>
            {renderFundProject()}
          </div>
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
  previewRoot: {
    paddingLeft: 10,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobilePreviewRoot: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      margin: "15px 0 10px",
      boxSizing: "border-box",
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
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
    },
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  mobilePreregRoot: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      paddingTop: 2,
      paddingBottom: 8,
    },
  },
  submitDateContainer: {
    maxWidth: "100%",
    paddingTop: 2,
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
    width: 60,
    "@media only screen and (max-width: 767px)": {
      width: "unset",
      marginBottom: 10,
    },
  },
  voteWidget: {
    marginRight: 15,
    fontSize: 14,
    "@media only screen and (max-width: 415px)": {
      // fontSize: 12,
      // maxWidth: 35
    },
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "flex-end",
      marginTop: 5,
    },
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "max-content",
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
    width: "max-content",
    overflow: "hidden",
    // "@media only screen and (max-width: 970px)": {
    //   marginBottom: 15,
    //   justifyContent: "flex-start",
    //   width: "100%",
    //   flexWrap: "wrap",
    // },
    // "@media only screen and (max-width: 767px)": {
    //   marginBottom: 0,
    //   marginTop: 0,
    //   width: "unset",
    // },
  },
  hubtagContainer: {
    display: "flex",
    alignItems: "center",
    height: "unset",
    justifyContent: "flex-end",
    fontSize: 14,
    marginTop: 10,
    width: "100%",
    color: "#918f9b",
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  mobileHubtagContainer: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "10px 0",
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
      fontSize: 12,
    },
  },
  hubLabel: {
    fontSize: 9,
    "@media only screen and (max-width: 415px)": {
      maxWidth: 60,
    },
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
    color: "rgb(145, 143, 155)",
    marginLeft: 15,
  },
  preregRoot: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
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
    marginRight: 6,
    height: 15,
  },
  fundProjectContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  fundProjectButton: {
    marginLeft: 30,
    padding: "5px 35px",
    borderRadius: 4,
    fontSize: 14,
    width: "max-content",
    border: `1px solid ${colors.BLUE()}`,
    background: colors.BLUE(),
    color: "#FFF",
    boxSizing: "border-box",
    minWidth: 90,
    ":hover": {
      // background: colors.BLUE(),
      background: "#3E43E8",
      // color: "#FFF",
    },
    "@media only screen and (max-width: 767px)": {
      width: "100%",
      margin: 0,
      padding: 0,
      height: 40,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: colors.BLUE(),
      color: "#FFF",
    },
  },
  supportlist: {
    marginBottom: 8,
    "@media only screen and (max-width: 767px)": {
      // marginRight: 10
    },
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
  modals: state.modals,
});

const mapDispatchToProps = {
  postUpvote: PaperActions.postUpvote,
  postDownvote: PaperActions.postDownvote,
  updatePaperState: PaperActions.updatePaperState,
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectCard);
