import React from "react";

// NPM Components
import { Editor } from "slate-react";
import { Value, Point, Decoration } from "slate";
import Plain from "slate-plain-serializer";
import { css, StyleSheet } from "aphrodite";
import { isKeyHotkey } from "is-hotkey";
import Sticky from "react-stickynode";
import urlRegex from "url-regex";
import ModalImage from "react-modal-image";

// Components
import { Button, Icon, ToolBar } from "./ToolBar";
import { TooltipInput } from "~/components/TooltipInput";

// Styles
import { textEditorIcons } from "~/config/themes/icons";
import "./stylesheets/RichTextEditor.css";
import "./stylesheets/iFrame.css";

// Scaffold
import summaryScaffold from "./summaryScaffold.json";
import colors from "../../config/themes/colors";
import Diff from "diff";
import { convertEditorValueToHtml } from "~/config/utils";

const getUrlParameter = (name, url) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(url);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const blankValue = {
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "",
              },
            ],
          },
        ],
      },
    ],
  },
};
const summaryScaffoldInitialValue = Value.fromJSON(blankValue);
const commentInitialValue = Value.fromJSON(blankValue);
/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = "paragraph";

const LINK_DELIMITERS = [" ", "<", ">", "[", "]", ";"];

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

/**
 * The rich text Component.
 *
 * @type {Component}
 */
class RichTextEditor extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
        ? this.props.value
        : this.props.initialValue
        ? this.props.initialValue
        : this.props.commentEditor
        ? commentInitialValue
        : summaryScaffoldInitialValue,
      addLinkTooltip: false,
      addImageTooltip: false,
      addVideoToolTip: false,
      imageTooltip: false,
      linkTooltip: false,
      link: "",
      image: "",
    };
  }

  componentDidMount() {
    convertEditorValueToHtml(this.state.value);
  }

  setEditorState = (value) => {
    this.setState({
      value,
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.submittedSuccess &&
      this.props.submittedSuccess !== prevProps.submittedSuccess
    ) {
      this.clear();
    }

    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  clear = () => {
    const value = Plain.deserialize("");
    this.setState({ value });
  };

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark = (type) => {
    const { value } = this.state;
    return value.activeMarks.some((mark) => mark.type === type);
  };

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = (type) => {
    const { value } = this.state;
    return value.blocks.some((node) => node.type === type);
  };

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = (editor) => {
    let style =
      "pointer-events: none; display: inline-block; max-width: 100%; opacity: 1; vertical-align: text-top;";
    if (document.querySelector("[contenteditable='false']")) {
      document.querySelector("[contenteditable='false']").style = style;
    }
    this.props.setRef(editor);
    this.editor = editor;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div className={css(styles.editor, this.props.containerStyles)}>
        {this.props.commentEditor ? (
          <div
            className={css(
              styles.commentEditor,
              this.props.commentEditorStyles && this.props.commentEditorStyles
            )}
          >
            <Editor
              readOnly={this.props.readOnly}
              spellCheck
              autoFocus={true}
              placeholder="What are your thoughts?"
              ref={this.ref}
              value={this.state.value}
              className={css(
                styles.editSection,
                this.props.commentStyles && this.props.commentStyles
              )}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderBlock={this.renderBlock}
              renderMark={this.renderMark}
              // decorateNode={this.decorateNode}
              // renderDecoration={this.renderDecoration}
            />
            {!this.props.readOnly && (
              <ToolBar
                cancel={this.props.cancel}
                submit={this.props.submit}
                hideButton={this.props.hideButton}
                hideCancelButton={
                  this.props.hideCancelButton && this.props.hideCancelButton
                }
                smallToolBar={
                  this.props.smallToolBar && this.props.smallToolBar
                }
                loading={this.props.loading && this.props.loading}
              >
                {this.renderMarkButton("bold", textEditorIcons.bold, true)}
                {this.renderMarkButton("italic", textEditorIcons.italic)}
                {this.renderMarkButton("underlined", textEditorIcons.underline)}
                {this.renderMarkButton("code", textEditorIcons.code)}
                {this.renderBlockButton("heading-one", textEditorIcons.h1)}
                {this.renderBlockButton("heading-two", textEditorIcons.h2)}
                {this.renderBlockButton("block-quote", textEditorIcons.quote)}
                {this.renderBlockButton(
                  "numbered-list",
                  textEditorIcons.numberedList
                )}
                {this.renderBlockButton(
                  "bulleted-list",
                  textEditorIcons.bulletedList
                )}
                {this.renderLinkButton("link", textEditorIcons.link)}
                {this.renderImageButton("image", textEditorIcons.image)}
                {this.renderVideoButton("video", textEditorIcons.video)}
              </ToolBar>
            )}
          </div>
        ) : (
          <div className={css(styles.summaryEditor)}>
            {!this.props.readOnly && (
              // <Sticky enabled={true} innerZ={3} bottom={30}>
              <div
                className={css(
                  styles.stickyBottom,
                  this.props.removeStickyToolbar && styles.removeStickyToolbar
                )}
              >
                <ToolBar
                  cancel={this.props.cancel}
                  submit={this.props.submit}
                  summaryEditor={true}
                  hideButton={this.props.hideButton}
                  hideCancelButton={
                    this.props.hideCancelButton && this.props.hideCancelButton
                  }
                  loading={this.props.loading && this.props.loading}
                  smallToolBar={
                    this.props.smallToolBar && this.props.smallToolBar
                  }
                >
                  {this.renderMarkButton("bold", textEditorIcons.bold, true)}
                  {this.renderMarkButton("italic", textEditorIcons.italic)}
                  {this.renderMarkButton(
                    "underlined",
                    textEditorIcons.underline
                  )}
                  {this.renderMarkButton("code", textEditorIcons.code)}
                  {this.renderBlockButton("heading-one", textEditorIcons.h1)}
                  {this.renderBlockButton("heading-two", textEditorIcons.h2)}
                  {this.renderBlockButton("block-quote", textEditorIcons.quote)}
                  {this.renderBlockButton(
                    "numbered-list",
                    textEditorIcons.numberedList
                  )}
                  {this.renderBlockButton(
                    "bulleted-list",
                    textEditorIcons.bulletedList
                  )}
                  {this.renderLinkButton("link", textEditorIcons.link)}
                  {this.renderImageButton("image", textEditorIcons.image)}
                  {this.renderVideoButton("video", textEditorIcons.video)}
                </ToolBar>
              </div>
              // </Sticky>
            )}
            <Editor
              readOnly={this.props.readOnly}
              spellCheck
              autoFocus
              placeholder={this.props.placeholder && this.props.placeholder}
              ref={this.ref}
              value={this.state.value}
              className={css(
                styles.comment,
                styles.summaryEditorBox,
                this.props.commentStyles && this.props.commentStyles
              )}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderBlock={this.renderBlock}
              renderMark={this.renderMark}
              hideCancelButton={
                this.props.hideCancelButton && this.props.hideCancelButton
              }
              id={this.props.readOnly ? null : "summary-editor"}
              // decorateNode={this.decorateNode}
              // renderDecoration={this.renderDecoration}
            />
          </div>
        )}
        {this.state.addLinkTooltip && (
          <TooltipInput
            title={"Link URL"}
            value={this.state.link}
            onChange={this.onChangeLink}
            close={this.closeTooltipInput}
            classContainer={styles.urlToolTip}
            save={() => this.setLink("link", this.state.link)}
          />
        )}
        {this.state.addImageTooltip && (
          <TooltipInput
            title={"Image URL"}
            value={this.state.image}
            onChange={this.onChangeImage}
            close={this.closeTooltipInput}
            classContainer={styles.imgToolTip}
            save={() => this.setImage("image", this.state.image)}
          />
        )}
        {this.state.addVideoToolTip && (
          <TooltipInput
            title={"Video URL"}
            value={this.state.video}
            onChange={this.onChangeVideo}
            close={this.closeTooltipInput}
            classContainer={styles.imgToolTip}
            save={() => this.setVideo("video", this.state.video)}
          />
        )}
      </div>
    );
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @param { Boolean } first -- whether the mark button is the first element in the list or not
   * @return {Element}
   */

  renderMarkButton = (type, icon, first) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive}
        first={first}
        smallToolBar={this.props.smallToolBar && this.props.smallToolBar}
        onMouseDown={(event) => {
          this.onClickMark(event, type);
          // this.closeLinkAndImage();
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  renderLinkButton = (type, icon) => {
    const isActive = this.hasMark(type);
    return (
      <span style={{ display: "flex" }}>
        <Button
          active={isActive}
          smallToolBar={this.props.smallToolBar && this.props.smallToolBar}
          onMouseDown={(event) => {
            event.preventDefault();
            if (isActive) {
              let filteredMarks = this.editor.value.activeMarks.filter(
                (node) => {
                  return node.type === type;
                }
              );
              let convertedMarks = filteredMarks.toJS();
              for (let i = 0; i < convertedMarks.length; i++) {
                if (this.editor.value.anchorText.text === "") {
                  this.editor.moveAnchorToEndOfPreviousText();
                  this.editor.moveFocusToStartOfNextText();
                  this.editor.removeMark(convertedMarks[i]);
                } else {
                  this.editor.moveAnchorToStartOfText();
                  this.editor.moveFocusToEndOfText();
                  this.editor.removeMark(convertedMarks[i]);
                  this.editor.moveAnchorToEndOfText();
                  this.editor.moveFocusToEndOfText();
                }
              }
            } else {
              this.setState({
                addLinkTooltip: true,
                selection: this.editor.value.selection,
              });
            }
          }}
        >
          <Icon>{icon}</Icon>
        </Button>
      </span>
    );
  };

  onChangeLink = (e) => {
    this.setState({
      link: e.target.value,
    });
  };

  setLink = (type, url) => {
    if (url === "" || url === null) {
      this.closeTooltipInput();
      return;
    }
    let formattedURL = this.formatURL(url);
    const link = { type, data: { url: formattedURL } };
    this.setState(
      {
        addLinkTooltip: false,
        link: "",
      },
      () => {
        this.editor.value.setSelection(this.state.selection);
        this.editor.focus();
        this.editor.toggleMark(link);
      }
    );
  };

  closeLinkToolTip = () => {
    this.setState({
      addLinkTooltip: false,
    });
  };

  closeImageToolTip = () => {
    this.setState({
      addImageTooltip: false,
    });
  };

  closeLinkAndImage = () => {
    this.setState({
      addImageTooltip: false,
      addLinkTooltip: false,
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

  renderVideoButton = (type, icon) => {
    return (
      <span style={{ display: "flex" }}>
        <Button
          smallToolBar={this.props.smallToolBar && this.props.smallToolBar}
          onMouseDown={(event) => {
            event.preventDefault();
            this.setState({
              addVideoToolTip: true,
              selection: this.editor.value.selection,
            });
          }}
        >
          <Icon>{icon}</Icon>
        </Button>
      </span>
    );
  };

  renderImageButton = (type, icon) => {
    return (
      <span style={{ display: "flex" }}>
        <Button
          smallToolBar={this.props.smallToolBar && this.props.smallToolBar}
          onMouseDown={(event) => {
            event.preventDefault();
            this.setState({
              addImageTooltip: true,
              selection: this.editor.value.selection,
            });
          }}
        >
          <Icon>{icon}</Icon>
        </Button>
      </span>
    );
  };

  closeTooltipInput = () => {
    this.setState({
      addLinkTooltip: false,
      addImageTooltip: false,
      addVideoToolTip: false,
      imageTooltip: false,
      linkTooltip: false,
      link: "",
      image: "",
    });
  };

  onChangeImage = (e) => {
    this.setState({
      image: e.target.value,
    });
  };

  onChangeVideo = (e) => {
    this.setState({
      video: e.target.value,
    });
  };

  setImage = (type, url) => {
    if (url === "" || url === null) {
      this.closeTooltipInput();
      return;
    }
    const image = { type, data: { url } };
    this.setState(
      {
        addImageTooltip: false,
        image: "",
      },
      () => {
        this.editor.value.setSelection(this.state.selection);
        this.editor.focus();
        this.editor.setBlocks(image);
      }
    );
  };

  setVideo = (type, url) => {
    if (url === "" || url === null) {
      this.closeTooltipInput();
      return;
    }
    const image = { type, data: { url } };
    this.setState(
      {
        addVideoToolTip: false,
        video: "",
      },
      () => {
        this.editor.value.setSelection(this.state.selection);
        this.editor.focus();
        this.editor.setBlocks(image);
      }
    );
  };

  /**
   * render decorations for draft editor to show diffing
   * @return {[type]} [description]
   */
  renderDecoration = (props, editor, next) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case "added":
        return (
          <span {...attributes} style={{ color: "green" }}>
            {children}
          </span>
        );
      case "removed":
        return (
          <span {...attributes} style={{ color: "red" }}>
            {children}
          </span>
        );
      default:
        return next();
    }
  };

  /**
   * decorate a note
   * @return {[type]} [description]
   */
  decorateNode = (props, editor, next) => {
    if (
      !this.props.showDiff ||
      (props.object === "document" && props.text === "") ||
      !this.props.previousVersion
    ) {
      return [];
    }

    let decorations = [];

    if (props.object === "document") {
      let key = props.key;
      let prevNode = this.props.previousVersion.document.getNode(key);
      let diffJSON = Diff.diffWords(prevNode.text, props.text);
      if (diffJSON.length > 1) {
        let after = 0;
        for (let i = 0; i < diffJSON.length; i++) {
          let diffValue = diffJSON[i].value;
          let start = props.text.indexOf(diffValue, after);
          let end = diffValue.length;
          let anchor = Point.create({
            key: key,
            path: [],
            offset: start,
          });
          let focus = Point.create({
            key: key,
            path: [],
            offset: end,
          });

          if (diffJSON[i].added) {
            let test = Decoration;
            let decoration = Decoration.create({
              type: "added",
              anchor,
              focus,
              mark: "added",
            });
            decorations.push(decoration);
          }
          let after = end;
        }
      }
    }
    return decorations;
  };

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type
   * @param {String} icon
   * @return {Element}
   */

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        value: { document, blocks },
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive}
        smallToolBar={this.props.smallToolBar && this.props.smallToolBar}
        onMouseDown={(event) => {
          this.onClickBlock(event, type);
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  /**
   * Render a Slate block.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderBlock = (props, editor, next) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return (
          <h2
            style={{ fontSize: 22, fontWeight: 500, paddingBottom: 10 }}
            {...attributes}
          >
            {children}
          </h2>
        );
      case "heading-two":
        return (
          <h3
            style={{ fontSize: 20, fontWeight: 500, marginBottom: 10 }}
            {...attributes}
          >
            {children}
          </h3>
        );
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "video":
        let video = node.data.get("url");
        let youtubeID = getUrlParameter("v", video);
        return (
          <div className={css(styles.imageBlock)} {...attributes}>
            <div className={css(styles.imageContainer)} contentEditable={false}>
              {video.includes("youtube") ? (
                <div className={""}>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeID}`}
                    frameborder="0"
                    className={css(styles.iframe)}
                    allow="accelerometer;autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              ) : (
                <video
                  src={node.data.get("url")}
                  className={css(styles.image)}
                />
              )}
              {!this.props.readOnly && (
                <div className={css(styles.imageOverlay, styles.smallOverlay)}>
                  <i
                    className={css(styles.deleteImage) + " fal fa-times"}
                    onClick={() => this.deleteImage(node)}
                  ></i>
                </div>
              )}
            </div>
          </div>
        );
      case "image":
        return (
          <div className={css(styles.imageBlock)} {...attributes}>
            <div className={css(styles.imageContainer)} contentEditable={false}>
              <ModalImage
                small={node.data.get("url")}
                large={node.data.get("url")}
                className={css(styles.image)}
              />
              {!this.props.readOnly && (
                <div className={css(styles.imageOverlay)}>
                  <i
                    className={css(styles.deleteImage) + " fal fa-times"}
                    onClick={() => this.deleteImage(node)}
                  ></i>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return next();
    }
  };

  deleteImage = (node) => {
    let { editor } = this;
    this.editor.removeNodeByKey(node.key);
  };

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;
    switch (mark.type) {
      case "bold":
        return (
          <strong className={css(styles.bold)} {...attributes}>
            {children}
          </strong>
        );
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      case "added":
        return (
          <span {...attributes} className={css(styles.added)}>
            {children}
          </span>
        );
      case "removed":
        return (
          <s {...attributes} className={css(styles.removed)}>
            {children}
          </s>
        );
      case "link":
        let url = mark.data.get("url");
        let isUrl = mark.data.get("isUrl");
        if (isUrl) {
          return (
            <a
              {...attributes}
              href={this.formatURL(children.props.text)}
              target={"_blank"}
              rel="noreferrer noopener"
            >
              {children}
            </a>
          );
        }
        return (
          <a
            {...attributes}
            href={url}
            target={"_blank"}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        );
      default:
        return next();
    }
  };

  onMouseEnterLink = (url) => {
    this.setState({
      link: url,
      linkTooltip: true,
    });
  };

  onMouseLeaveLink = () => {
    this.setState({
      link: "",
      linkTooltip: false,
    });
  };

  /**
   * On change, save the new `value`.
   *
   * @param {editor} editor
   */
  onChange = (editor) => {
    let valuesJS = editor.value.texts.toJS();
    let selectedValue = editor.value;
    let activeMarks = editor.value.activeMarks.toJS();
    let alreadyLink = false;
    let isUrl = false;
    let linkMark = {};
    // Compare active marks and see if they are type link.
    for (let index = 0; index < activeMarks.length; index++) {
      if (activeMarks[index].type === "link") {
        alreadyLink = true; // is a link
        linkMark = activeMarks[index]; // grab mark
      }
      if (activeMarks[index].data.isUrl) {
        isUrl = true; // is a url
      }
    }

    // if not an insert we don't want to worry about the link/url changes
    if (editor.operations.toJS()[0].type !== "insert_text") {
      this.setState({ value: selectedValue });
      this.props.onChange(selectedValue);
      return;
    }

    // if insert and a link check if the insert type was a delimiter and if so
    // remove link mark for the new inserted text
    if (
      editor.operations.toJS()[0].type === "insert_text" &&
      (alreadyLink || isUrl)
    ) {
      if (LINK_DELIMITERS.includes(editor.operations.toJS()[0].text)) {
        let selection = editor.value.selection.toJS();
        selection.anchor.offset -= 1;
        this.editor.setAnchor(selection.anchor);
        this.editor.setFocus(selection.focus);
        this.editor.toggleMark(linkMark);
        this.editor.setAnchor(this.editor.value.selection.get("focus"));
        this.editor.setFocus(this.editor.value.selection.get("focus"));
        selectedValue = this.editor.value;
        this.setState({ value: selectedValue });
        this.props.onChange(selectedValue);
        return;
      }
    }

    // if not already a link parse text and see if its a url.
    // if it is a url then toggle mark
    if (!alreadyLink) {
      for (let i = 0; i < valuesJS.length; i++) {
        let value = valuesJS[i];
        if (value.text) {
          let urls = value.text.match(urlRegex());
          if (!urls) {
            urls = [];
          }
          for (let j = 0; j < urls.length; j++) {
            let start = value.text.indexOf(urls[j]);
            let selection = editor.value.selection.toJS();
            selection.anchor.offset = start;
            selection.focus.offset = start + urls[j].length;

            let currentCursor = editor.value.selection.toJS();
            this.editor.setAnchor(selection.anchor);
            this.editor.setFocus(selection.focus);
            this.editor.toggleMark({ type: "link", data: { isUrl: true } });
            this.editor.setAnchor(currentCursor.anchor);
            this.editor.setFocus(currentCursor.focus);
            selectedValue = this.editor.value;
          }
        }
      }
    }
    this.setState({ value: selectedValue });
    this.props.onChange(selectedValue);
  };

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} event
   * @param {Editor} editor
   * @return {Change}
   */

  onKeyDown = (event, editor, next) => {
    let mark;
    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else if (event.key === "Enter") {
      let isLink = editor.value.activeMarks.some((activeMark) => {
        let comparison = activeMark.type === "link";
        if (comparison) {
          mark = activeMark;
        }
        return comparison;
      });
      if (isLink) {
        editor.toggleMark(mark);
        return next();
      } else {
        return next();
      }
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some((block) => {
        return !!document.getClosest(
          block.key,
          (parent) => parent.type === type
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };
}

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
    border: "1px solid #fff",
    color: "#000",
    ":hover": {
      borderColor: "#E7E7E7",
    },
  },
  editSection: {
    padding: 16,
    minHeight: 122,
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
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
});

export default RichTextEditor;
