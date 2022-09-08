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
import killswitch from "~/config/killswitch/killswitch";
import ReactHtmlParser from "react-html-parser";
import ReactPlaceholder from "react-placeholder/lib";
import ReactTooltip from "react-tooltip";
import removeMd from "remove-markdown";
import router from "next/router";
import trimEmptyParagraphs from "./TextEditor/util/trimEmptyParagraphs";

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
    const { post, removePost, restorePost, user } = this.props;
    const { postBody } = this.state;
    const isEditMode = this.state.showPostEditor;

    let initialData = postBody;
    if (!isEditMode && typeof initialData === "string") {
      initialData = trimEmptyParagraphs({ htmlStr: postBody });
    }

    return (
      <div className={css(styles.mainContainer)}>
        <div className={css(styles.main)}>
          <DocumentHeader
            handleEdit={this.toggleShowPostEditor}
            document={post}
            onDocumentRemove={removePost}
            onDocumentRestore={restorePost}
            hasBounties={this.props.hasBounties || this.props.bounties}
            allBounties={this.props.bounties}
            bountyType="question"
          />
          <div className={css(styles.section, styles.postBody) + " post-body"}>
            <ReactPlaceholder
              ready={post.isReady}
              showLoadingAnimation
              customPlaceholder={<AbstractPlaceholder color="#efefef" />}
            >
              {post.isReady && (
                <div>
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
                  {post.unifiedDocument.documentType === "question" && (
                    <div className={css(styles.createBountyContainer)}>
                      <CreateBountyBtn
                        onBountyAdd={(bounty) => {
                          this.props.setBounties([
                            ...this.props.bounties,
                            bounty,
                          ]);
                        }}
                        isOriginalPoster={
                          post.unifiedDocument.createdBy.id === user.id
                        }
                        currentUser={user}
                        bountyText={this.toPlaintext(postBody)}
                        post={post}
                        bounties={this.props.bounties}
                        onBountyCancelled={(bounty) => {
                          this.props.onBountyCancelled &&
                            this.props.onBountyCancelled(bounty);
                        }}
                      />
                    </div>
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
  editButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
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
