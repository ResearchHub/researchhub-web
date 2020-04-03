import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Router from "next/router";
import Carousel from "nuka-carousel";
import FsLightbox from "fslightbox-react";
import Ripples from "react-ripples";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Components
import HubTag from "~/components/Hubs/HubTag";
import VoteWidget from "~/components/VoteWidget";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import ShareAction from "~/components/ShareAction";
import Button from "./Form/Button";
import AuthorAvatar from "~/components/AuthorAvatar";
import FlagButton from "~/components/FlagButton";
import ActionButton from "~/components/ActionButton";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";
import PaperPagePlaceholder from "~/components/Placeholders/PaperPagePlaceholder";

// Stylesheets
import "./stylesheets/Carousel.css";

// Config
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
      figureUrls: [],
      hovered: false,
      toggleLightbox: true,
      fetching: false,
      loading: true,
    };
    this.containerRef = React.createRef();
    this.metaContainerRef = React.createRef();
  }

  componentDidMount() {
    this.fetchFigures();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (prevProps.paper.id !== this.props.paper.id) {
        this.setState({ loading: true }, () => {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.fetchFigures();
        });
      }
    }
  }

  revealPage = (timeout) => {
    setTimeout(() => {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.state.fetching && this.setState({ fetching: false });
        }, 200);
      });
    }, timeout);
  };

  fetchFigures = () => {
    this.setState({ fetching: true }, () => {
      let { paper } = this.props;
      fetch(API.GET_PAPER_FIGURES({ paperId: paper.id }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((res) => {
          if (res.data.length === 0) {
            return this.setState(
              {
                fetching: false,
              },
              this.revealPage()
            );
          } else {
            this.setState(
              {
                previews: res.data,
                figureUrls: res.data.map((preview, index) => preview.file),
              },
              this.revealPage()
            );
          }
        })
        .catch((err) => {
          this.setState({
            fetching: false,
          });
          this.revealPage();
        });
    });
  };

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

  toggleLightbox = () => {
    this.setState({ toggleLightbox: !this.state.toggleLightbox });
  };

  renderPreview = () => {
    let { hovered, fetching, previews } = this.state;
    let height =
      this.metaContainerRef.current &&
      this.metaContainerRef.current.clientHeight;
    if (fetching) {
      return (
        <div
          className={css(styles.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
          style={{ height, minHeight: height, maxHeight: height }}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation
            customPlaceholder={<PreviewPlaceholder color="#efefef" />}
          />
        </div>
      );
    }
    if (!fetching && previews.length > 0) {
      return (
        <div
          className={css(styles.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
          style={{ height, minHeight: height, maxHeight: height }}
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
            {this.state.previews.map((preview) => {
              return (
                <img
                  src={preview.file}
                  onClick={this.toggleLightbox}
                  className={css(styles.image)}
                  style={{ height, minHeight: height, maxHeight: height }}
                />
              );
            })}
          </Carousel>
        </div>
      );
    }
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
    let {
      paper,
      isModerator,
      flagged,
      setFlag,
      score,
      upvote,
      downvote,
      selectedVoteType,
    } = this.props;

    let { scrollView } = this.props;
    let paperTitle = paper && paper.title;
    return (
      <Fragment>
        <div className={css(styles.topRow)}>
          <div className={css(styles.mobileContainer)}>
            <div className={css(styles.mobileVoting)}>
              <VoteWidget
                score={score}
                onUpvote={upvote}
                onDownvote={downvote}
                selected={selectedVoteType}
                isPaper={true}
                horizontalView={true}
              />
            </div>
            <div className={css(styles.hubTags, styles.desktop)}>
              {this.renderHubs()}
            </div>
          </div>
          <div className={css(styles.actions)}>
            <PermissionNotificationWrapper
              modalMessage="edit papers"
              onClick={this.navigateToEditPaperInfo}
              permissionKey="UpdatePaper"
              loginRequired={true}
              hideRipples={false}
              styling={styles.borderRadius}
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
        <div className={css(styles.hubTags, styles.mobile)}>
          {this.renderHubs()}
        </div>
      </Fragment>
    );
  };

  render() {
    let {
      paper,
      score,
      upvote,
      downvote,
      selectedVoteType,
      scrollView,
    } = this.props;
    let { fetching, previews, figureUrls, loading } = this.state;

    if (loading) {
      return (
        <div
          className={css(
            styles.container,
            scrollView && scrollStyles.container
          )}
          ref={this.containerRef}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation
            customPlaceholder={<PaperPagePlaceholder color="#efefef" />}
          />
        </div>
      );
    }

    return (
      <div className={css(styles.container)} ref={this.containerRef}>
        <div className={css(styles.voting)}>
          <VoteWidget
            score={score}
            onUpvote={upvote}
            onDownvote={downvote}
            selected={selectedVoteType}
            isPaper={true}
          />
        </div>
        {figureUrls.length > 0 && (
          <FsLightbox
            toggler={this.state.toggleLightbox}
            type="image"
            sources={[...figureUrls]}
          />
        )}
        <div
          className={css(
            styles.column,
            !fetching && previews.length === 0 && styles.emptyPreview
          )}
        >
          {this.renderTopRow()}
          <div className={css(styles.row)}>
            <div
              className={css(
                styles.cardContainer,
                !fetching && previews.length === 0 && styles.emptyPreview
              )}
              ref={this.metaContainerRef}
            >
              <div className={css(styles.metaContainer)}>
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
                      {paper.paper_title}
                    </div>
                  )}
                  {paper && paper.tagline && (
                    <div className={css(styles.tagline)}>{paper.tagline}</div>
                  )}
                </div>
                <Fragment>
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
                      <span className={css(styles.label, styles.doi)}>
                        DOI:
                      </span>
                      {paper.doi}
                    </div>
                  )}
                </Fragment>
              </div>
              <div className={css(styles.buttonRow)}>
                {paper && paper.file && (
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
                    customLabelStyle={scrollStyles.button}
                    size={"med"}
                    hideRipples={false}
                    onClick={this.downloadPDF}
                  />
                )}
                {paper && paper.url && !paper.file && (
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
                    customLabelStyle={scrollStyles.buttonRight}
                    isWhite={true}
                    size={"med"}
                    hideRipples={false}
                    onClick={() => openExternalLink(paper.url)}
                  />
                )}
              </div>
            </div>
            {this.renderPreview()}
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
    padding: "50px 0 30px 0",
    position: "relative",

    "@media only screen and (max-width: 767px)": {
      paddingTop: 20,
    },
  },
  previewContainer: {
    minWidth: 220,
    width: 220,
    // height: 300,
    // minHeight: 300,
    border: "1.5px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
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
    "@media only screen and (min-width: 0px) and (max-width: 767px)": {
      margin: "0 auto",
      marginBottom: 16,
    },
  },
  emptyPreview: {
    minHeight: "unset",
  },
  image: {
    width: "100%",
    // minWidth: "100%",
    // maxWidth: "100%",
    // height: "100%",
    // minHeight: 300,
    // maxHeight: 300,
    objectFit: "contain",
    "@media only screen and (max-width: 1280px)": {},
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    // minHeight: 333,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
  },
  metaContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    boxSizing: "border-box",
    "@media only screen and (min-width: 768px)": {
      paddingRight: 16,
    },
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  hubTags: {
    display: "flex",

    "@media only screen and (max-width: 767px)": {
      marginBottom: 16,
    },
  },
  mobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
  },
  desktop: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  title: {
    fontSize: 30,
    position: "relative",
    wordBreak: "break-word",
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
    marginTop: 10,
  },
  tagline: {
    color: "#241F3A",
    opacity: 0.7,
    fontSize: 16,
    marginTop: 10,
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
    marginTop: 10,
  },
  downloadIcon: {
    color: "#FFF",
    marginRight: 10,
  },
  viewIcon: {
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
    padding: 5,
    borderRadius: "50%",
    backgroundColor: "rgba(36, 31, 58, 0.03)",
    color: "rgba(36, 31, 58, 0.35)",
    width: 20,
    minWidth: 20,
    maxWidth: 20,
    height: 20,
    minHeight: 20,
    maxHeight: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    cursor: "pointer",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    ":hover": {
      color: "rgba(36, 31, 58, 0.8)",
      backgroundColor: "#EDEDF0",
      borderColor: "#d8d8de",
    },
  },
  downloadActionIcon: {
    marginRight: 10,
    color: "#fff",
    backgroundColor: colors.BLUE(),
    borderColor: colors.BLUE(),
    ":hover": {
      backgroundColor: "#3E43E8",
      color: "#fff",
      borderColor: "#3E43E8",
    },
  },
  noMargin: {
    margin: 0,
  },
  borderRadius: {
    borderRadius: "50%",
  },
  middleIcon: {
    margin: "0px 10px",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",

    "@media only screen and (max-width: 767px)": {
      flexDirection: "column-reverse",
    },
  },
  mobileContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  mobileVoting: {
    display: "none",
    "@media only screen and (max-width: 768px)": {
      display: "flex",
    },
  },
});

const carousel = StyleSheet.create({
  bottomControl: {
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

const scrollStyles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 0,
  },
  previewContainer: {
    height: "initial",
    maxHeight: "initial",
    minHeight: "initial",
    width: 76,
    maxWidth: 76,
    minWidth: 76,
    "@media only screen and (max-width: 1280px)": {
      width: 76,
      maxWidth: 76,
      minWidth: 76,
    },
  },
  image: {
    height: 114,
    maxHeight: 114,
    minHeight: 114,
  },
  column: {
    minHeight: "unset",
  },
  actions: {
    position: "absolute",
    top: 35,
    right: -75,
  },
  titleHeader: {
    marginBottom: 5,
    paddingTop: 15,
    paddingRight: 16,
  },
  title: {
    fontSize: 24,
    "@media only screen and (max-width: 1280px)": {
      fontSize: 22,
    },
  },
  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    width: "calc(100% - 936px)",
  },
  button: {
    fontSize: 14,
    padding: 0,
  },
  buttonRight: {
    fontSize: 14,
    padding: 0,
  },
  voting: {
    top: 15,
  },
});
export default PaperPageCard;
