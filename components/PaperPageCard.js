import { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import * as moment from "dayjs";
import Router from "next/router";
import Link from "next/link";
import Carousel from "nuka-carousel";
import FsLightbox from "fslightbox-react";
import Ripples from "react-ripples";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder/lib";
import * as Sentry from "@sentry/browser";

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
import PaperMetadata from "./Paper/PaperMetadata";
import PaperJournalTag from "./Paper/PaperJournalTag";

// redux
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import {
  getJournalFromURL,
  openExternalLink,
  capitalize,
} from "~/config/utils";
import { formatPublishedDate } from "~/config/utils/dates";
import { MessageActions } from "../redux/message";
import AuthorSupportModal from "./Modals/AuthorSupportModal";

class PaperPageCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      figureUrls: [],
      hovered: false,
      toggleLightbox: true,
      fetching: false,
      slideIndex: 1,
      showAllHubs: false, // only needed when > 3 hubs,
      boostHover: false,
    };
    this.containerRef = React.createRef();
    this.metaContainerRef = React.createRef();
  }

  componentDidMount = () => {
    this.fetchFigures();
  };

  componentWillUnmount() {
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
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

  restorePaper = () => {
    let {
      setMessage,
      showMessage,
      isModerator,
      isSubmitter,
      paperId,
      restorePaper,
    } = this.props;
    let params = {};
    if (isModerator) {
      params.is_removed = false;
    }

    if (isSubmitter) {
      params.is_removed_by_user = false;
    }

    return fetch(API.PAPER({ paperId }), API.PATCH_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setMessage("Paper Successfully Restored.");
        showMessage({ show: true });
        restorePaper();
      });
  };

  removePaper = () => {
    let {
      setMessage,
      showMessage,
      isModerator,
      isSubmitter,
      paperId,
      removePaper,
    } = this.props;
    let params = {};
    if (isModerator) {
      params.is_removed = true;
    }

    if (isSubmitter) {
      params.is_removed_by_user = true;
    }

    return fetch(API.PAPER({ paperId }), API.PATCH_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setMessage("Paper Successfully Removed.");
        showMessage({ show: true });
        removePaper();
      });
  };

  fetchFigures = () => {
    this.setState({ fetching: true }, () => {
      let { paper, paperId } = this.props;
      fetch(API.GET_PAPER_FIGURES({ paperId }), API.GET_CONFIG())
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
    let paperId = this.props.paperId;
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

  renderMetadata = () => {
    const { paper } = this.props;

    this.metadata = [
      {
        label: `Author${
          (paper.authors && paper.authors.length > 1) ||
          (paper.raw_authors && paper.raw_authors.length > 1)
            ? "s"
            : ""
        }`,
        value: (
          <span className={css(styles.metadata, styles.authorsContainer)}>
            {this.renderAuthors()}
          </span>
        ),
        active:
          paper &&
          ((paper.authors && paper.authors.length) ||
            (Array.isArray(paper.raw_authors)
              ? paper.raw_authors.length
              : paper.raw_authors)),
      },
      {
        label: "Published",
        value: (
          <span
            className={css(styles.metadata)}
            property="datePublished"
            datetime={paper.paper_publish_date}
          >
            {this.renderPublishDate()}
          </span>
        ),
        active: paper && paper.paper_publish_date,
      },

      {
        label: "DOI",
        value: (
          <a
            property="sameAs"
            href={this.formatDoiUrl(paper.doi)}
            target="_blank"
            className={css(styles.metadata, styles.link)}
            rel="noreferrer noopener"
          >
            {paper.doi}
          </a>
        ),
        active: paper && paper.doi,
      },
      {
        label: "Journal",
        value: (
          <PaperJournalTag
            url={paper.url}
            externalSource={paper.external_source}
            onFallback={(externalSource) => {
              if (externalSource) {
                return capitalize(externalSource);
              }
              return null;
            }}
          />
        ),
        active:
          paper &&
          (paper.url || paper.external_source) &&
          (getJournalFromURL(paper.url) !== "doi" &&
            paper.external_source !== "doi"),
        centered: true,
      },
    ];

    const metadata = this.metadata.filter((data) => data.active);
    let columnOne, columnTwo;

    if (metadata.length > 2) {
      columnOne = metadata.slice(0, 2);
      columnTwo = metadata.slice(2);
    } else {
      columnOne = metadata;
    }

    return (
      <div className={css(styles.row)}>
        {columnOne.length && (
          <div className={css(styles.column, styles.half)}>
            {columnOne.map((props) => (
              <PaperMetadata {...props} />
            ))}
          </div>
        )}
        {columnTwo && (
          <div className={css(styles.column, styles.half)}>
            {columnTwo.map((props) => (
              <PaperMetadata {...props} />
            ))}
          </div>
        )}
      </div>
    );
  };

  renderUploadedBy = () => {
    const { uploaded_by } = this.props.paper;
    if (uploaded_by) {
      let { author_profile } = uploaded_by;
      return (
        <div className={css(styles.labelContainer)}>
          <div
            onClick={this.navigateToSubmitter}
            className={css(styles.authorSection)}
          >
            <div className={css(styles.avatar)}>
              <AuthorAvatar author={author_profile} size={25} />
            </div>
            <span className={css(styles.labelText)}>
              {`${author_profile.first_name} ${author_profile.last_name}`}
            </span>
          </div>
        </div>
      );
    }
  };

  renderActions = () => {
    const { paper, isModerator, flagged, setFlag, isSubmitter } = this.props;

    let paperTitle = paper && paper.title;

    return (
      <div className={css(styles.actions) + " action-bars"}>
        <PermissionNotificationWrapper
          modalMessage="edit papers"
          onClick={this.navigateToEditPaperInfo}
          permissionKey="UpdatePaper"
          loginRequired={true}
          hideRipples={true}
          styling={styles.borderRadius}
        >
          <div className={css(styles.actionIcon)} data-tip={"Edit Paper"}>
            {icons.pencil}
          </div>
        </PermissionNotificationWrapper>
        <ShareAction
          addRipples={true}
          title={"Share this paper"}
          subtitle={paperTitle}
          url={this.props.shareUrl}
          customButton={
            <div className={css(styles.actionIcon)} data-tip={"Share Paper"}>
              {icons.shareAlt}
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
              {icons.arrowToBottom}
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
              {icons.externalLink}
            </span>
          </Ripples>
        )}
        {isModerator || isSubmitter ? (
          <span
            className={css(styles.actionIcon, styles.moderatorAction)}
            data-tip={paper.is_removed ? "Restore Page" : "Remove Page"}
          >
            <ActionButton
              isModerator={true}
              paperId={paper.id}
              restore={paper.is_removed}
              icon={paper.is_removed ? icons.plus : icons.minus}
              onAction={paper.is_removed ? this.restorePaper : this.removePaper}
              iconStyle={styles.moderatorIcon}
            />
          </span>
        ) : (
          <span data-tip={"Flag Paper"}>
            <FlagButton
              paperId={paper.id}
              flagged={flagged}
              setFlag={setFlag}
              style={styles.actionIcon}
            />
          </span>
        )}

        {isModerator && (
          <span
            className={css(styles.actionIcon, styles.moderatorAction)}
            data-tip={"Remove Page & Ban User"}
          >
            <ActionButton
              isModerator={isModerator}
              paperId={paper.id}
              iconStyle={styles.moderatorIcon}
            />
          </span>
        )}
      </div>
    );
  };

  renderPreview = () => {
    const { hovered, fetching, previews } = this.state;
    const height = 154;
    const width = 119;

    if (fetching) {
      return (
        <div
          className={css(styles.previewContainer)}
          onMouseEnter={this.setHover}
          onMouseLeave={this.unsetHover}
          onClick={() => !fetching && previews.length && this.toggleLightbox()}
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
            ready={!fetching}
            showLoadingAnimation
            customPlaceholder={<PreviewPlaceholder color="#efefef" />}
          >
            <Carousel
              afterSlide={(slideIndex) =>
                this.setState({ slideIndex: slideIndex + 1 })
              }
              renderBottomCenterControls={(arg) => {
                const {
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
                      {icons.angleLeft}
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
                      {icons.angleRight}
                    </span>
                  </div>
                );
              }}
              renderCenterLeftControls={null}
              renderCenterRightControls={null}
              wrapAround={true}
              enableKeyboardControls={true}
            >
              {previews.map((preview, i) => {
                if (i === 0) {
                  return (
                    <img
                      src={preview.file}
                      className={css(styles.image)}
                      key={`preview-${preview.id}-${i}`}
                      property="image"
                      style={{
                        minHeight: height,
                        maxHeight: height,
                        height,
                        width,
                        minWidth: width,
                        maxWidth: width,
                      }}
                      alt={`Paper PDF Page:${i + 1}`}
                    />
                  );
                }
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
                    alt={`Paper PDF Page:${i + 1}`}
                  />
                );
              })}
            </Carousel>
          </ReactPlaceholder>
        </div>
      );
    }
  };

  formatAuthors = () => {
    const { paper } = this.props;

    const authors = {};

    if (paper.authors && paper.authors.length > 0) {
      paper.authors.map((author) => {
        if (author.first_name && !author.last_name) {
          authors[author.first_name] = author;
        } else if (author.last_name && !author.first_name) {
          authors[author.last_name] = author;
        } else {
          authors[`${author.first_name} ${author.last_name}`] = author;
        }
      });
    } else {
      try {
        if (paper.raw_authors) {
          let rawAuthors = paper.raw_authors;
          if (typeof paper.raw_authors === "string") {
            rawAuthors = JSON.parse(paper.raw_authors);
            if (!Array.isArray(rawAuthors)) {
              rawAuthors = [rawAuthors];
            }
          } else if (
            typeof rawAuthors === "object" &&
            !Array.isArray(rawAuthors)
          ) {
            authors[rawAuthors["main_author"]] = true;

            rawAuthors["other_authors"].map((author) => {
              authors[author] = true;
            });

            return authors;
          }
          rawAuthors.forEach((author) => {
            if (author.first_name && !author.last_name) {
              authors[author.first_name] = true;
            } else if (author.last_name && !author.first_name) {
              authors[author.last_name] = true;
            } else {
              authors[`${author.first_name} ${author.last_name}`] = true;
            }
          });
        }
      } catch (e) {
        Sentry.captureException(e);
      }
    }

    return authors;
  };

  renderAuthors = () => {
    const authorsObj = this.formatAuthors();
    const authorKeys = Object.keys(authorsObj);
    const length = authorKeys.length;
    const authors = [];

    if (length >= 15) {
      let author = authorKeys[0];

      return (
        <>
          <span className={css(styles.rawAuthor)}>{`${author}, et al`}</span>
          <meta property="author" content={author} />
        </>
      );
    }

    for (let i = 0; i < authorKeys.length; i++) {
      let authorName = authorKeys[i];
      if (typeof authorsObj[authorName] === "object") {
        let author = authorsObj[authorName];
        authors.push(
          <Link
            href={"/user/[authorId]/[tabName]"}
            as={`/user/${author.id}/contributions`}
          >
            <a
              href={`/user/${author.id}/contributions`}
              className={css(styles.atag)}
            >
              <span className={css(styles.authorName)} property="name">
                {`${authorName}${i < length - 1 ? "," : ""}`}
              </span>
              <meta property="author" content={author} />
            </a>
          </Link>
        );
      } else {
        authors.push(
          <span className={css(styles.rawAuthor)}>
            {`${authorName}${i < length - 1 ? "," : ""}`}
            <meta property="author" content={authorName} />
          </span>
        );
      }
    }

    return authors;
  };

  renderPublishDate = () => {
    const { paper } = this.props;
    if (paper.paper_publish_date) {
      return formatPublishedDate(moment(paper.paper_publish_date), true);
    }
  };

  renderHubs = () => {
    const { paper } = this.props;

    if (paper.hubs && paper.hubs.length > 0) {
      return (
        <div className={css(styles.hubTags)}>
          {paper.hubs.map((hub, index) => {
            if (this.state.showAllHubs || index < 3) {
              let last = index === paper.hubs.length - 1;
              return (
                <div key={`hub_tag_index_${index}`}>
                  <HubTag
                    tag={hub}
                    gray={false}
                    overrideStyle={
                      this.state.showAllHubs ? styles.tagStyle : styles.hubTag
                    }
                    last={last}
                  />
                  <meta property="about" content={hub.name} />
                </div>
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

  renderPreregistrationTag = () => {
    return (
      <div className={css(styles.preRegContainer)}>
        <img
          src="/static/icons/wip.png"
          className={css(styles.preRegIcon)}
          alt="Preregistration Icon"
        />
        Funding Request
      </div>
    );
  };

  renderTopRow = () => {
    const { score, upvote, downvote } = this.props;
    return (
      <Fragment>
        <div className={css(styles.topRow)}>
          <div className={css(styles.mobileContainer)}>
            <div className={css(styles.mobileVoting)}>
              <VoteWidget
                score={score}
                onUpvote={upvote}
                onDownvote={downvote}
                selected={this.props.selectedVoteType}
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
    const {
      paper,
      score,
      upvote,
      downvote,
      selectedVoteType,
      doneFetchingPaper,
    } = this.props;

    const { fetching, previews, figureUrls } = this.state;

    return (
      <ReactPlaceholder
        ready={doneFetchingPaper}
        showLoadingAnimation
        customPlaceholder={<PaperPagePlaceholder color="#efefef" />}
      >
        <Fragment>
          <AuthorSupportModal />
          <div
            className={css(
              styles.container,
              this.state.dropdown && styles.overflow
            )}
            ref={this.containerRef}
            onMouseEnter={this.setHover}
            onMouseLeave={this.unsetHover}
            vocab="https://schema.org/"
            typeof="ScholarlyArticle"
          >
            <ReactTooltip />
            <meta property="description" content={paper.abstract} />
            <meta property="commentCount" content={paper.discussion_count} />

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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 20,
                    }}
                  >
                    <div className={css(styles.voting)}>
                      <VoteWidget
                        score={score}
                        onUpvote={upvote}
                        onDownvote={downvote}
                        selected={this.props.selectedVoteType}
                        isPaper={true}
                        type={"Paper"}
                        paperPage={true}
                        promoted={this.props.paper && this.props.paper.promoted}
                        paper={
                          this.props.paper &&
                          this.props.paper.promoted !== false
                            ? this.props.paper
                            : null
                        }
                        showPromotion={true}
                        horizontalView={true}
                      />
                    </div>
                    <div className={css(styles.actionsContainer)}>
                      {this.renderActions()}
                    </div>
                  </div>
                  <div className={css(styles.metaContainer)}>
                    <div className={css(styles.titleHeader)}>
                      <h1 className={css(styles.title)} property={"headline"}>
                        {paper && paper.title}
                      </h1>
                      <PaperMetadata
                        active={
                          paper.paper_title && paper.paper_title !== paper.title
                        }
                        label={"Paper Title"}
                        value={
                          <h3
                            className={css(styles.metadata)}
                            property={"name"}
                          >
                            {paper.paper_title}
                          </h3>
                        }
                        containerStyles={styles.paperTitle}
                      />
                    </div>
                    <div className={css(styles.column)}>
                      {this.renderMetadata()}
                      <div
                        className={css(
                          styles.uploadedByContainer,
                          styles.mobile
                        )}
                      >
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
                                  color={"rgb(255, 255, 255)"}
                                  opacity={1}
                                />
                              </span>
                              Support
                            </div>
                          </PermissionNotificationWrapper>
                        </div>
                      </div>
                    </div>
                    <div className={css(styles.mobile)}>
                      {process.browser && this.renderPreview()}
                    </div>
                    <div className={css(styles.mobile, styles.preregMobile)}>
                      {paper &&
                        paper.paper_type === "PRE_REGISTRATION" &&
                        this.renderPreregistrationTag()}
                      {this.renderHubs()}
                    </div>
                  </div>
                </div>
                <div className={css(styles.rightColumn, styles.mobile)}>
                  <div className={css(styles.actionMobileContainer)}>
                    {this.renderActions()}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className={css(styles.absolutePreview)}>
              {process.browser && this.renderPreview()}
            </div> */}
          </div>
          <div className={css(styles.bottomContainer)}>
            <div className={css(styles.bottomRow)}>
              <PermissionNotificationWrapper
                modalMessage="promote paper"
                onClick={() =>
                  this.props.paper.paper_type === "PRE_REGISTRATION"
                    ? this.props.openAuthorSupportModal(true, {
                        paper: this.props.paper,
                      })
                    : this.props.openPaperTransactionModal(true)
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
                    <BoltSvg color={"rgb(255, 255, 255)"} opacity={1} />
                  </span>
                  {this.props.paper &&
                  this.props.paper.paper_type === "PRE_REGISTRATION"
                    ? "Support Project"
                    : "Support"}
                </div>
              </PermissionNotificationWrapper>
            </div>
            <div className={css(styles.bottomRow, styles.hubsRow)}>
              {this.renderHubs()}
            </div>
          </div>
        </Fragment>
      </ReactPlaceholder>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    position: "relative",
    overflow: "visible",
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
    ":hover .action-bars": {
      opacity: 1,
    },
  },
  half: {
    alignItems: "flex-start",
    width: "50%",
    paddingRight: 10,
    "@media only screen and (max-width: 768px)": {
      width: "100%",
      paddingRight: 0,
    },
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
    justifyContent: "flex-end",
    width: "100%",
    flexWrap: "wrap",
  },
  hubTag: {
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    position: "relative",
    wordBreak: "break-word",
    fontWeight: "unset",
    padding: 0,
    margin: 0,
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
  paperTitle: {
    margin: "8px 0 0",
  },
  subtitle: {
    color: "#241F3A",
    opacity: 0.5,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "unset",
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
  authorName: {
    marginRight: 8,
    cursor: "pointer",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    ":hover": {
      color: colors.BLUE(),
      opacity: 1,
    },
  },
  rawAuthor: {
    marginRight: 8,
    cursor: "default",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  authors: {
    display: "flex",
    alignItems: "center",
  },
  marginTop: {
    marginTop: 5,
  },
  authorLabelContainer: {
    alignItems: "flex-start",
  },
  labelContainer: {
    fontSize: 16,
    color: "#241F3A",
    display: "flex",
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  metadata: {
    fontSize: 16,
    color: colors.BLACK(0.7),
    margin: 0,
    padding: 0,
    fontWeight: "unset",
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  labelText: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
    color: "#241F3A",
    width: 120,
    opacity: 0.7,

    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  authorLabel: {
    marginRight: 0,
    opacity: 0.7,
    minWidth: 61,
    width: 61,
  },
  authorsContainer: {
    width: "100%",
  },
  voting: {
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
    top: 35,
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
    opacity: 0,
    transition: "all ease-in-out 0.2s",

    "@media only screen and (max-width: 768px)": {
      paddingBottom: 15,
    },
  },
  actionsContainer: {
    // marginRight: 30,
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
    marginRight: 10,
    ":hover": {
      color: "rgba(36, 31, 58, 0.8)",
      backgroundColor: "#EDEDF0",
      borderColor: "#d8d8de",
    },
  },
  moderatorAction: {
    ":hover": {
      backgroundColor: colors.RED(0.3),
      borderColor: colors.RED(),
    },
    ":hover .modIcon": {
      color: colors.RED(),
    },
  },
  moderatorIcon: {
    color: colors.RED(0.6),
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: colors.RED(1),
    },
  },
  downloadActionIcon: {
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
    justifyContent: "flex-start",
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
  bottomContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    margin: "15px 0px 20px 0",
    marginTop: 0,
  },
  bottomRow: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: 20,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  hubsRow: {},
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
    marginRight: 4,
  },
  authorSection: {
    display: "flex",
    cursor: "pointer",

    ":hover": {
      color: colors.PURPLE(1),
    },
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
    border: `1px solid ${colors.BLUE()}`,
    backgroundColor: colors.BLUE(),
    color: "#FFF",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#3E43E8",
    },
    "@media only screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
  boostIcon: {
    color: "#FFF",
    marginRight: 8,
  },
  link: {
    cursor: "pointer",
    color: colors.BLUE(),
    textDecoration: "unset",
    ":hover": {
      color: colors.BLUE(),
      textDecoration: "underline",
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
  preregMobile: {
    alignItems: "flex-start",
  },
  preRegContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    color: "rgba(36, 31, 58, 0.7)",
    marginTop: 15,
    fontSize: 16,
    fontWeight: 500,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
  },
  preRegIcon: {
    height: 20,
    marginRight: 8,
    "@media only screen and (max-width: 415px)": {
      height: 15,
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

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(
  null,
  mapDispatchToProps
)(PaperPageCard);
