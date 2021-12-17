import * as Sentry from "@sentry/browser";
import * as moment from "dayjs";
import Link from "next/link";
import ReactPlaceholder from "react-placeholder/lib";
import ReactTooltip from "react-tooltip";
import Router from "next/router";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { createRef, Component } from "react";

// Components
import ActionButton from "~/components/ActionButton";
import AuthorAvatar from "~/components/AuthorAvatar";
import DownloadPDFButton from "~/components/DownloadPDFButton";
import FlagButton from "~/components/FlagButton";
import HubTag from "~/components/Hubs/HubTag";
import PaperMetadata from "./Paper/PaperMetadata";
import PaperPagePlaceholder from "~/components/Placeholders/PaperPagePlaceholder";
import PaperPromotionButton from "./Paper/PaperPromotionButton";
import PaperPromotionIcon from "./Paper/PaperPromotionIcon";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import ShareAction from "~/components/ShareAction";
import VoteWidget from "~/components/VoteWidget";

// redux
import { ModalActions } from "~/redux/modals";

// Config
import API from "~/config/api";
import PaperPreview from "./Paper/SideColumn/PaperPreview";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "../redux/message";
import { formatPublishedDate } from "~/config/utils/dates";
import { removeLineBreaksInStr, stripHTML } from "~/config/utils/string";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { isDevEnv } from "~/config/utils/env";
import { parseMath } from "~/config/utils/latex";

// Dynamic modules
import dynamic from "next/dynamic";
const AuthorSupportModal = dynamic(() =>
  import("~/components/Modals/AuthorSupportModal")
);

class PaperPageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      previewAvailable: false,
      hovered: false,
      toggleLightbox: true,
      fetching: false,
      slideIndex: 1,
      showAllHubs: false, // only needed when > 3 hubs,
      boostHover: false,
      title: {
        parsed: this.parseTitle(props?.paper?.title),
        raw: props?.paper?.title,
      },
    };
    this.containerRef = createRef();
    this.metaContainerRef = createRef();
  }

  componentWillUnmount() {
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const didTitleChange = this.props.paper?.title !== this.state.title.raw;

    if (didTitleChange) {
      this.setState({
        title: {
          parsed: this.parseTitle(this.props.paper?.title),
          raw: this.props.paper?.title,
        },
      });
    }
  }

  parseTitle(title) {
    title = stripHTML(title);
    title = parseMath(title);
    return title;
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
    if (isModerator || isSubmitter) {
      params.is_removed = false;
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
      isEditorOfHubs,
      isModerator,
      isSubmitter,
      paperId,
      removePaper,
      setMessage,
      showMessage,
    } = this.props;

    let params = {};
    if (isModerator || isSubmitter || isEditorOfHubs) {
      params.is_removed = true;
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
    Router.push("/user/[authorId]/[tabName]", `/user/${authorId}/overview`);
  };

  renderMetadata = () => {
    const { paper } = this.props;

    this.metadata = [
      {
        label: "Published",
        value: (
          <span
            className={css(styles.metadata) + " clamp1"}
            property="datePublished"
            dateTime={paper.paper_publish_date}
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
            className={css(styles.metadata, styles.link) + " clamp1"}
            rel="noreferrer noopener"
            data-test={isDevEnv() ? `doi` : undefined}
          >
            {paper.doi}
          </a>
        ),
        active: paper && paper.doi,
      },
    ];

    const metadata = this.metadata.filter((data) => data.active);

    return (
      <div>
        <div className={css(styles.row)}>
          {metadata.map((props, i) => (
            <PaperMetadata
              key={`metadata-${i}`}
              {...props}
              containerStyles={i === 0 && styles.marginRight}
            />
          ))}
        </div>
        <div className={css(styles.row, styles.lastRow)}>
          <PaperMetadata
            label={"Paper Title"}
            active={
              paper.paper_title &&
              removeLineBreaksInStr(paper.paper_title) !==
                removeLineBreaksInStr(paper.title)
            }
            value={
              <h3 className={css(styles.metadata)} property={"name"}>
                {paper.paper_title}
              </h3>
            }
          />
        </div>
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
    const {
      flagged,
      isEditorOfHubs,
      isModerator,
      isSubmitter,
      paper,
      setFlag,
    } = this.props;
    const { paper_title, title, uploaded_by } = paper || {};
    const uploadedById = uploaded_by && paper.uploaded_by.id;
    const isUploaderSuspended =
      paper && paper.uploaded_by && paper.uploaded_by.is_suspended;
    const formattedPaperTitle =
      !isNullOrUndefined(title) && title.length > 0 ? title : paper_title || "";
    const actionButtons = [
      {
        active: true,
        button: (
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
        ),
      },
      {
        active: true,
        button: (
          <ShareAction
            addRipples={true}
            title={"Share this paper"}
            subtitle={formattedPaperTitle}
            url={this.props.shareUrl}
            customButton={
              <div className={css(styles.actionIcon)} data-tip={"Share Paper"}>
                {icons.shareAlt}
              </div>
            }
          />
        ),
      },
      {
        active: true,
        button: (
          <span data-tip={"Support Paper"}>
            <PaperPromotionButton
              paper={paper}
              customStyle={styles.actionIcon}
            />
          </span>
        ),
      },
      {
        active: !isSubmitter,
        button: (
          <span data-tip={"Flag Paper"}>
            <FlagButton
              paperId={paper.id}
              flagged={flagged}
              setFlag={setFlag}
              style={styles.actionIcon}
            />
          </span>
        ),
      },
      {
        active: isModerator || isSubmitter || isEditorOfHubs,
        button: (
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
              containerStyle={styles.moderatorContainer}
              iconStyle={styles.moderatorIcon}
            />
          </span>
        ),
      },
      {
        active: isModerator && !isNullOrUndefined(uploadedById),
        button: (
          <>
            <ReactTooltip />
            <span
              className={css(styles.actionIcon, styles.moderatorAction)}
              data-tip={
                isUploaderSuspended
                  ? "Reinstate User"
                  : "Remove Page & Ban User"
              }
            >
              <ActionButton
                isModerator={isModerator}
                paperId={paper.id}
                uploadedById={uploadedById}
                isUploaderSuspended={isUploaderSuspended}
                containerStyle={styles.moderatorContainer}
                iconStyle={styles.moderatorIcon}
                actionType="user"
              />
            </span>
          </>
        ),
      },
    ].filter((action) => action.active);

    return (
      <div className={css(styles.actions) + " action-bars"}>
        {actionButtons.map((action, i) => {
          if (actionButtons.length - 1 === i) {
            return action.button;
          }

          return (
            <span className={css(styles.actionButtonMargin)}>
              {action.button}
            </span>
          );
        })}
      </div>
    );
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
            as={`/user/${author.id}/overview`}
            key={`authorName-${author.id}`}
          >
            <a
              href={`/user/${author.id}/overview`}
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
          <span className={css(styles.rawAuthor)} key={`rawAuthor-${i}`}>
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

  render() {
    const {
      paper,
      score,
      upvote,
      downvote,
      selectedVoteType,
      doneFetchingPaper,
      discussionCount,
    } = this.props;
    const { fetching, previews, previewAvailable, title } = this.state;
    const { boost_amount, paper_title } = paper;
    const promotedScore = score + boost_amount;
    const formattedPaperTitle =
      !isNullOrUndefined(title) && title.length > 0 ? title : paper_title || "";

    return (
      <ReactPlaceholder
        ready={doneFetchingPaper}
        showLoadingAnimation
        customPlaceholder={<PaperPagePlaceholder color="#efefef" />}
      >
        <div
          className={css(styles.mainContainer)}
          data-test={isDevEnv() ? `paper-${paper.id}` : undefined}
        >
          <div className={css(styles.main)}>
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
              <div className={css(styles.voting)}>
                <VoteWidget
                  score={promotedScore}
                  onUpvote={upvote}
                  onDownvote={downvote}
                  selected={selectedVoteType}
                  isPaper
                  type={"Paper"}
                />
                <PaperPromotionIcon paper={paper} isPaper />
              </div>
              <div
                className={css(
                  styles.column,
                  !fetching && previews.length === 0 && styles.emptyPreview
                )}
                ref={this.metaContainerRef}
              >
                <div className={css(styles.reverseRow)}>
                  <div
                    className={css(
                      styles.cardContainer,
                      !fetching && previews.length === 0 && styles.emptyPreview
                    )}
                  >
                    <div className={css(styles.metaContainer)}>
                      <div className={css(styles.titleHeader)}>
                        <div className={css(styles.row)}>
                          <h1
                            className={css(styles.title)}
                            property={"headline"}
                          >
                            {title.parsed}
                          </h1>
                        </div>
                      </div>
                      <div className={css(styles.column)}>
                        {this.renderMetadata()}
                      </div>
                    </div>
                  </div>
                  <div className={css(styles.rightColumn, styles.mobile)}>
                    <div className={css(styles.votingMobile)}>
                      <VoteWidget
                        score={promotedScore}
                        onUpvote={upvote}
                        onDownvote={downvote}
                        selected={selectedVoteType}
                        horizontalView
                        isPaper
                        type={"Paper"}
                      />
                      <PaperPromotionIcon paper={paper} isPaper />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
            <div className={css(styles.previewBox)}>
              <PaperPreview
                paper={paper}
                previewStyles={styles.previewBox}
                columnOverrideStyles={styles.columnOverrideStyles}
                onLoad={(success) =>
                  this.setState({ previewAvailable: success })
                }
              />
            </div>
          }
        </div>
        <div className={css(styles.bottomContainer)}>
          <div className={css(styles.bottomRow)}>{this.renderActions()}</div>
          <div className={css(styles.downloadPDFContainer)}>
            <div className={css(styles.downloadPDFWrapper)}>
              {(paper.file || paper.pdf_url) && (
                <DownloadPDFButton
                  file={paper.file || paper.pdf_url}
                  style={styles.hideOnSmall}
                />
              )}
            </div>
          </div>
        </div>
      </ReactPlaceholder>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "100%",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    marginRight: 16,
    width: "100%",
  },
  previewStyles: {},
  container: {
    width: "100%",
    display: "flex",
    position: "relative",
    overflow: "visible",
    boxSizing: "border-box",
  },
  overflow: {
    overflow: "visible",
  },
  previewBox: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: "140px",
    minHeight: "140px",

    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  hideOnSmall: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  columnOverrideStyles: {
    width: "100%",
    height: "100%",
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
    fontSize: 28,
    position: "relative",
    wordBreak: "break-word",
    fontWeight: "unset",
    padding: 0,
    margin: 0,
    display: "block",
    borderSpacing: "initial",
    "@media only screen and (max-width: 760px)": {
      fontSize: 24,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 20,
    },
  },
  titleHeader: {
    marginTop: 5,
    marginBottom: 23,
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
    width: 65,
    fontSize: 16,
    position: "absolute",
    top: 0,
    left: -70,
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  votingMobile: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
    display: "flex",
    alignItems: "center",
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
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  actionsContainer: {},
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
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
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
  actionButtonMargin: {
    marginRight: 10,
  },
  moderatorContainer: {
    padding: 5,
    borderRadius: "50%",
    width: 22,
    minWidth: 22,
    maxWidth: 22,
    height: 22,
    minHeight: 22,
    maxHeight: 22,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    "@media only screen and (max-width: 415px)": {
      fontSize: 13,
      width: 15,
      minWidth: 15,
      maxWidth: 15,
      height: 15,
      minHeight: 15,
      maxHeight: 15,
    },
  },
  moderatorIcon: {
    color: colors.RED(0.6),
    fontSize: 18,
    cursor: "pointer",
    ":hover": {
      color: colors.RED(1),
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
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
    flexWrap: "wrap",

    /**
     * Set the width of the Label ("Paper Title:", "Published:") to align text, but only do so
     * to the first element on each row. This selector is equivalent to row > "first child". */
    ":nth-child(1n) > *:nth-child(1) > div": {
      minWidth: 80,
    },

    "@media only screen and (max-width: 1023px)": {
      flexDirection: "column",
    },
  },
  lastRow: {},
  reverseRow: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column-reverse",
    },
  },
  marginRight: {
    marginRight: 40,
    "@media only screen and (max-width: 1023px)": {
      marginRight: 0,
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
    marginTop: 15,
  },
  bottomRow: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      // display: "none",
    },
  },
  downloadPDFContainer: {
    display: "flex",
    alignSelf: "flex-end",
    width: "140px",
    height: "32px",
    justifyContent: "center",
    alignItems: "center", // Center vertically
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
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexDirection: "row",
      paddingBottom: 10,
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
    marginLeft: 20,
    ":hover": {
      backgroundColor: "#3E43E8",
    },
    "@media only screen and (max-width: 768px)": {
      fontSize: 12,
    },
  },
  boostIcon: {
    color: "#FFF",
    paddingTop: 2,
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

export default connect(null, mapDispatchToProps)(PaperPageCard);
