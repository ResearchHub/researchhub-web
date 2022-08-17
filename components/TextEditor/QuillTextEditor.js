// NPM
import ReactDOMServer from "react-dom/server";
import { createRef, Fragment, Component } from "react";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";
import numeral from "numeral";

// Component
import FormButton from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";
import ReviewCategorySelector from "~/components/TextEditor/ReviewCategorySelector";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import faIcons from "~/config/themes/icons";
import QuillPeerReviewRatingBlock from "~/components/TextEditor/lib/QuillPeerReviewRatingBlock";
import PostTypeSelector from "~/components/TextEditor/PostTypeSelector";
import reviewCategories from "~/components/TextEditor/config/reviewCategories";
import { POST_TYPES } from "./config/postTypes";
import trimQuillEditorContents from "./util/trimQuillEditorContents";
import hasQuillContent from "./util/hasQuillContent";
import isQuillEmpty from "./util/isQuillEmpty";
import { breakpoints } from "~/config/themes/screen";
import CreateBountyBtn from "../Bounty/CreateBountyBtn";
import icons from "~/config/themes/icons";

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: "snow",
      value: this.props.value ? this.props.value : { ops: [] },
      plainText: "",
      events: [],
      editValue: this.props.value ? this.props.value : { ops: [] },
      interimBounty: null,
      focus: false,
      ReactQuill: null,
      Quill: null,
      showFullEditor: false,
      submitDisabled: true,
      selectedPostTypeStruct: this.props.selectedPostTypeStruct,
    };
    this.reactQuillRef = createRef();
    this.quillRef = null;
  }

  componentDidMount = async () => {
    import("react-quill").then(async (val) => {
      const MagicUrl = (await import("quill-magic-url")).default;

      const Quill = val.default.Quill;
      var icons = val.default.Quill.import("ui/icons");
      icons.video = ReactDOMServer.renderToString(faIcons.video);

      Quill.register(QuillPeerReviewRatingBlock);
      Quill.register("modules/magicUrl", MagicUrl);

      this.setState(
        {
          ReactQuill: val.default,
          Quill: val.default.Quill,
        },
        () => {
          this.attachQuillRefs();
          !this.state.handlerAdded && this.addLinkSantizer();
          !this.state.focus && this.props.focusEditor && this.focusEditor();
        }
      );
    });
  };

  componentDidUpdate(prevProps, prevState) {
    this.attachQuillRefs();
    if (!prevProps.editing && this.props.editing) {
      !this.state.focus && this.focusEditor();
    }

    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        editValue: this.props.value,
      });
    }
  }

  addLinkSantizer = () => {
    const Link = this.state.Quill.import("formats/link");
    const builtInFunc = Link.sanitize;
    Link.sanitize = function customSanitizeLinkInput(linkValueInput) {
      const formatURL = (url) => {
        let http = "http://";
        let https = "https://";
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

      let val = formatURL(linkValueInput);
      return builtInFunc.call(this, val); // retain the built-in logic
    };
    this.setState({ handlerAdded: true });
  };

  showLoader = (state) => {
    this.props.showMessage({ load: state, show: state });
  };

  attachQuillRefs = () => {
    if (this.reactQuillRef.current === null) return;
    if (typeof this.reactQuillRef.current.getEditor !== "function") return;
    if (this.quillRef !== null) return;

    this.quillRef = this.reactQuillRef.current.getEditor();
  };

  imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async function () {
      this.showLoader(true);
      const file = input.files[0];
      const fileString = await this.toBase64(file);
      const type = file.type;
      const fileUrl = await this.getFileUrl({ fileString, type });
      const range = this.quillRef.getSelection();

      // this part the image is inserted
      // by 'image' option below, you just have to put src(link) of img here.
      this.quillRef.insertEmbed(range.index, "image", fileUrl);
      this.showLoader(false);
    }.bind(this);
  };

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  getFileUrl = ({ fileString, type }) => {
    let payload = {
      content_type: type.split("/")[1],
      content: fileString,
    };
    return fetch(API.SAVE_IMAGE, API.POST_CONFIG(payload))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        if (err.response.status === 429) {
          this.props.openRecaptchaPrompt(true);
        }
      });
  };

  formatURL = (url) => {
    let http = "http://";
    let https = "https://";
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

  formatRange(range) {
    return range ? [range.index, range.index + range.length].join(",") : "none";
  }

  onEditorChange = (value, delta, source, editor) => {
    const editorContents = editor.getContents();
    const editorWithoutPeerReviewBlocks = editorContents.ops.filter(
      (op) => !op.insert["peer-review-rating"]
    );
    const lastDelta =
      editorWithoutPeerReviewBlocks[editorWithoutPeerReviewBlocks.length - 1];

    const editorHasTrivialText =
      editorWithoutPeerReviewBlocks.length === 1 &&
      lastDelta.insert === "\n" &&
      !lastDelta.attributes;
    if (editorHasTrivialText) {
      this.forcePlaceholderToShow({
        placeholderText: this.state.selectedPostTypeStruct.placeholder,
      });
    }

    if (isQuillEmpty(editorContents)) {
      this.setState({ submitDisabled: true });
    } else {
      this.setState({ submitDisabled: false });
    }

    if (this.props.editing) {
      return this.setState(
        {
          editValue: editorContents,
        },
        () => {
          this.props.onChange && this.props.onChange(editorContents);
        }
      );
    }

    this.setState(
      {
        value: editorContents,
        events: [`[${source}] text-change`, ...this.state.events],
        plainText: editor.getText(),
        editValue: editorContents,
      },
      () => {
        this.props.onChange && this.props.onChange(editorContents);
      }
    );
  };

  onEditorChangeSelection = (range, source) => {
    this.state.selection !== range &&
      this.setState({
        selection: range,
        events: [
          `[${source}] selection-change(${this.formatRange(
            this.state.selection
          )} -> ${this.formatRange(range)})`,
          ...this.state.events,
        ],
      });
  };

  onEditorFocus = (range, source, editor) => {
    this.setState({
      events: [`[${source}] focus(${this.formatRange(range)})`].concat(
        this.state.events
      ),
      focus: !this.props.readOnly && true,
    });
    this.props.handleFocus && this.props.handleFocus(true);
  };

  onEditorBlur = (previousRange, source) => {
    this.setState({
      events: [`[${source}] blur(${this.formatRange(previousRange)})`].concat(
        this.state.events
      ),
      focus: false,
    });
    this.props.handleFocus && this.props.handleFocus(false);
  };

  focusEditor = () => {
    if (this.quillRef && !this.props.readOnly) {
      this.quillRef.focus();
      const range = this.quillRef.getLength(); // place cursor at the end of the text
      this.quillRef.setSelection(range + 1);
      this.setState({ focus: true });
    }
  };

  convertHtmlToDelta = (value) => {
    if (typeof value === "string") {
      return this.quillRef.clipboard.convert(value);
    } else {
      return value;
    }
  };

  clearEditorContent = () => {
    if (this.props.hasHeader) {
      return this.quillRef.setContents(this.props.value);
    }
    this.quillRef.setContents([]);
  };

  onCancel = (event) => {
    const isConfirmed = confirm("Your changes will be removed");
    if (!isConfirmed) {
      return false;
    }

    event?.preventDefault();
    event?.stopPropagation();
    if (this.props.editing) {
      let content = this.convertHtmlToDelta(this.state.value);
      this.quillRef.setContents(content);
      this.quillRef.blur();
    }
    this.setState(
      {
        focus: false,
      },
      () => {
        this.props.cancel && this.props.cancel();
      }
    );
  };

  onSubmit = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    let content = this.quillRef.getContents();
    let plainText = this.quillRef.getText();
    this.setState({
      value: content,
      plainText,
      editValue: content,
    });
    this.props.submit({
      interimBounty: this.state.interimBounty,
      content,
      plainText,
      callback: this.clearEditorContent,
      discussionType: this.state.selectedPostTypeStruct.value,
    });
  };

  renderToolbar = () => {
    const { showFullEditor } = this.state;

    return (
      <div id={this.props.uid} className="ql-toolbar">
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video"></button>
          <button
            id="show-editor"
            className={`show-full-editor ${showFullEditor ? "ql-active" : ""}`}
            onClick={() => this.setState({ showFullEditor: !showFullEditor })}
          >
            {faIcons.fontCase}
            <span className="ql-up">{faIcons.chevronUp}</span>
          </button>
        </span>

        <div
          className={`ql-full-editor ${
            showFullEditor && "ql-full-editor-visible"
          }`}
        >
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
          </span>
          <span className="ql-formats">
            <button className="ql-code-block"></button>
            <button className="ql-clean"></button>
          </span>
        </div>
      </div>
    );
  };

  insertReviewCategory = ({ category, index }) => {
    let range = this.quillRef.getSelection(true);
    let insertAtIndex = index ?? range.index;
    if (insertAtIndex === 0 && category.value !== "overall") {
      insertAtIndex++;
    }

    this.quillRef.insertEmbed(
      insertAtIndex,
      "peer-review-rating",
      {
        rating: 3,
        category: category.value,
      },
      this.state.Quill.sources.SILENT
    );
  };

  forcePlaceholderToShow = ({ placeholderText }) => {
    if (placeholderText) {
      this.quillRef.root.setAttribute("data-placeholder", placeholderText);
    }
    this.quillRef.root.classList.add("ql-blank");
  };

  handlePostTypeSelect = (selectedType) => {
    const currentType = this.state.selectedPostTypeStruct;

    if (currentType.value === selectedType.value) {
      return;
    }

    const isPeerReview =
      selectedType.value === POST_TYPES.REVIEW &&
      currentType.value !== selectedType.value;

    if (isPeerReview) {
      const trimmedContents = trimQuillEditorContents({
        contents: this.quillRef.getContents(),
      });
      this.quillRef.setContents(trimmedContents);
      this.insertReviewCategory({
        category: reviewCategories.overall,
        index: 0,
      });

      const hasContent = hasQuillContent({ quillRef: this.quillRef });
      if (!hasContent) {
        this.forcePlaceholderToShow({
          placeholderText: selectedType.placeholder,
        });
      }
    } else {
      const editorWithoutPeerReviewBlocks = this.quillRef
        .getContents([])
        .ops.filter((op) => !op.insert["peer-review-rating"]);
      this.quillRef.setContents(editorWithoutPeerReviewBlocks);

      const trimmedContents = trimQuillEditorContents({
        contents: this.quillRef.getContents(),
      });
      this.quillRef.setContents(trimmedContents);

      const hasContent = hasQuillContent({ quillRef: this.quillRef });
      if (!hasContent) {
        this.forcePlaceholderToShow({
          placeholderText: selectedType.placeholder,
        });
      }
    }

    this.setState({
      selectedPostTypeStruct: selectedType,
    });

    this.focusEditor();
  };

  setBountyInterim = (bounty) => {
    this.setState({
      interimBounty: bounty,
    });
  };

  renderButtons = (props) => {
    const isRequestMode =
      this.state.selectedPostTypeStruct?.group === "request";
    const isAnswerType =
      this.state.selectedPostTypeStruct?.value === POST_TYPES.ANSWER;

    const label = isRequestMode
      ? "Request"
      : isAnswerType
      ? "Post Answer"
      : "Post";

    return (
      <div className={css(styles.postButtonContainer)}>
        {!props.hideButton &&
          (props.loading ? (
            <FormButton
              onClick={null}
              disabled={this.state.submitDisabled}
              label={<Loader loading={true} color={"#FFF"} size={20} />}
              customButtonStyle={[
                toolbarStyles.postButtonStyle,
                isRequestMode && toolbarStyles.requestButton,
                isAnswerType && toolbarStyles.answerButton,
              ]}
              customLabelStyle={toolbarStyles.postButtonLabel}
            />
          ) : (
            <>
              {this.props.editing && (
                <div
                  onClick={this.onCancel}
                  className={css(toolbarStyles.cancelButton)}
                >
                  Cancel
                </div>
              )}
              <div className={css(styles.bountyBtnContainer)}>
                {this.state.interimBounty ? (
                  <button
                    className={css(styles.bountyAdded)}
                    onClick={() => {
                      this.setState({
                        interimBounty: null,
                      });
                    }}
                  >
                    <img
                      className={css(styles.RSCIcon)}
                      src="/static/icons/coin-filled.png"
                      alt="Pot of Gold"
                    />
                    <span className={css(styles.bountyText)}>
                      {numeral(this.state.interimBounty.amount).format(
                        "0,0.[0000000000]"
                      )}{" "}
                      ResearchCoin Bounty Added{" "}
                    </span>
                    <span className={css(styles.closeBounty)}>
                      {icons.times}
                    </span>
                  </button>
                ) : (
                  this.props.showBountyBtn && (
                    <CreateBountyBtn
                      onBountyAdd={(bounty) => {
                        this.setBountyInterim(bounty);
                      }}
                      withPreview={true}
                      bountyText={this.quillRef?.getText()}
                      // post={post}
                      bounty={this.props.bounty}
                      onBountyCancelled={() => {
                        this.props.setBounty(null);
                      }}
                    />
                  )
                )}
              </div>
              <FormButton
                onClick={this.onSubmit}
                label={this.props.editing ? "Save changes" : label}
                disabled={this.state.submitDisabled}
                customButtonStyle={[
                  toolbarStyles.postButtonStyle,
                  isRequestMode && toolbarStyles.requestButton,
                  isAnswerType && toolbarStyles.answerButton,
                ]}
                customLabelStyle={toolbarStyles.postButtonLabel}
              />
            </>
          ))}
      </div>
    );
  };

  render() {
    const { ReactQuill, selectedPostTypeStruct } = this.state;
    const canEdit = !this.props.readOnly;

    if (!ReactQuill) {
      return null;
    }

    if (canEdit) {
      const modules = Editor.modules(
        this.props.uid,
        this.imageHandler
        // this.linkHandler
      );
      return (
        <div
          className={css(
            styles.editor,
            this.props.containerStyles,
            this.state.focus && styles.focus,
            this.state.focus &&
              selectedPostTypeStruct.group === "request" &&
              styles.focusRequestType,
            this.state.focus &&
              selectedPostTypeStruct.value === POST_TYPES.ANSWER &&
              styles.focusAnswerType
          )}
          key={this.props.uid}
        >
          <div
            className={css(
              styles.commentEditor,
              this.props.commentEditorStyles && this.props.commentEditorStyles
            )}
          >
            {this.props.isTopLevelComment && (
              <div className={css(styles.postTypeContainer)}>
                <PostTypeSelector
                  selectedType={selectedPostTypeStruct}
                  documentType={this.props.documentType}
                  handleSelect={(selectedType) =>
                    this.handlePostTypeSelect(selectedType)
                  }
                />
              </div>
            )}

            <ReactQuill
              ref={this.reactQuillRef}
              theme={this.state.theme}
              readOnly={this.props.readOnly}
              onChange={this.onEditorChange}
              onChangeSelection={this.onEditorChangeSelection}
              onFocus={this.onEditorFocus}
              onBlur={this.onEditorBlur}
              defaultValue={
                this.props.editing ? this.state.editValue : this.state.value
              }
              modules={modules}
              formats={Editor.formats}
              className={css(
                styles.editSection,
                this.props.commentStyles && this.props.commentStyles
              )}
              placeholder={selectedPostTypeStruct.placeholder}
            />
            {selectedPostTypeStruct.value === POST_TYPES.REVIEW && (
              <div className={css(styles.reviewCategoryContainer)}>
                <ReviewCategorySelector
                  handleSelect={(category) => {
                    this.insertReviewCategory({ category });
                    this.forcePlaceholderToShow({
                      placeholderText: category.description,
                    });
                  }}
                />
              </div>
            )}
            <div className={css(styles.footerContainer)}>
              <div className={css(styles.toolbarContainer)}>
                {ReactQuill && this.renderToolbar(this.props.uid)}
              </div>
              {!this.props.readOnly && this.renderButtons(this.props)}
            </div>
          </div>
        </div>
      );
    } else {
      const modules = {
        toolbar: false,
      };
      const editorValue = trimQuillEditorContents({
        contents: this.state.value,
      });

      return (
        <div
          key={this.props.uid}
          className={css(
            styles.readOnly,
            this.props.isAcceptedAnswer && styles.isAcceptedAnswer,
            this.props.isBounty && styles.isBounty
          )}
        >
          <ReactQuill
            ref={this.reactQuillRef}
            readOnly={true}
            defaultValue={editorValue}
            modules={modules}
            placeholder={selectedPostTypeStruct.placeholder}
          />
        </div>
      );
    }
  }
}

Editor.modules = (toolbarId, imageHandler, linkHandler) => ({
  magicUrl: true,
  toolbar: {
    magicUrl: true,
    container: "#" + toolbarId,
    handlers: {
      image: imageHandler,
    },
  },
});

Editor.formats = [
  "image",
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "clean",
  "background",
  "code-block",
  "direction",
  "peer-review-rating",
];

const styles = StyleSheet.create({
  reviewCategoryContainer: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  RSCIcon: {
    height: 20,
    marginRight: 4,
  },
  readOnly: {
    background: "white",
    padding: "12px 15px",
    borderRadius: "4px",
    border: `1px solid ${colors.LIGHT_GREY()}`,
    boxSizing: "border-box",
  },
  isAcceptedAnswer: {
    border: `1px solid ${colors.NEW_GREEN()}`,
  },
  isBounty: {
    border: `1px solid ${colors.ORANGE()}`,
  },
  footerContainer: {
    display: "flex",
    borderTop: `1px solid ${colors.GREY_BORDER}`,
  },
  postButtonContainer: {
    padding: 12,
    paddingRight: 0,
    paddingBottom: 0,
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  postTypeContainer: {
    marginBottom: 25,
  },
  fullEditor: {
    display: "none",
  },
  bountyBtnContainer: {
    marginRight: 15,
  },
  showFullEditor: {
    display: "block",
  },
  editor: {
    width: "100%",
    position: "relative",
    border: `1px solid ${colors.GREY_LINE()}`,
    padding: "20px 20px 10px 20px",
    borderRadius: "4px",
    background: "white",
    boxSizing: "border-box",
  },
  bountyAdded: {
    background: colors.GREY(0.2),
    border: 0,
    height: 30,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  closeBounty: {
    color: "grey",
  },
  bountyText: {
    marginRight: 8,
    fontSize: 15,
  },
  editable: {},
  focus: {
    border: `1px solid ${colors.NEW_BLUE()}`,
  },
  focusRequestType: {
    border: `1px solid ${colors.PURPLE_LIGHT()}`,
  },
  focusAnswerType: {
    border: `1px solid ${colors.NEW_GREEN()}`,
  },
  editSection: {
    minHeight: 75,
  },
  comment: {
    whiteSpace: "pre-wrap",
    padding: 16,
    "@media only screen and (max-width: 767px)": {
      paddingLeft: 0,
    },
  },
  button: {
    width: 180,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    outline: "none",
    cursor: "pointer",
  },
  submit: {
    background: colors.PURPLE(),
    color: "#fff",
  },
  added: {
    background: "rgba(19, 145, 26, .2)",
    color: "rgba(19, 145, 26)",
  },
  removed: {
    background: "rgba(173, 34, 21, .2)",
    color: "rgb(173, 34, 21)",
  },
  image: {
    display: "block",
    maxWidth: "100%",
    maxHeight: 500,
    opacity: 1,
  },
  deleteImage: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 30,
    color: "#fff",
    cursor: "pointer",
    zIndex: 3,
  },
  imageContainer: {
    position: "relative",
    width: "fit-content",
  },
  imageBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: "0%",
    opacity: 1,
    ":hover": {
      background: "linear-gradient(#000 1%, transparent 100%)",
      opacity: "100%",
    },
  },
  iframeContainer: {
    position: "relative",
    paddingBottom: "56.25%",
    paddingTop: 30,
    height: 0,
    overflow: "hidden",
  },
  iframe: {
    width: 543,
    height: 305.5,

    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  smallOverlay: {
    height: 60,
  },
  bold: {
    fontWeight: 500,
    color: "#241F3A",
  },
  stickyBottom: {
    position: "sticky",
    backgroundColor: "#fff",
    top: 59,
    zIndex: 3,
  },
  removeStickyToolbar: {
    position: "unset",
  },
  urlToolTip: {
    top: 60,
    bottom: "unset",
  },
  imgToolTip: {
    top: 60,
    bottom: "unset",
  },
  headerOne: {
    fontSize: 22,
    fontWeight: 500,
    paddingBottom: 10,
  },
  headingTwo: {
    fontSize: 20,
    fontWeight: 500,
    paddingBottom: 10,
  },
});

const toolbarStyles = StyleSheet.create({
  buttonActive: {
    color: colors.BLACK(1),
  },
  button: {
    color: "rgb(204, 204, 204)",
    cursor: "pointer",
    marginLeft: 24,
    ":hover": {
      color: colors.BLACK(1),
    },
  },
  requestButton: {
    background: colors.PURPLE_LIGHT(),
    ":hover": {
      opacity: 0.9,
      background: colors.PURPLE_LIGHT(),
    },
  },
  answerButton: {
    background: colors.NEW_GREEN(),
    ":hover": {
      opacity: 0.9,
      background: colors.NEW_GREEN(),
    },
  },
  toolbarSummary: {
    borderBottom: "1px solid",
    borderTop: 0,
    borderColor: "rgb(235, 235, 235)",
    background: "#fff",
    paddingLeft: 0,
  },
  toolbar: {
    // borderTop: "1px solid",
    borderColor: "rgb(235, 235, 235)",
    paddingTop: 15,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    background: "#fff",
  },
  iconRow: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 0,
    whiteSpace: "nowrap",
    alignSelf: "center",
  },
  submit: {
    background: colors.PURPLE(1),
    color: "#fff",
    border: "none",
    padding: "12px 36px",
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
    borderRadius: 4,
  },
  first: {
    marginLeft: 0,
  },
  cancelButton: {
    color: colors.MEDIUM_GREY2(),
    fontSize: 15,
    marginRight: 25,
    cursor: "pointer",
  },
  postButtonLabel: {
    fontWeight: 500,
  },
  postButtonStyle: {
    height: 30,
    width: "auto",
    fontSize: 16,
    padding: "17px 30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    minWidth: 95,
    background: colors.NEW_BLUE(),
    ":hover": {
      opacity: 0.9,
      background: colors.NEW_BLUE(),
    },
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      minHeight: "unset",
      minWidth: 95,
      height: 30,
    },
  },
  ripples: {
    flex: 1,
  },
  divider: {
    width: 10,
  },
});

const mapDispatchToProps = {
  setMessage: MessageActions.setMessage,
  showMessage: MessageActions.showMessage,
  openRecaptchaPrompt: ModalActions.openRecaptchaPrompt,
};

export default connect(null, mapDispatchToProps)(Editor);
