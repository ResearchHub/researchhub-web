import React from "react";

// NPM Components
import { Editor } from "slate-react";
import { Value } from "slate";
import Plain from "slate-plain-serializer";
import { css, StyleSheet } from "aphrodite";
import { isKeyHotkey } from "is-hotkey";

// Components
import { Button, Icon, ToolBar } from "./ToolBar";

// Styles
import { textEditorIcons } from "~/config/themes/icons";
import "./stylesheets/RichTextEditor.css";

// Scaffold
import summaryScaffold from "./summaryScaffold.json";
import colors from "../../config/themes/colors";

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

  state = {
    value: this.props.initialValue
      ? this.props.initialValue
      : this.props.commentEditor
      ? commentInitialValue
      : summaryScaffoldInitialValue,
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.submittedSuccess &&
      this.props.submittedSuccess !== prevProps.submittedSuccess
    ) {
      this.clear();
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
    this.editor = editor;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render() {
    return (
      <div className={css(styles.editor)}>
        {this.props.commentEditor ? (
          <div className={css(styles.commentEditor)}>
            <Editor
              readOnly={this.props.readOnly}
              spellCheck
              autoFocus
              commentEditor={this.props.commentEditor}
              placeholder="What are your thoughts?"
              ref={this.ref}
              value={this.state.value}
              className={css(styles.editSection)}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderBlock={this.renderBlock}
              renderMark={this.renderMark}
            />
            {!this.props.readOnly && (
              <ToolBar
                cancel={this.props.cancel}
                submit={this.props.submit}
                hideButton={this.props.hideButton}
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
              </ToolBar>
            )}
          </div>
        ) : (
          <div className={css(styles.summaryEditor)}>
            {!this.props.readOnly && (
              <ToolBar
                cancel={this.props.cancel}
                submit={this.props.submit}
                summaryEditor={true}
                hideButton={this.props.hideButton}
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
              </ToolBar>
            )}
            <Editor
              readOnly={this.props.readOnly}
              spellCheck
              autoFocus
              commentEditor={this.props.commentEditor}
              ref={this.ref}
              value={this.state.value}
              className={css(styles.comment)}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              renderBlock={this.renderBlock}
              renderMark={this.renderMark}
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
    padding: "0px 16px 16px 0px",
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
});

export default RichTextEditor;
