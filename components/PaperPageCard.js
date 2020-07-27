import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import moment from "moment";
import Router from "next/router";
import Link from "next/link";
import Carousel from "nuka-carousel";
import FsLightbox from "fslightbox-react";
import Ripples from "react-ripples";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";

// Components
import HubTag from "~/components/Hubs/HubTag";
import VoteWidget from "~/components/VoteWidget";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import ShareAction from "~/components/ShareAction";
import AuthorAvatar from "~/components/AuthorAvatar";
import FlagButton from "~/components/FlagButton";
import ActionButton from "~/components/ActionButton";
import PreviewPlaceholder from "~/components/Placeholders/PreviewPlaceholder";
import PaperPagePlaceholder from "~/components/Placeholders/PaperPagePlaceholder";
import { BoltSvg } from "~/config/themes/icons";

// redux
import { ModalActions } from "~/redux/modals";

// Stylesheets
import "./stylesheets/Carousel.css";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import { formatPublishedDate, openExternalLink } from "~/config/utils";

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
      slideIndex: 1,
      showAllHubs: false, // only needed when > 3 hubs,
      boostHover: false,
    };
    this.containerRef = React.createRef();
    this.metaContainerRef = React.createRef();
  }

  componentDidMount() {
    this.fetchFigures();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paper.id !== this.props.paper.id) {
      this.setState({ loading: true });
      this.fetchFigures();
    } else if (prevProps.paper.promoted !== this.props.paper.promoted) {
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = "scroll";
  }

  revealPage = (timeout) => {
    setTimeout(() => {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.state.fetching && this.setState({ fetching: false });
        }, 400);
      });
    }, timeout);
  };

  formatDoiUrl = (url) => {
    let http = "http://dx.doi.org/";

    let https = "https://dx.doi.org/";

    if (!url) {
      return;
    }
    if (url.startsWith(http)) {
      return url;
    }

    if (!url.startsWith(https)) {
      url = https + url;
    }

    return url;
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
                previews: [],
                figureUrls: [],
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

  toggleShowHubs = () => {
    this.setState({ showAllHubs: !this.state.showAllHubs });
  };

  navigateToEditPaperInfo = (e) => {
    e && e.stopPropagation();
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

  toggleBoostHover = (state) => {
    state !== this.state.boostHover && this.setState({ boostHover: state });
  };

  navigateToSubmitter = () => {
    let { author_profile } = this.props.paper.uploaded_by;
    let authorId = author_profile && author_profile.id;
    Router.push(
      "/user/[authorId]/[tabName]",
      `/user/${authorId}/contributions`
    );
  };

  renderUploadedBy = () => {
    let { uploaded_by, external_source } = this.props.paper;
    if (uploaded_by) {
      let { author_profile } = uploaded_by;
      return (
        <div
          className={css(styles.uploadedBy)}
          onClick={this.navigateToSubmitter}
        >
          Submitted by{" "}
          {`${author_profile.first_name} ${author_profile.last_name}`}
          <div className={css(styles.avatar)}>
            <AuthorAvatar author={author_profile} size={25} />
          </div>
        </div>
      );
    } else if (external_source) {
      return (
        <div className={css(styles.uploadedBy)}>
          Retreived from{" "}
          <span className={css(styles.capitalize)}>{external_source}</span>
        </div>
      );
    } else {
      return (
        <div className={css(styles.uploadedBy)}>Submitted by ResearchHub</div>
      );
    }
  };

  renderActions = () => {
    let { paper, isModerator, flagged, setFlag } = this.props;

    let paperTitle = paper && paper.title;
    return (
      <div className={css(styles.actions)}>
        <PermissionNotificationWrapper
          modalMessage="edit papers"
          onClick={this.navigateToEditPaperInfo}
          permissionKey="UpdatePaper"
          loginRequired={true}
          hideRipples={false}
          styling={styles.borderRadius}
        >
          <div className={css(styles.actionIcon)} data-tip={"Edit Paper"}>
            <i className="far fa-pencil" />
          </div>
        </PermissionNotificationWrapper>
        <ShareAction
          addRipples={true}
          title={"Share this paper"}
          subtitle={paperTitle}
          url={this.props.shareUrl}
          customButton={
            <div
              className={css(styles.actionIcon, styles.middleIcon)}
              data-tip={"Share Paper"}
            >
              <i className="far fa-share-alt" />
            </div>
          }
        />
        {paper && paper.file && (
          <Ripples
            className={css(styles.actionIcon, styles.downloadActionIcon)}
            onClick={this.downloadPDF}
          >
            <span
              className={css(styles.downloadIcon)}
              data-tip={"Download PDF"}
            >
              <i className="far fa-arrow-to-bottom" />
            </span>
          </Ripples>
        )}
        {paper && paper.url && (paper && !paper.file) && (
          <Ripples
            className={css(styles.actionIcon, styles.downloadActionIcon)}
            onClick={() => openExternalLink(paper.url)}
          >
            <span
              className={css(styles.downloadIcon)}
              data-tip={"Open in External Link"}
            >
              <i className="far fa-external-link" />
            </span>
          </Ripples>
        )}
        {!isModerator ? (
          <span data-tip={"Flag Paper"}>
            <FlagButton
              paperId={paper.id}
              flagged={flagged}
              setFlag={setFlag}
              style={styles.actionIcon}
            />
          </span>
        ) : (
          <span data-tip={"Remove Page"}>
            <ActionButton isModerator={isModerator} paperId={paper.id} />
          </span>
        )}
      </div>
    );
  };

  renderPreview = () => {
    let { hovered, fetching, previews } = this.state;
    let height =
      this.metaContainerRef.current &&
      this.metaContainerRef.current.clientHeight;

    let width;
    if (height < 137.545) {
      height = 137.545;
    }
    if (this.metaContainerRef.current) {
      width = (8.5 * height) / 11; // keeps paper ar
    }

    if (window.innerWidth < 769) {
      height = 130;
      width = 101;
    }
    if (!fetching) {
      width !== this.state.width && this.setState({ width });
    }

    if (fetching) {
      return (
        <div
          className={css(styles.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
          style={{
            minHeight: height,
            maxHeight: height,
            height,
            width,
            minWidth: width,
            maxWidth: width,
          }}
        >
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation
            customPlaceholder={<PreviewPlaceholder color="#efefef" />}
          >
            <div />
          </ReactPlaceholder>
        </div>
      );
    }
    if (!fetching && previews.length > 0) {
      return (
        <div
          className={css(styles.previewContainer)}
          onClick={this.toggleLightbox}
          style={{
            minHeight: height,
            maxHeight: height,
            height,
            width,
            minWidth: width,
            maxWidth: width,
          }}
        >
          <Carousel
            afterSlide={(slideIndex) =>
              this.setState({ slideIndex: slideIndex + 1 })
            }
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
                  <span className={css(styles.slideCount)}>{`${currentSlide +
                    1} / ${slideCount}`}</span>
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
            {this.state.previews.map((preview, i) => {
              return (
                <img
                  src={preview.file}
                  className={css(styles.image)}
                  key={`preview-${preview.id}-${i}`}
                  style={{
                    minHeight: height,
                    maxHeight: height,
                    height,
                    width,
                    minWidth: width,
                    maxWidth: width,
                  }}
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
    let uploadedBy = paper.uploaded_by
      ? paper.uploaded_by.author_profile.id
      : null;
    let authors =
      paper &&
      paper.authors.map((author, index) => {
        return (
          <Fragment>
            <Link
              href={"/user/[authorId]/[tabName]"}
              as={`/user/${author.id}/contributions`}
            >
              <a
                href={`/user/${author.id}/contributions`}
                className={css(styles.atag)}
              >
                <div
                  className={css(styles.authorContainer)}
                  key={`author_${index}`}
                >
                  <span className={css(styles.authorName)}>
                    {`${author.first_name} ${author.last_name}`}
                  </span>
                  {author.id !== uploadedBy && (
                    <span className={css(styles.authorAvatar)}>
                      <AuthorAvatar author={author} size={25} />
                    </span>
                  )}
                </div>
              </a>
            </Link>
          </Fragment>
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
    if (paper.hubs && paper.hubs.length > 0) {
      return (
        <div className={css(styles.hubTags)}>
          {paper.hubs.map((hub, index) => {
            if (this.state.showAllHubs || index < 3) {
              let last = index === paper.hubs.length - 1;
              return (
                <HubTag
                  tag={hub}
                  gray={false}
                  key={`hub_tag_index_${index}`}
                  overrideStyle={this.state.showAllHubs && styles.tagStyle}
                />
              );
            }
          })}
          {paper.hubs.length > 3 && (
            <div
              className={css(
                styles.icon,
                this.state.showAllHubs && styles.active
              )}
              onClick={this.toggleShowHubs}
            >
              {this.state.showAllHubs ? icons.chevronUp : icons.ellipsisH}
            </div>
          )}
        </div>
      );
    }
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
                type={"Paper"}
                promoted={this.props.paper && this.props.paper.promoted}
                paper={
                  this.props.paper && this.props.paper.promoted
                    ? this.props.paper
                    : null
                }
                showPromotion={true}
              />
            </div>
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
      doneFetchingPaper,
    } = this.props;

    let { fetching, previews, figureUrls } = this.state;
    if (!doneFetchingPaper) {
      return (
        <div className={css(styles.container)} ref={this.containerRef}>
          <ReactPlaceholder
            ready={false}
            showLoadingAnimation
            customPlaceholder={<PaperPagePlaceholder color="#efefef" />}
          >
            <div />
          </ReactPlaceholder>
        </div>
      );
    }

    return (
      <div
        className={css(
          styles.container,
          this.state.dropdown && styles.overflow
        )}
        ref={this.containerRef}
        onMouseEnter={this.setHover}
        onMouseLeave={this.unsetHover}
      >
        <ReactTooltip />
        <div className={css(styles.voting)}>
          <VoteWidget
            score={score}
            onUpvote={upvote}
            onDownvote={downvote}
            selected={selectedVoteType}
            isPaper={true}
            type={"Paper"}
            paperPage={true}
            promoted={this.props.paper && this.props.paper.promoted}
            paper={
              this.props.paper && this.props.paper.promoted !== false
                ? this.props.paper
                : null
            }
            showPromotion={true}
          />
        </div>
        <div className={css(styles.votingMobile)}>
          <VoteWidget
            score={score}
            onUpvote={upvote}
            onDownvote={downvote}
            selected={selectedVoteType}
            isPaper={true}
            horizontalView={true}
            type={"Paper"}
            paperPage={true}
            promoted={this.props.paper && this.props.paper.promoted}
            paper={
              this.props.paper && this.props.paper.promoted
                ? this.props.paper
                : null
            }
            showPromotion={true}
          />
        </div>
        {figureUrls.length > 0 && (
          <FsLightbox
            toggler={this.state.toggleLightbox}
            type="image"
            sources={[...figureUrls]}
            slide={this.state.slideIndex}
          />
        )}
        <div
          className={css(
            styles.column,
            !fetching && previews.length === 0 && styles.emptyPreview
          )}
          ref={this.metaContainerRef}
        >
          <div className={css(styles.row)}>
            <div
              className={css(
                styles.cardContainer,
                !fetching && previews.length === 0 && styles.emptyPreview
              )}
            >
              <div className={css(styles.metaContainer)}>
                <div className={css(styles.titleHeader)}>
                  <div className={css(styles.title)}>
                    {paper && paper.title}
                  </div>
                  {paper.paper_title && paper.paper_title !== paper.title && (
                    <div className={css(styles.subtitle)}>
                      {`From Paper: ${paper.paper_title}`}
                    </div>
                  )}
                </div>
                <div className={css(styles.column)}>
                  {paper && paper.authors && paper.authors.length > 0 && (
                    <div
                      className={css(
                        styles.authors,
                        !paper.paper_publish_date && styles.marginTop
                      )}
                    >
                      {paper.paper_publish_date && (
                        <span
                          className={css(
                            styles.label,
                            styles.authorLabel,
                            paper.authors.length > 1 && styles.padding
                          )}
                        >
                          {`Author${paper.authors.length > 1 ? "s" : ""}:`}
                        </span>
                      )}
                      <div className={css(styles.authors)}>
                        {this.renderAuthors()}
                      </div>
                    </div>
                  )}
                  {paper && (paper.paper_publish_date || paper.authors) && (
                    <div className={css(styles.dateAuthorContainer)}>
                      {paper && paper.paper_publish_date && (
                        <div className={css(styles.publishDate)}>
                          <span className={css(styles.label)}>Published:</span>
                          {this.renderPublishDate()}
                        </div>
                      )}
                    </div>
                  )}
                  {paper && paper.doi && (
                    <div className={css(styles.doiDate)}>
                      <span className={css(styles.label, styles.doi)}>
                        DOI:
                      </span>
                      <a
                        href={this.formatDoiUrl(paper.doi)}
                        target="_blank"
                        className={css(styles.link)}
                      >
                        {paper.doi}
                      </a>
                    </div>
                  )}
                  <div className={css(styles.uploadedByContainer)}>
                    {this.renderUploadedBy()}
                    <div className={css(styles.mobile)}>
                      <PermissionNotificationWrapper
                        modalMessage="promote paper"
                        onClick={() =>
                          this.props.openPaperTransactionModal(true)
                        }
                        loginRequired={true}
                        hideRipples={false}
                      >
                        <div
                          className={css(styles.promotionButton)}
                          onMouseEnter={() => this.toggleBoostHover(true)}
                          onMouseLeave={() => this.toggleBoostHover(false)}
                        >
                          <span className={css(styles.boostIcon)}>
                            <BoltSvg
                              color={
                                this.state.boostHover
                                  ? "rgb(255, 255, 255)"
                                  : colors.BLUE()
                              }
                              opacity={1}
                            />
                          </span>
                          Boost
                        </div>
                      </PermissionNotificationWrapper>
                    </div>
                  </div>
                </div>
                <div className={css(styles.mobile)}>{this.renderPreview()}</div>
                <div className={css(styles.mobile)}>{this.renderHubs()}</div>
              </div>
            </div>
            <div className={css(styles.rightColumn, styles.mobile)}>
              <div className={css(styles.actionMobileContainer)}>
                {this.renderActions()}
              </div>
            </div>
          </div>
          <div className={css(styles.bottomRow)}>
            <div className={css(styles.actionsContainer)}>
              {this.renderActions()}
            </div>
            <PermissionNotificationWrapper
              modalMessage="promote paper"
              onClick={() => this.props.openPaperTransactionModal(true)}
              loginRequired={true}
              hideRipples={false}
            >
              <div
                className={css(styles.promotionButton)}
                onMouseEnter={() => this.toggleBoostHover(true)}
                onMouseLeave={() => this.toggleBoostHover(false)}
              >
                <span className={css(styles.boostIcon)}>
                  <BoltSvg
                    color={
                      this.state.boostHover
                        ? "rgb(255, 255, 255)"
                        : colors.BLUE()
                    }
                    opacity={1}
                  />
                </span>
                Boost
              </div>
            </PermissionNotificationWrapper>
          </div>
          <div className={css(styles.bottomRow)}>{this.renderHubs()}</div>
        </div>
        {this.state.width > 0 && (
          <div
            className={css(styles.absolutePreview)}
            // style={{ right: -1 * (this.state.width + 20) }}
          >
            {this.renderPreview()}
          </div>
        )}
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
    overflow: "visible",
    "@media only screen and (max-width: 767px)": {
      paddingTop: 20,
      paddingBottom: 0,
    },
  },
  overflow: {
    overflow: "visible",
  },
  previewContainer: {
    border: "1.5px solid rgba(36, 31, 58, 0.1)",
    borderRadius: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    "@media only screen and (min-width: 0px) and (max-width: 767px)": {
      margin: "0 auto",
      marginBottom: 16,
    },
  },
  emptyPreview: {
    minHeight: "unset",
  },
  image: {
    height: "100%",
    width: "100%",
    objectFit: "contain",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
  },
  metaContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    "@media only screen and (min-width: 768px)": {},
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
    alignItems: "center",
    flexWrap: "wrap",
    "@media only screen and (max-width: 768px)": {
      marginTop: 15,
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
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  titleHeader: {
    marginBottom: 15,
  },
  subtitle: {
    color: "#241F3A",
    opacity: 0.5,
    fontSize: 16,
    marginTop: 10,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  tagline: {
    color: "#241F3A",
    opacity: 0.7,
    fontSize: 16,
    marginTop: 10,
    whiteSpace: "pre-wrap",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  dateAuthorContainer: {
    display: "flex",
    alignItems: "center",
  },
  publishDate: {
    fontSize: 16,
    color: "#241F3A",
    opacity: 0.7,
    display: "flex",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  authors: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  authorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 8,
    cursor: "pointer",
  },
  authorName: {
    marginRight: 8,
    opacity: 0.7,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    ":hover": {
      color: colors.BLUE(),
      opacity: 1,
    },
  },
  authors: {
    display: "flex",
    alignItems: "center",
  },
  marginTop: {
    marginTop: 5,
  },
  doiDate: {
    fontSize: 16,
    color: "#241F3A",
    opacity: 0.7,
    display: "flex",
    marginBottom: 5,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: "#241F3A",
    marginRight: 30,

    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  authorLabel: {
    marginRight: 53,
    opacity: 0.7,
  },
  padding: {
    marginRight: 46,
  },
  doi: {
    marginRight: 74,
  },
  voting: {
    position: "absolute",
    width: 70,
    left: -70,
    top: 37,
    display: "block",
    "@media only screen and (max-width: 768px)": {
      display: "none",
    },
  },
  votingMobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
    display: "unset",
    position: "absolute",
    top: 20,
    left: 5,
  },
  buttonRow: {
    width: "100%",
    display: "flex",
  },
  downloadIcon: {
    color: "#FFF",
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
    padding: "5px 20px",
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
    justifyContent: "flex-start",
    "@media only screen and (max-width: 768px)": {
      paddingBottom: 15,
    },
  },
  actionsContainer: {
    marginRight: 30,
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
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column-reverse",
    },
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    justifiyContent: "flex-start",
    alignItems: "flex-end",
    marginLeft: 20,
    "@media only screen and (max-width: 768px)": {
      width: "100%",
    },
  },
  actionMobileContainer: {
    paddingTop: 2,
    "@media only screen and (max-width: 768px)": {
      display: "flex",
    },
  },
  spacedRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
  metaData: {
    justifyContent: "flex-start",
  },
  absolutePreview: {
    marginLeft: 16,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  left: {
    marginRight: 20,
  },
  bottomRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  flexendRow: {
    justifyContent: "flex-end",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  mobile: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      marginLeft: 0,
    },
  },
  summary: {
    minWidth: "100%",
    maxWidth: "100%",
    whiteSpace: "pre-wrap",
    color: "#4e4c5f",
    fontSize: 14,
    paddingBottom: 8,
  },
  mobileMargin: {
    marginTop: 10,
    marginBottom: 15,
  },
  uploadedByContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    "@media only screen and (max-width: 767px)": {
      marginBottom: 15,
    },
  },
  uploadedBy: {
    whiteSpace: "pre-wrap",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: 16,
    color: "#646171",
    cursor: "pointer",
    marginBottom: 5,
    width: "unset",
    ":hover": {
      color: colors.BLUE(),
    },
    "@media only screen and (max-width: 767px)": {
      marginBottom: 0,
      marginRight: 20,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  avatar: {
    marginLeft: 8,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  uploadIcon: {
    marginLeft: 10,
    opacity: 1,
  },
  paperProgress: {
    position: "absolute",
    bottom: 30,
    right: 220,
  },
  atag: {
    color: "unset",
    textDecoration: "unset",
  },
  promotionButton: {
    padding: "5px 20px",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    background: "#FFF",
    border: `1px solid ${colors.BLUE()}`,
    color: colors.BLUE(),
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.BLUE(),
      color: "#FFF",
    },
    "@media only screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
  boostIcon: {
    marginRight: 8,
  },
  link: {
    cursor: "pointer",
    color: colors.BLACK(),
    textDecoration: "unset",
    ":hover": {
      color: colors.BLUE(),
    },
  },
  tagStyle: {
    marginBottom: 5,
  },
  icon: {
    padding: "0px 4px",
    cursor: "pointer",
    border: "1px solid #FFF",
    height: 21,
    ":hover": {
      color: colors.BLUE(),
      backgroundColor: "#edeefe",
      borderRadius: 3,
    },
  },
  active: {
    fontSize: 14,
    padding: "0px 4px",
    marginBottom: 5,
    ":hover": {
      fontSize: 14,
      color: colors.BLUE(),
      backgroundColor: "#edeefe",
      borderRadius: 3,
    },
  },
});

const carousel = StyleSheet.create({
  bottomControl: {
    background: "rgba(36, 31, 58, 0.65)",
    borderRadius: 230,
    height: 30,
    minWidth: 85,
    whiteSpace: "nowrap",
    color: "#FFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    opacity: 0,
    fontSize: 14,
    transition: "all ease-out 0.3s",
  },
  slideCount: {
    padding: "0px 8px",
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
  hide: {
    display: "none",
  },
});

const mapStateToProps = (state) => ({
  paper: state.paper,
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperPageCard);
