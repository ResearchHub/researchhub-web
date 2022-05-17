import * as Sentry from "@sentry/browser";
import API from "~/config/api";
import ActionButton from "~/components/ActionButton";
import Button from "~/components/Form/Button";
import DiscussionCount from "~/components/DiscussionCount";
import HubTag from "~/components/Hubs/HubTag";
import Link from "next/link";
import PaperPromotionButton from "./Paper/PaperPromotionButton";
import PaperPromotionIcon from "./Paper/PaperPromotionIcon";
import PermissionNotificationWrapper from "~/components/PermissionNotificationWrapper";
import ReactHtmlParser from "react-html-parser";
import ReactTooltip from "react-tooltip";
import ShareAction from "~/components/ShareAction";
import VoteWidget from "~/components/VoteWidget";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import icons from "~/config/themes/icons";
import removeMd from "remove-markdown";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "../redux/message";
import { ModalActions } from "~/redux/modals";
import { StyleSheet, css } from "aphrodite";
import { UPVOTE, DOWNVOTE, userVoteToConstant } from "~/config/constants";
import { breakpoints } from "~/config/themes/screen";
import { connect } from "react-redux";
import { createRef, Component } from "react";
import { flagGrmContent } from "./Flag/api/postGrmFlag";
import { isNullOrUndefined, silentEmptyFnc } from "~/config/utils/nullchecks";
import FlagButtonV2 from "./Flag/FlagButtonV2";

const DynamicCKEditor = dynamic(() =>
  import("~/components/CKEditor/SimpleEditor")
);

const AuthorSupportModal = dynamic(() =>
  import("~/components/Modals/AuthorSupportModal")
);

class PostPageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previews: [],
      figureUrls: [],
      hovered: false,
      fetching: false,
      slideIndex: 1,
      showAllHubs: false, // only needed when > 3 hubs,
      boostHover: false,
      voteState: userVoteToConstant(props.post.user_vote),
      score: props.post.score,
      showPostEditor: false,
      postBody: this.props.post.full_markdown,
    };
    this.containerRef = createRef();
    this.metaContainerRef = createRef();
    this.editorRef = createRef();

    this.onUpvote = this.createVoteHandler(UPVOTE);
    this.onDownvote = this.createVoteHandler(DOWNVOTE);
  }

  componentWillUnmount() {
    if (document.body.style) {
      document.body.style.overflow = "scroll";
    }
  }

  componentDidMount() {
    this.editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@thomasvu/ckeditor5-custom-build").SimpleBalloonEditor,
    };
  }

  restoreThisPost = () => {
    let {
      isEditorOfHubs,
      isModerator,
      isSubmitter,
      post,
      restorePost,
      setMessage,
      showMessage,
    } = this.props;
    let params = {};
    if (isModerator || isSubmitter || isEditorOfHubs) {
      params.is_removed = false;
    }

    return fetch(
      API.RESTORE_DOC({ documentId: post.unified_document_id }),
      API.PATCH_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setMessage("Post Successfully Restored.");
        showMessage({ show: true });
        restorePost && restorePost();
      })
      .catch((error) => {
        setMessage("Post could not be restored");
        showMessage({ show: true, error: true });
        console.log(error);
        Sentry.captureEvent(error);
      });
  };

  removeThisPost = () => {
    let {
      isEditorOfHubs,
      isModerator,
      isSubmitter,
      post,
      removePost,
      setMessage,
      showMessage,
    } = this.props;
    let params = {};
    if (isModerator || isSubmitter || isEditorOfHubs) {
      params.is_removed = true;
    }

    return fetch(
      API.CENSOR_DOC({ documentId: post.unified_document_id }),
      API.PATCH_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        setMessage("Post Successfully Removed.");
        showMessage({ show: true });
        removePost && removePost();
      })
      .catch((error) => {
        setMessage("Post not removed");
        showMessage({ show: true, error: true });
        console.log(error);
        Sentry.captureEvent(error);
      });
  };

  toggleShowHubs = () => {
    this.setState({ showAllHubs: !this.state.showAllHubs });
  };

  firstImageFromHtml = (text) => {
    const elements = ReactHtmlParser(text);
    for (const element of elements) {
      if (element?.type === "figure") {
        return element.props.children[0].props.src;
      }
    }
    return null;
  };

  toPlaintext = (text) => {
    return removeMd(text).replace(/&nbsp;/g, " ");
  };

  toggleShowPostEditor = () => {
    ReactTooltip.hide();
    this.setState({ showPostEditor: !this.state.showPostEditor });
  };

  sendPost = () => {
    const { post, setMessage, showMessage } = this.props;
    const { postBody } = this.state;

    const params = {
      created_by: this.props.user.id,
      document_type: "DISCUSSION",
      full_src: postBody,
      post_id: post.id,
      preview_img: this.firstImageFromHtml(postBody),
      renderable_text: this.toPlaintext(postBody),
      title: post.title,
    };

    this.toggleShowPostEditor();
    return fetch(API.RESEARCHHUB_POSTS({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .catch((error) => {
        setMessage("Could not save changes");
        showMessage({ show: true, error: true });
        console.log(error);
        Sentry.captureEvent(error);
      });
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

  renderActions = () => {
    const { post, isEditorOfHubs, isModerator, isSubmitter, user } = this.props;

    const uploadedById =
      post && post.created_by && post.created_by.author_profile.id;
    const isUploaderSuspended =
      post && post.created_by && post.created_by.is_suspended;

    const isAuthor = post.authors
      .map((author) => author.user)
      .includes(user.id);
    const actionButtons = [
      {
        active:
          (isSubmitter || isAuthor) && !post.note?.unified_document.is_removed,
        button: post.note ? (
          <Link
            href={`/${post.note.organization.slug}/notebook/${post.note.id}`}
          >
            <a className={css(styles.actionIcon)} data-tip={"Edit Post"}>
              {icons.pencil}
            </a>
          </Link>
        ) : (
          <PermissionNotificationWrapper
            modalMessage="edit post"
            onClick={this.toggleShowPostEditor}
            permissionKey="UpdatePaper"
            loginRequired={true}
            hideRipples={true}
            styling={styles.borderRadius}
          >
            <ReactTooltip />
            <div className={css(styles.actionIcon)} data-tip={"Edit Post"}>
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
            title={"Share this post"}
            subtitle={post && post.title}
            url={this.props.shareUrl}
            customButton={
              <div className={css(styles.actionIcon)} data-tip={"Share Post"}>
                {icons.shareAlt}
              </div>
            }
          />
        ),
      },
      {
        active: true,
        button: (
          <span data-tip={"Support Post"}>
            <PaperPromotionButton post={post} customStyle={styles.actionIcon} />
          </span>
        ),
      },
      {
        active: true,
        button: (
          <FlagButtonV2
            modalHeaderText="Flagging"
            onSubmit={(flagReason) => {
              flagGrmContent({
                contentID: post.id,
                contentType: "post",
                flagReason,
                onError: Sentry.captureEvent,
                onSuccess: silentEmptyFnc,
              });
            }}
            subHeaderText="Why isn't this suited for ResearchHub?"
          />
        ),
      },
      {
        active: isModerator || isSubmitter || isAuthor || isEditorOfHubs,
        button: (
          <span
            className={css(styles.actionIcon, styles.moderatorAction)}
            data-tip={post.is_removed ? "Restore Page" : "Remove Page"}
          >
            <ActionButton
              isModerator={true}
              paperId={post.id}
              restore={post.is_removed}
              icon={post.is_removed ? icons.plus : icons.minus}
              onAction={
                post.is_removed ? this.restoreThisPost : this.removeThisPost
              }
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
              data-tip={isUploaderSuspended ? "Reinstate User" : "Ban User"}
            >
              <ActionButton
                isModerator={isModerator}
                paperId={post.id}
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
            return <span key={i}>{action.button}</span>;
          }

          return (
            <span key={i} className={css(styles.actionButtonMargin)}>
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

  createVoteHandler = (voteType) => {
    const { post } = this.props;
    const voteStrategies = {
      [UPVOTE]: {
        increment: 1,
        getUrl: API.RH_POST_UPVOTE,
      },
      [DOWNVOTE]: {
        increment: -1,
        getUrl: API.RH_POST_DOWNVOTE,
      },
    };

    const { increment, getUrl } = voteStrategies[voteType];

    const handleVote = async (postId) => {
      const response = await fetch(getUrl(postId), API.POST_CONFIG()).catch(
        (err) => console.log(err)
      );

      return response;
    };

    return async (e) => {
      e.stopPropagation();

      const {
        user,
        post: {
          created_by: { author_profile: author },
        },
      } = this.props;

      if (user && user.author_profile.id === author.id) {
        console.log("Not logged in or Attempted to vote own post");
        return;
      }

      if (this.state.voteState === voteType) {
        /**
         * Deselect
         * NOTE: This will never be called with the current implementation of
         * VoteWidget, because it disables the onVote/onDownvote callback
         * if the button is already selected.
         */
        this.setState((prev) => ({
          voteState: null,
          score: prev.score - increment, // Undo the vote
        }));
      } else {
        this.setState({ voteState: voteType });
        if (
          this.state.voteState === UPVOTE ||
          this.state.voteState === DOWNVOTE
        ) {
          // If post was already upvoted / downvoted by user, then voting
          // oppoistely will reverse the score by twice as much
          this.setState((prev) => ({ score: prev.score + increment * 2 }));
        } else {
          // User has not voted, so regular vote
          this.setState((prev) => ({ score: prev.score + increment }));
        }
      }

      await handleVote(post.id);
    };
  };

  render() {
    const { post } = this.props;
    const { fetching, postBody, previews, score, voteState } = this.state;

    const voteWidget = (horizontalView) => (
      <VoteWidget
        score={score}
        onUpvote={this.onUpvote}
        onDownvote={this.onDownvote}
        selected={voteState}
        horizontalView={horizontalView}
        isPaper={false}
        type={"Discussion"}
      />
    );

    return (
      <div className={css(styles.mainContainer)}>
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
            <meta property="description" content={post.title} />
            <meta property="commentCount" content={post.discussion_count} />
            <div className={css(styles.voting)}>
              {voteWidget(false)}
              <div className={css(styles.discussionCountWrapper)}>
                <DiscussionCount
                  docType="post"
                  slug={post.slug}
                  id={post.id}
                  count={post.discussion_count}
                />
              </div>
              <PaperPromotionIcon post={post} />
            </div>
            <div className={css(styles.column)} ref={this.metaContainerRef}>
              <div className={css(styles.reverseRow)}>
                <div className={css(styles.cardContainer)}>
                  <div className={css(styles.metaContainer)}>
                    {!post.note && (
                      <div className={css(styles.titleHeader)}>
                        <div className={css(styles.row)}>
                          <h1
                            className={css(styles.title)}
                            property={"headline"}
                          >
                            {post.title}
                          </h1>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={css(styles.rightColumn, styles.mobile)}>
                  <div className={css(styles.votingMobile)}>
                    {voteWidget(true)}
                    <div className={css(styles.discussionCountWrapper)}>
                      <DiscussionCount
                        docType="post"
                        slug={post.slug}
                        id={post.id}
                        count={post.discussion_count}
                      />
                      <a
                        href="#comments"
                        className={css(styles.discussionText)}
                      >
                        <span>Join the Discussion</span>
                      </a>
                    </div>
                    <PaperPromotionIcon post={post} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={"post-body"}>
            {this.state.showPostEditor ? (
              <>
                <DynamicCKEditor
                  containerStyle={post.note && styles.editor}
                  editing
                  id="editPostBody"
                  initialData={postBody}
                  isBalloonEditor
                  labelStyle={styles.label}
                  noTitle={!post.note}
                  onChange={(id, editorData) =>
                    this.setState({ postBody: editorData })
                  }
                  readOnly={false}
                />
                <div className={css(styles.editButtonRow)}>
                  <Button
                    isWhite={true}
                    label={"Cancel"}
                    onClick={this.toggleShowPostEditor}
                    size={"small"}
                  />
                  <Button
                    label={"Save"}
                    onClick={this.sendPost}
                    size={"small"}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <DynamicCKEditor
                    containerStyle={post.note && styles.editor}
                    id={"postBody"}
                    initialData={postBody}
                    isBalloonEditor
                    labelStyle={styles.label}
                    noTitle={!post.note}
                    readOnly
                  />
                </div>
                <div className={css(styles.bottomContainer)}>
                  <div className={css(styles.bottomRow)}>
                    {this.renderActions()}
                  </div>
                  <div className={css(styles.downloadPDF)}></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  discussionCountWrapper: {
    marginTop: 10,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 1,
      display: "flex",
    },
  },
  discussionText: {
    whiteSpace: "nowrap",
    marginLeft: 12,
    color: colors.BLACK(0.5),
    fontSize: 14,
    marginTop: 4,
    textDecoration: "none",
  },
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
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    ":hover .action-bars": {
      opacity: 1,
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
    display: "flex",

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
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    opacity: 1,
    transition: "all ease-in-out 0.2s",
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
  borderRadius: {
    borderRadius: "50%",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    // minHeight: 25,
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
  reverseRow: {
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
  bottomContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
    marginTop: 20,
    "@media only screen and (max-width: 767px)": {
      margin: 0,
    },
  },
  bottomRow: {
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
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
  atag: {
    color: "unset",
    textDecoration: "unset",
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
  editButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editor: {
    marginTop: -20,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostPageCard);
