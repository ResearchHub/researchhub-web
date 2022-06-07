import * as Sentry from "@sentry/browser";
import API from "~/config/api";
import Button from "~/components/Form/Button";
import ReactTooltip from "react-tooltip";
import colors from "~/config/themes/colors";
import dynamic from "next/dynamic";
import removeMd from "remove-markdown";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "../redux/message";
import { ModalActions } from "~/redux/modals";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import { createRef, Component } from "react";
import DocumentHeader from "./Document/DocumentHeader";
import AbstractPlaceholder from "./Placeholders/AbstractPlaceholder";
import ReactPlaceholder from "react-placeholder/lib";
import ReactHtmlParser from "react-html-parser";
import router from "next/router";

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
      Editor: require("@thomasvu/ckeditor5-custom-build").SimpleBalloonEditor,
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

  render() {
    const { post, removePost, restorePost } = this.props;
    const { postBody } = this.state;

    return (
      <div className={css(styles.mainContainer)}>
        <div className={css(styles.main)}>
          <DocumentHeader
            handleEdit={this.toggleShowPostEditor}
            document={post}
            onDocumentRemove={removePost}
            onDocumentRestore={restorePost}
          />
          <div className={css(styles.section) + " post-body"}>
            <ReactPlaceholder
              ready={post.isReady}
              showLoadingAnimation
              customPlaceholder={<AbstractPlaceholder color="#efefef" />}
            >
              {post.isReady && (
                <div>
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
  section: {
    marginTop: 25,
    paddingTop: 25,
    borderTop: `1px solid ${colors.GREY_LINE()}`,
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
