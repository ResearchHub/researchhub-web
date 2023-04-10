import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { connect } from "react-redux";
import { createRef, Component } from "react";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "../redux/message";
import { ModalActions } from "~/redux/modals";
import { StyleSheet, css } from "aphrodite";
import * as Sentry from "@sentry/browser";
import AbstractPlaceholder from "./Placeholders/AbstractPlaceholder";
import API from "~/config/api";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import CreateBountyBtn from "./Bounty/CreateBountyBtn";
import DocumentHeader from "./Document/DocumentHeader";
import dynamic from "next/dynamic";
import ReactHtmlParser from "react-html-parser";
import ReactPlaceholder from "react-placeholder/lib";
import ReactTooltip from "react-tooltip";
import removeMd from "remove-markdown";
import router from "next/router";
import trimEmptyParagraphs from "./TextEditor/util/trimEmptyParagraphs";
import { EFFORT_LEVEL_DESCRIPTIONS } from "./Bounty/BountyWizardRSCForm";

import EffortLevel from "./shared/EffortLevel";

const DynamicCKEditor = dynamic(() =>
  import("~/components/CKEditor/SimpleEditor")
);

class PostPageCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPostEditor: false,
      postBody: this.props.post.markdown,
      post: this.props.post,
    };
    this.editorRef = createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.post.isReady !== this.props.post.isReady) {
      this.setState({
        post: this.props.post,
        postBody: this.props.post.markdown,
      });
    }
  }

  componentDidMount() {
    this.editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@researchhub/ckeditor5-custom-build")
        .SimpleBalloonEditor,
    };
  }

  toPlaintext = (text) => {
    return removeMd(text).replace(/&nbsp;/g, " ");
  };

  toggleShowPostEditor = () => {
    const { note } = this.state.post;

    if (note) {
      router.push(`/${note.organization.slug}/notebook/${note.id}`);
    } else {
      ReactTooltip.hide();
      this.setState({ showPostEditor: !this.state.showPostEditor });
    }
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

  sendPost = () => {
    const { setMessage, showMessage } = this.props;
    const { postBody, post } = this.state;

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
    return fetch(API.RESEARCHHUB_POST({}), API.POST_CONFIG(params))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .catch((error) => {
        setMessage("Could not save changes");
        showMessage({ show: true, error: true });
        emptyFncWithMsg(error);
        Sentry.captureEvent(error);
      });
  };

  render() {
    const { post, removePost, restorePost, user, bounties, auth } = this.props;
    const { postBody } = this.state;
    const isEditMode = this.state.showPostEditor;

    const userBounty =
      bounties && bounties.find((bounty) => bounty?.createdBy?.id === user?.id);

    const userHasBounty = Boolean(userBounty);

    let initialData = postBody;

    if (!isEditMode && typeof initialData === "string") {
      initialData = trimEmptyParagraphs({ htmlStr: postBody });
    }

    // This logic should happen inside award bounty modal
    // Copied/pasted from paper index page. not good.
    let bountyComments = [];
    this.props.threads.forEach((thread) => {
      if (post?.unifiedDocument?.documentType === "question") {
        bountyComments.push({
          data: thread.data,
        });
      } else {
        // This clause should check for bounty in case user opened multiple
        if (
          thread?.data?.created_by?.author_profile?.id ===
          auth?.user?.author_profile?.id
        ) {
          (thread.data.comments || []).forEach((comment) => {
            bountyComments.push({
              data: comment,
            });
          });
        }
      }
    });

    return (
      <div className={css(styles.mainContainer)}>
        <div className={css(styles.main)}>
          <DocumentHeader
            handleEdit={this.toggleShowPostEditor}
            document={post}
            setHasBounties={this.props.setHasBounties}
            onDocumentRemove={removePost}
            onDocumentRestore={restorePost}
            hasBounties={this.props.hasBounties}
            allBounties={this.props.bounties}
            bountyText={this.toPlaintext(postBody)}
            bountyType={post?.unifiedDocument?.documentType}
            threads={bountyComments}
            isOriginalPoster={post?.unifiedDocument?.createdBy?.id === user.id}
            currentUser={user}
            post={post}
            onBountyAdd={(bounty) => {
              this.props.setBounties([...this.props.bounties, bounty]);
            }}
            onBountyRemove={(bountyId) =>
              this.props.setBounties(
                this.props.bounties.filter((b) => b.id !== bountyId)
              )
            }
          />
          <div className={css(styles.section, styles.postBody) + " post-body"}>
            <ReactPlaceholder
              ready={post.isReady}
              showLoadingAnimation
              customPlaceholder={<AbstractPlaceholder color="#efefef" />}
            >
              {post?.unifiedDocument?.documentType === "bounty" && (
                <div className={css(styles.table)}>
                  <div className={css(styles.tableEntry)}>
                    <div className={css(styles.tableKey)}>Effort Level</div>
                    <div className={css(styles.tableValue)}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className={css(styles.bold)}>
                          {this.props.bounties &&
                            this.props.bounties[0]?.effortLevel?.toLocaleLowerCase()}
                        </span>

                        <span
                          className={css(styles.effortDescription)}
                          data-tip={
                            EFFORT_LEVEL_DESCRIPTIONS[post?.bountyType][
                              this.props.bounties &&
                                this.props.bounties[0]?.effortLevel?.toLocaleLowerCase()
                            ]
                          }
                        >
                          {" "}
                          {
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                            ></FontAwesomeIcon>
                          }
                        </span>
                      </div>
                      <span style={{ marginLeft: 16 }}>
                        <EffortLevel
                          level={
                            this.props.bounties &&
                            this.props.bounties[0]?.effortLevel?.toLocaleLowerCase()
                          }
                        />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {post.isReady && (
                <div>
                  {post?.unifiedDocument?.documentType === "question" ||
                    (post?.unifiedDocument?.documentType === "bounty" && (
                      <div
                        style={{ fontWeight: 500, marginTop: 36, fontSize: 20 }}
                      >
                        Bounty Details
                      </div>
                    ))}
                  {isEditMode ? (
                    <>
                      <DynamicCKEditor
                        containerStyle={post.note && styles.editor}
                        editing
                        id="editPostBody"
                        initialData={initialData}
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
                          initialData={initialData}
                          isBalloonEditor
                          labelStyle={styles.label}
                          noTitle={!post.note}
                          readOnly
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </ReactPlaceholder>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  createBountyContainer: {
    display: "inline-block",
    marginTop: 15,
  },
  section: {
    marginTop: 25,
    paddingTop: 25,
    borderTop: `1px solid ${colors.GREY_LINE()}`,
  },
  postBody: {
    paddingTop: 0,
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
  table: {
    marginTop: 16,
  },
  tableKey: {
    color: colors.MEDIUM_GREY(),
    fontWeight: 500,
    fontSize: 16,
    width: 100,
  },
  tableValue: {
    textTransform: "capitalize",
    display: "flex",
    alignItems: "flex-end",
  },
  bold: {
    fontWeight: 500,
  },
  effortDescription: {
    cursor: "pointer",
    display: "flex",
    marginLeft: 6,
    fontSize: 14,
    color: colors.MEDIUM_GREY(),
  },
  effortLevel: {
    marginLeft: 8,
  },
  tableEntry: {
    display: "flex",
    alignItems: "flex-end",
  },
  main: {
    display: "flex",
    flexDirection: "column",
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
  editButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonRow: {
    marginTop: 16,
    width: "100%",
    display: "flex",
  },
  metastudyButton: {
    width: "unset",
    padding: "0px 16px",
    marginLeft: "auto",
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  auth: state.auth,
});

const mapDispatchToProps = {
  openPaperTransactionModal: ModalActions.openPaperTransactionModal,
  openAuthorSupportModal: ModalActions.openAuthorSupportModal,
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostPageCard);
