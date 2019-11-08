import React from "react";

// NPM Components
import { Editor } from "slate-react";
import { Value, Point, Decoration } from "slate";
import Plain from "slate-plain-serializer";
import { css, StyleSheet } from "aphrodite";
import { isKeyHotkey } from "is-hotkey";
import Sticky from "react-stickynode";

// Components
import { Button, Icon, ToolBar } from "./ToolBar";

// Styles
import { textEditorIcons } from "~/config/themes/icons";
import "./stylesheets/RichTextEditor.css";

// Scaffold
import summaryScaffold from "./summaryScaffold.json";
import colors from "../../config/themes/colors";
import Diff from "diff";

const summaryScaffoldInitialValue = Value.fromJSON(summaryScaffold);
const commentInitialValue = Value.fromJSON({
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
});
/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = "paragraph";

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
      value: this.props.initialValue
        ? this.props.initialValue
        : this.props.commentEditor
        ? commentInitialValue
        : summaryScaffoldInitialValue,
    };
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
          <div className={css(styles.commentEditor)}>
            <Editor
              readOnly={this.props.readOnly}
              spellCheck
              autoFocus={true}
              commentEditor={this.props.commentEditor}
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
              <Sticky innerZ={2}>
                <ToolBar
                  cancel={this.props.cancel}
                  submit={this.props.submit}
                  hideButton={this.props.hideButton}
                  hideCancelButton={
                    this.props.hideCancelButton && this.props.hideCancelButton
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
                </ToolBar>
              </Sticky>
            )}
          </div>
        ) : (
          <div className={css(styles.summaryEditor)}>
            {!this.props.readOnly && (
              <Sticky innerZ={2}>
                <ToolBar
                  cancel={this.props.cancel}
                  submit={this.props.submit}
                  summaryEditor={true}
                  hideButton={this.props.hideButton}
                  hideCancelButton={
                    this.props.hideCancelButton && this.props.hideCancelButton
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
                </ToolBar>
              </Sticky>
            )}
            <Editor
              readOnly={this.props.readOnly}
              spellCheck
              autoFocus
              commentEditor={this.props.commentEditor}
              placeholder={this.props.placeholder && this.props.placeholder}
              ref={this.ref}
              value={this.state.value}
              className={css(
                styles.comment,
                this.props.commentStyles && this.props.commentStyles
              )}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderBlock={this.renderBlock}
              renderMark={this.renderMark}
              hideCancelButton={
                this.props.hideCancelButton && this.props.hideCancelButton
              }
              // decorateNode={this.decorateNode}
              // renderDecoration={this.renderDecoration}
            />
          </div>
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
        onMouseDown={(event) => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
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
        onMouseDown={(event) => this.onClickBlock(event, type)}
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
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
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
        return <strong {...attributes}>{children}</strong>;
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
      default:
        return next();
    }
  };

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value });
    this.props.onChange(value);
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
  },
  summaryEditor: {
    width: "100%",
  },
  commentEditor: {
    background: "#FBFBFD",
    border: "1px solid #E7E7E7",
    borderRadius: 4,
    color: "#000",
  },
  editSection: {
    padding: 16,
    minHeight: 122,
  },
  comment: {
    padding: "16px 16px 16px 16px",
    // minHeight: 200,
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
});

export default RichTextEditor;
