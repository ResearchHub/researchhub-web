import { useEffect, useState, Fragment } from "react";
import Ripples from "react-ripples";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Router, { useRouter } from "next/router";
import { connect } from "react-redux";

import Carousel from "nuka-carousel";

// Components
import HubTag from "~/components/Hubs/HubTag";
import VoteWidget from "~/components/VoteWidget";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import ShareAction from "~/components/ShareAction";
import Button from "./Form/Button";
import AuthorAvatar from "~/components/AuthorAvatar";

import FlagButton from "~/components/FlagButton";
import ActionButton from "~/components/ActionButton";

// Config
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { formatPublishedDate } from "~/config/utils";
import { openExternalLink } from "~/config/utils";

class PaperPageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      hovered: false,
    };
  }

  componentDidMount() {
    fetch(API.GET_PAPER_FIGURES({ paperId: 359 }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        this.setState({ previews: res.data });
      });
  }

  componentDidUpdate() {}

  // handleSelect = (selectIndex, e) => {
  //   this.setState({ previewIndex: selectIndex })
  // }

  navigateToEditPaperInfo = () => {
    let paperId = this.props.paper.id;
    let href = "/paper/upload/info/[paperId]";
    let as = `/paper/upload/info/${paperId}`;
    Router.push(href, as);
  };

  downloadPDF = () => {
    let file = this.props.paper.file;
    window.open(file, "_blank");
  };

  setHover = () => {
    !this.state.hovered && this.setState({ hovered: true });
  };

  unsetHover = () => {
    this.state.hovered && this.setState({ hovered: false });
  };

  renderPreview = () => {
    let { hovered } = this.state;
    return (
      <div
        className={css(styles.previewContainer)}
        onMouseEnter={this.setHover}
        onMouseLeave={this.unsetHover}
      >
        <Carousel
          renderBottomCenterControls={(arg) => {
            let { currentSlide, slideCount, previousSlide, nextSlide } = arg;
            return (
              <div
                className={css(
                  carousel.bottomControl,
                  hovered && carousel.show
                )}
              >
                <span
                  onClick={previousSlide}
                  className={css(
                    carousel.button,
                    carousel.left,
                    currentSlide === 0 && carousel.pointer,
                    hovered && carousel.show
                  )}
                >
                  <i className="far fa-angle-left" />
                </span>
                {`${currentSlide + 1} / ${slideCount}`}
                <span
                  onClick={nextSlide}
                  className={css(
                    carousel.button,
                    carousel.right,
                    currentSlide === slideCount && carousel.pointer,
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
        >
          {this.state.previews.map((preview) => {
            return <img src={preview.file} className={css(styles.image)} />;
          })}
        </Carousel>
      </div>
    );
  };

  renderAuthors = () => {
    let { paper } = this.props;
    let authors =
      paper &&
      paper.authors.map((author, index) => {
        return (
          <div className={css(styles.authorContainer)} key={`author_${index}`}>
            <AuthorAvatar author={author} size={30} />
          </div>
        );
      });
    return authors;
  };

  renderPublishDate = () => {
    let { paper } = this.props;
    if (paper.paper_publish_date) {
      return (
        <div className={css(styles.info)}>
          {formatPublishedDate(moment(paper.paper_publish_date), true)}
        </div>
      );
    }
  };

  renderHubs = () => {
    let { paper } = this.props;

    let hubs =
      paper &&
      paper.hubs.map((hub, index) => {
        return <HubTag tag={hub} gray={true} />;
      });
    return hubs;
  };

  renderTopRow = () => {
    let { paper, isModerator, flagged, setFlag } = this.props;
    let paperTitle = paper && paper.title;

    if (paper && paper.hubs && paper.hubs.length > 0) {
      return (
        <div className={css(styles.topRow)}>
          <div className={css(styles.hubTags)}>{this.renderHubs()}</div>
          <div className={css(styles.actions)}>
            <PermissionNotificationWrapper
              modalMessage="edit papers"
              onClick={this.navigateToEditPaperInfo}
              permissionKey="UpdatePaper"
              loginRequired={true}
            >
              <div className={css(styles.actionIcon)}>
                <i className="far fa-pencil" />
              </div>
            </PermissionNotificationWrapper>
            <ShareAction
              addRipples={true}
              title={"Share this paper"}
              subtitle={paperTitle}
              url={this.props.shareUrl}
              customButton={
                <div className={css(styles.actionIcon, styles.middleIcon)}>
                  <i className="far fa-share-alt" />
                </div>
              }
            />
            {!isModerator ? (
              <FlagButton
                paperId={paper.id}
                flagged={flagged}
                setFlag={setFlag}
                style={styles.actionIcon}
              />
            ) : (
              <ActionButton isModerator={isModerator} paperId={paper.id} />
            )}
          </div>
        </div>
      );
    }
  };

  render() {
    let { paper, score, upvote, downvote, selectedVoteType } = this.props;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.voting)}>
          <VoteWidget
            score={score}
            onUpvote={upvote}
            onDownvote={downvote}
            selected={selectedVoteType}
            isPaper={true}
          />
        </div>
        {this.renderPreview()}
        <div className={css(styles.column)}>
          <div className={css(styles.cardContainer)}>
            {this.renderTopRow()}
            <div className={css(styles.titleHeader)}>
              <div
                className={css(
                  styles.title,
                  paper.paper_title &&
                    paper.paper_title !== paper.title &&
                    styles.titleMargin
                )}
              >
                {paper && paper.title}
              </div>
              {paper.paper_title && paper.paper_title !== paper.title && (
                <div className={css(styles.subtitle)}>
                  Science is Shaped by Wikipedia: Evidence From a Randomized
                  Control Trial
                  {/* {paper.paper_title} */}
                </div>
              )}
            </div>
            <div className={css(styles.dateAuthorContainer)}>
              {paper && paper.paper_publish_date && (
                <div className={css(styles.publishDate)}>
                  <span className={css(styles.label)}>Published:</span>
                  {this.renderPublishDate()}
                </div>
              )}
              {paper && paper.authors && (
                <div className={css(styles.authors)}>
                  {this.renderAuthors()}
                </div>
              )}
            </div>
            {paper && paper.doi && (
              <div className={css(styles.doiDate)}>
                <span className={css(styles.label, styles.doi)}>DOI:</span>
                {paper.doi}
              </div>
            )}
          </div>
          <div className={css(styles.buttonRow)}>
            <Button
              label={() => {
                return (
                  <span>
                    <span className={css(styles.downloadIcon)}>
                      <i className="far fa-arrow-to-bottom" />
                    </span>
                    Download PDF
                  </span>
                );
              }}
              customButtonStyle={styles.button}
              size={"med"}
              hideRipples={false}
              onClick={this.downloadPDF}
            />
            <Button
              label={() => {
                return (
                  <span>
                    <span className={css(styles.viewIcon)}>
                      <i className="far fa-external-link"></i>
                    </span>
                    View Externally
                  </span>
                );
              }}
              customButtonStyle={styles.buttonRight}
              isWhite={true}
              size={"med"}
              hideRipples={false}
              onClick={() => openExternalLink(paper.file)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    padding: "50px 0",
    position: "relative",
  },
  previewContainer: {
    minWidth: 220,
    width: 220,
    height: 333,
    minHeight: 333,
    border: "1.5px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    marginRight: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    "@media only screen and (max-width: 1280px)": {
      minWidth: 200,
      width: 200,
      maxWidth: 200,
    },
  },
  image: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    height: 333,
    minHeight: 333,
    maxHeight: 333,
    objectFit: "contain",
    "@media only screen and (max-width: 1280px)": {},
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 333,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  hubTags: {
    display: "flex",
  },
  titleHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    "@media only screen and (max-width: 760px)": {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
  },
  title: {
    fontSize: 30,
    position: "relative",
    wordBreak: "break-word",
    textAlign: "justify",
    "@media only screen and (max-width: 760px)": {
      fontSize: 28,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 25,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 22,
    },
  },
  titleMargin: {
    marginBottom: 10,
  },
  subtitle: {
    color: "#241F3A",
    opacity: 0.7,
    fontSize: 16,
    textAlign: "justify",
  },
  dateAuthorContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
  publishDate: {
    fontSize: 16,
    color: "#241F3A",
    opacity: 0.7,
    marginRight: 60,
    display: "flex",
  },
  authorContainer: {
    marginRight: 5,
  },
  authors: {
    display: "flex",
    alignItems: "center",
  },
  doiDate: {
    fontSize: 16,
    marginBottom: 25,
    color: "#241F3A",
    opacity: 0.7,
    width: "100%",
    display: "flex",
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: "#241F3A",
    marginRight: 30,
  },
  doi: {
    marginRight: 74,
  },
  voting: {
    position: "absolute",
    width: 70,
    left: -70,
    top: 43,
  },
  buttonRow: {
    width: "100%",
    display: "flex",
  },
  downloadIcon: {
    color: "#FFF",
    marginRight: 10,
  },
  viewIcon: {
    // color: colors.BLUE(),
    marginRight: 10,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    width: "unset",
    boxSizing: "border-box",
    marginRight: 10,
    padding: "8px 30px",
  },
  buttonRight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    width: "unset",
    boxSizing: "border-box",
    padding: "8px 30px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
  },
  actionIcon: {
    color: "rgba(36, 31, 58, 0.35)",
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: "rgba(36, 31, 58, 0.8)",
    },
  },
  middleIcon: {
    margin: "0px 15px",
  },
});

const carousel = StyleSheet.create({
  bottomControl: {
    // background: 'rgba(0, 0, 0, 0.4)',
    background: "rgba(36, 31, 58, 0.65)",
    borderRadius: 230,
    height: 30,
    minWidth: 85,
    color: "#FFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    opacity: 0,
    fontSize: 14,
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
});

export default PaperPageCard;
