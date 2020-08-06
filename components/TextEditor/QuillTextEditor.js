// NPM
import "react-quill/dist/quill.snow.css";
import "./stylesheets/QuillTextEditor.css";
import { css, StyleSheet } from "aphrodite";
import { connect } from "react-redux";

// Component
import FormButton from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

import { MessageActions } from "~/redux/message";
import { ModalActions } from "~/redux/modals";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "~/config/helpers";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: "snow",
      enabled: true,
      readOnly: false,
      value: this.props.value ? this.props.value : { ops: [] },
      plainText: "",
      events: [],
      editValue: this.props.value ? this.props.value : { ops: [] },
      focus: false,
      ReactQuill: null,
      Quill: null,
    };
    this.reactQuillRef = React.createRef();
    this.quillRef = null;
  }

  componentDidMount = async () => {
    // After so many trial & errors, import NEEDS to be done this way. Doesn't work with Dynamic import with Next.js
    import("react-quill").then((val) => {
      this.setState(
        {
          ReactQuill: val.default,
          Quill: val.Quill,
        },
        () => {
          this.attachQuillRefs();
          !this.state.handlerAdded && this.addLinkSantizer();
          !this.state.focus &&
            this.props.focusEditor &&
            this.quillRef &&
            this.focusEditor();
        }
      );
    });
  };

  componentDidUpdate(prevProps) {
    this.attachQuillRefs();
    if (!prevProps.editing && this.props.editing) {
      !this.state.focus && this.quillRef && this.focusEditor();
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
    input.onchange = async function() {
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
    if (this.props.editing) {
      return this.setState(
        {
          editValue: editor.getContents(),
        },
        () => {
          this.props.onChange && this.props.onChange();
        }
      );
    }

    this.setState(
      {
        value: editor.getContents(),
        events: [`[${source}] text-change`, ...this.state.events],
        plainText: editor.getText(),
        editValue: editor.getContents(),
      },
      () => {
        this.props.onChange && this.props.onChange();
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
  };

  onEditorBlur = (previousRange, source) => {
    this.setState({
      events: [`[${source}] blur(${this.formatRange(previousRange)})`].concat(
        this.state.events
      ),
      focus: false,
    });
  };

  focusEditor = () => {
    this.quillRef.focus();
    this.setState({ focus: true });
  };

  convertHtmlToDelta = (value) => {
    if (typeof value === "string") {
      return this.quillRef.clipboard.convert(value);
    } else {
      return value;
    }
  };

  clearEditorContent = () => {
    this.quillRef.setContents([]);
  };

  onCancel = () => {
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

  onSubmit = () => {
    let content = this.quillRef.getContents();
    let plainText = this.quillRef.getText();
    this.setState({
      value: content,
      plainText,
      editValue: content,
    });
    this.props.submit(content, plainText, this.clearEditorContent);
  };

  renderToolbar = () => {
    var state = this.state;
    var enabled = state.enabled;
    var readOnly = state.readOnly;
    var selection = this.formatRange(state.selection);
    let id = this.props.uid;

    return (
      <div
        id={id}
        className="toolbar ql-toolbar ql-snow"
        style={{ display: this.props.readOnly ? "none" : "" }}
      >
        <span className="ql-formats">
          <select className="ql-header">
            <option value="2">Heading 1</option>
            <option value="3">Heading 2</option>
            <option defaultValue />
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
          <button className="ql-strike"></button>
          <select class="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>

        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image" />
          <button className="ql-video"></button>
          <button class="ql-clean"></button>
        </span>
      </div>
    );
  };

  renderButtons = (props) => {
    return (
      <div
        className={css(
          toolbarStyles.toolbar,
          props.summaryEditor && toolbarStyles.toolbarSummary,
          props.smallToolBar && toolbarStyles.smallToolBar
        )}
      >
        <div className={css(toolbarStyles.iconRow)}>{props.children}</div>
        <div className={css(toolbarStyles.buttonRow)}>
          {!props.hideButton && !props.hideCancelButton && (
            <FormButton
              isWhite={true}
              onClick={this.onCancel}
              label={props.smallToolBar ? "Hide" : "Cancel"}
              size={props.smallToolBar && "med"}
              customButtonStyle={
                props.smallToolBar
                  ? toolbarStyles.smallButton
                  : toolbarStyles.cancelButton
              }
            />
          )}
          <span className={css(toolbarStyles.divider)} />
          {!props.hideButton &&
            (props.loading ? (
              <FormButton
                onClick={null}
                label={<Loader loading={true} color={"#FFF"} size={20} />}
                size={props.smallToolBar && "med"}
                customButtonStyle={
                  props.smallToolBar
                    ? toolbarStyles.smallButton
                    : toolbarStyles.buttonStyle
                }
              />
            ) : (
              <FormButton
                onClick={this.onSubmit}
                label="Submit"
                size={props.smallToolBar && "med"}
                customButtonStyle={
                  props.smallToolBar
                    ? toolbarStyles.smallButton
                    : toolbarStyles.buttonStyle
                }
              />
            ))}
        </div>
      </div>
    );
  };

  render() {
    const { ReactQuill } = this.state;
    return (
      <div className={css(styles.editor, this.props.containerStyles)}>
        {this.props.commentEditor ? (
          <div
            className={css(
              styles.commentEditor,
              this.props.commentEditorStyles && this.props.commentEditorStyles,
              this.state.focus && styles.focus
            )}
          >
            {ReactQuill && this.renderToolbar(this.props.uid)}
            {ReactQuill && (
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
                modules={Editor.modules(
                  this.props.uid,
                  this.imageHandler,
                  this.linkHandler
                )}
                formats={Editor.formats}
                className={css(
                  styles.editSection,
                  this.props.commentStyles && this.props.commentStyles
                )}
                placeholder={this.props.placeholder && this.props.placeholder}
              />
            )}
            {!this.props.readOnly && this.renderButtons(this.props)}
          </div>
        ) : (
          <div
            className={css(
              styles.summaryEditor
              // this.state.focus && styles.focus
            )}
          >
            {ReactQuill && this.renderToolbar(this.props.uid)}
            {ReactQuill && (
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
                modules={Editor.modules(
                  this.props.uid,
                  this.imageHandler,
                  this.linkHandler
                )}
                formats={Editor.formats}
                className={css(
                  styles.comment,
                  styles.summaryEditorBox,
                  this.props.commentStyles && this.props.commentStyles
                )}
                placeholder={this.props.placeholder && this.props.placeholder}
              />
            )}
            {!this.props.readOnly && this.renderButtons(this.props)}
          </div>
        )}
      </div>
    );
  }
}

Editor.modules = (toolbarId, imageHandler, linkHandler) => ({
  toolbar: {
    container: "#" + toolbarId,
    handlers: {
      image: imageHandler,
      // link: linkHandler
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
];

const styles = StyleSheet.create({
  editor: {
    width: "100%",
    position: "relative",
  },
  summaryEditor: {
    width: "100%",
    fontFamily: "Roboto",
    color: "#241F3A",
    lineHeight: 1.2,
  },
  summaryEditorBox: {
    minHeight: 180,
  },
  commentEditor: {
    background: "#FBFBFD",
    border: "2px solid rgb(232, 232, 242)",
    color: "#000",
    borderRadius: 4,
  },
  editable: {},
  focus: {
    // borderColor: "rgb(63, 133, 247)",
  },
  editSection: {
    padding: 16,
    minHeight: 122,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    // ":focus": {
    //   border: `1px solid 'rgb(63, 133, 247)`,
    //   boxShadow: 'rgb(63, 133, 247) 0px 0px 1px 1px'
    // },
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
  cancel: {
    background: "transparent",
    color: colors.PURPLE(),
    border: "1px solid",
    marginRight: 24,
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
  toolbarSummary: {
    borderBottom: "1px solid",
    borderTop: 0,
    borderColor: "rgb(235, 235, 235)",
    background: "#fff",
    paddingLeft: 0,
  },
  toolbar: {
    borderTop: "1px solid",
    borderColor: "rgb(235, 235, 235)",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    background: "#fff",
    "@media only screen and (max-width: 577px)": {
      flexDirection: "column",
    },
  },
  iconRow: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  smallToolBar: {
    fontSize: 11,
    display: "flex",
    flexWrap: "flex-wrap",
    "@media only screen and (max-width: 415px)": {
      fontSize: 9,
    },
  },
  smallToolBarButton: {
    marginLeft: 10,
    padding: 5,
    ":hover": {
      color: colors.BLACK(1),
      backgroundColor: "#FAFAFA",
    },
    "@media only screen and (max-width: 415px)": {
      margin: 5,
      marginLeft: 0,
    },
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
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    "@media only screen and (max-width: 577px)": {
      marginTop: 16,
    },
  },
  cancelButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    fontSize: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    "@media only screen and (max-width: 577px)": {
      width: 100,
    },
  },
  buttonStyle: {
    height: 37,
    width: 126,
    minWidth: 126,
    fontSize: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
    "@media only screen and (max-width: 577px)": {
      width: 100,
    },
  },
  smallButton: {
    height: 37,
    width: 126,
    minWidth: 126,
    fontSize: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginRight: 20,
    cursor: "pointer",
    borderRadius: 4,
    userSelect: "none",
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

export default connect(
  null,
  mapDispatchToProps
)(Editor);
