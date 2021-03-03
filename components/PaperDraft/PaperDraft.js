import React, { Fragment, useState, useEffect } from "react";
import Immutable from "immutable";
import {
  Editor,
  EditorState,
  ContentState,
  EditorBlock,
  AtomicBlockUtils,
  Modifier,
  RichUtils,
  convertToRaw,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
  KeyBindingUtil,
  CompositeDecorator,
} from "draft-js";
import { convertFromHTML } from "draft-convert";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Components
import AbstractPlaceholder from "~/components/Placeholders/AbstractPlaceholder";
import WaypointSection from "./WaypointSection";
import StyleControls from "./StyleControls";
import Button from "~/components/Form/Button";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

import "~/components/Paper/Tabs/stylesheets/paper.css";

const styleMap = {
  highlight: {
    backgroundColor: colors.BLACK(0.1),
    borderRadius: 2,
  },
};

class PaperDraft extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevEditorState: EditorState.createEmpty(),
      editorState: EditorState.createEmpty(),
      readOnly: true,
      showCommentButton: false,
      focused: false,
      fetching: true,
      expandPaper: false,

      seenEntityKeys: {},
    };
    this.editor;
    this.decorator = new CompositeDecorator([
      {
        strategy: this.findWayPointEntity,
        component: (props) => (
          <WaypointSection
            {...props}
            onSectionEnter={this.props.setActiveSection}
          />
        ),
      },
    ]);
  }

  componentDidMount() {
    this.fetchHTML();
  }

  htmlToStyle = (nodeName, node, currentStyle, idsToRemove) => {
    const { parentNode } = node;

    if (idsToRemove[node.id] || idsToRemove[node.parentNode.id]) {
      return currentStyle.add("hidden");
    }

    if (parentNode.nodeName === "ABSTRACT") {
      return currentStyle.add("hidden");
    }

    switch (nodeName) {
      case "title":
        if (node.textContent.trim().length) {
          if (node.className === "header") {
            return currentStyle.add("title");
          }
          return currentStyle.add("subtitle");
        } else {
          idsToRemove[node.id] = true;
          return currentStyle.add("hidden");
        }
      case "p":
        return currentStyle.add("paragraph");
      case "sec":
        return currentStyle.add("section");
      case "xref":
        return currentStyle.add("xref");
      case "abstract":
      case "fig":
      case "graphic":
      case "front":
      case "back":
      case "journal":
      case "article-id":
      default:
        // return currentStyle.add("meta");
        return currentStyle.add("hidden");
    }
  };

  htmlToEntity = (nodeName, node, createEntity) => {
    const { className } = node;

    if (
      (nodeName === "title" && className === "header") ||
      (nodeName === "p" && className === "last-paragraph")
    ) {
      const [name, index] = node.dataset.props.split("-");

      const entity = createEntity("WAYPOINT", "MUTABLE", {
        name: name,
        index: index,
      });

      return entity;
    }
  };

  fetchHTML = () => {
    fetch(
      API.PAPER({
        paperId: this.props.paperId,
        hidePublic: true,
        route: "pdf_extract_xml_string",
      }),
      API.GET_CONFIG()
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((base64) => {
        const { setPaperExists, setPaperSections } = this.props;
        const [html, idsToRemove, sectionTitles] = this.formatHTMLForMarkup(
          base64
        );

        try {
          const blocksFromHTML = convertFromHTML({
            htmlToBlock: (nodeName, node) => {
              if (idsToRemove[node.id] || idsToRemove[node.parentNode.id]) {
                return false;
              }

              switch (nodeName) {
                case "title":
                  if (node.className === "header") {
                    return {
                      type: "header-one",
                      data: {
                        props: node.dataset.props,
                      },
                    };
                  } else {
                    return {
                      type: "header-two",
                      data: {},
                    };
                  }
                case "p":
                  return {
                    type: "paragraph",
                    data: {},
                  };
                case "abstract":
                case "fig":
                case "graphic":
                case "front":
                case "back":
                case "journal":
                case "article-id":
                  return false;
                default:
                  return true;
              }
            },
            htmlToEntity: this.htmlToEntity,
          })(html, { flat: true });

          const editorState = EditorState.set(
            EditorState.push(this.state.editorState, blocksFromHTML),
            { decorator: this.decorator }
          );

          this.setState({ editorState, fetching: false });
          setPaperExists(true);
          setPaperSections(sectionTitles);
        } catch (err) {
          console.log("er", err);
          this.setState({ fetching: false });
        }
      })
      .catch((err) => {
        console.log("err", err);
        this.setState({ fetching: false });
      });
  };

  formatHTMLForMarkup = (base64) => {
    const sectionTitles = [];
    const idsToRemove = {};

    const html = decodeURIComponent(escape(window.atob(base64)));
    const doc = new DOMParser().parseFromString(html, "text/xml");
    const sections = [].slice.call(doc.getElementsByTagName("sec"));

    let count = 0;

    sections.forEach((section) => {
      const { parentNode } = section;

      const titleNode = section.getElementsByTagName("title")[0];
      const lastPNode = [].slice.call(section.getElementsByTagName("p")).pop();

      if (!titleNode || !lastPNode) {
        return (idsToRemove[section.id] = true);
      }

      const title = titleNode.textContent.trim().toLowerCase();
      const paragraph = lastPNode.textContent.trim();

      if (
        title.length <= 1 ||
        paragraph.length <= 1 ||
        parentNode.nodeName === "abstract" ||
        parentNode.nodeName === "front" ||
        parentNode.nodeName === "back"
      ) {
        return (idsToRemove[section.id] = true);
      }

      if (parentNode.nodeName === "article") {
        const data = `${title}-${count}`;
        const header = section.children[0];

        sectionTitles.push(title); // push title for tabbar

        section.className = "main-section";

        header.className = "header";
        header.setAttribute("data-props", data);

        lastPNode.className = "last-paragraph";
        lastPNode.setAttribute("data-props", data);

        count++;
      }
    });

    return [doc.documentElement.innerHTML, idsToRemove, sectionTitles];
  };

  findWayPointEntity = (contentBlock, callback, contentState) => {
    const { seenEntityKeys } = this.state;
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (!seenEntityKeys[entityKey]) {
        this.setState({
          seenEntityKeys: { ...seenEntityKeys, [entityKey]: true },
        });
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "WAYPOINT"
        );
      }
    }, callback);
  };

  onChange = (editorState) => {
    this.setState({ editorState }, () => {
      // this.handleSelectedText(editorState);
    });
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onBlur = () => {
    this.setState({
      readOnly: true,
      focused: false,
    });
  };

  onTab = (e) => {
    e && e.preventDefault();
    e && e.persist();
    this.onChange(RichUtils.onTab(e, this.state.editorState, 4));
  };

  handleSelectedText = (editorState) => {
    // const { editorState } = this.state;

    const { focused } = this.state;

    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const anchorKey = selection.getAnchorKey();
    const contentBlock = content.getBlockForKey(anchorKey);
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();

    const selectedText = contentBlock.getText().slice(start, end);

    if (focused && (selectedText && selectedText.length)) {
      this.promptAddCommentButton();
    } else {
      this.setState({ showCommentButton: false });
    }
  };

  applyEntityToSelection = () => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();

    const newContent = Modifier.applyEntity(content, selection, "comment");
    this.setEditorState(newContent, "apply-entity-comment");

    this.setState({
      promptAddCommentButton: false,
    });
  };

  promptAddCommentButton = () => {
    this.setState({
      showCommentButton: true,
    });
  };

  setComment = (content, selection) => {
    const currentStyle = this.state.editorState.getCurrentInlineStyle();
    const inlineStyle = "highlight";
    let newContent;

    if (currentStyle.has(inlineStyle)) {
      newContent = Modifier.removeInlineStyle(content, selection, inlineStyle);
    } else {
      newContent = Modifier.applyInlineStyle(content, selection, inlineStyle);
    }

    this.setState({
      editorState: EditorState.push(
        this.state.editorState,
        newContent,
        "change-inline-style"
      ),
    });
  };

  setEditorState = (content, changeType) => {
    const editorState = EditorState.push(
      this.state.editorState,
      content,
      changeType
    );

    this.setState({ editorState });
  };

  undo = () => {
    const editorState = EditorState.undo(this.state.editorState);

    this.setState({
      editorState,
    });
  };

  renderShowCommentButton = () => {
    const { editorState } = this.state;

    const currentBlockKey = editorState.getSelection().getStartKey();
    const currentBlockIndex =
      editorState
        .getCurrentContent()
        .getBlockMap()
        .keySeq()
        .findIndex((k) => k === currentBlockKey) + 1;

    return (
      <div
        className={css(styles.addCommentButton)}
        onClick={this.applyEntityToSelection}
        style={{
          top: 20 * currentBlockIndex,
        }}
      >
        {icons.commentAltPlus}
      </div>
    );
  };

  toggleBlockType = (blockType) => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  getBlockStyle = (block) => {
    switch (block.getType()) {
      case "header-one":
        return "RichEditor-h1";
      case "header-two":
        return "RichEditor-h2";
      case "paragraph":
      case "unstyled":
        return "RichEditor-p";
      default:
        return null;
    }
  };

  handleKeyCommand = (command) => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  toggleEdit = (e) => {
    const { readOnly } = this.state;

    this.setState(
      {
        readOnly: !readOnly,
        prevEditorState: this.state.editorState,
      },
      () => {
        return this.state.readOnly ? this.editor.blur() : this.editor.focus();
      }
    );
  };

  onCancel = () => {
    this.setState(
      {
        readOnly: true,
        editorState: this.state.prevEditorState,
      },
      () => this.editor.blur()
    );
  };

  onSave = () => {
    this.setState(
      {
        readOnly: false,
      },
      () => this.editor.blur()
    );
  };

  render() {
    const {
      fetching,
      editorState,
      showCommentButton,
      expandPaper,
      readOnly,
    } = this.state;

    return (
      <ReactPlaceholder
        ready={!fetching}
        showLoadingAnimation
        customPlaceholder={
          <div style={{ padding: "30px 0 0 50px" }}>
            <AbstractPlaceholder color="#efefef" />
            <AbstractPlaceholder color="#efefef" />
            <AbstractPlaceholder color="#efefef" />
          </div>
        }
      >
        <div className={css(styles.root)}>
          <h3 className={css(styles.title, !readOnly && styles.paddingBottom)}>
            Paper
            <div className={css(styles.pencilIcon)} onClick={this.toggleEdit}>
              {icons.pencil}
            </div>
          </h3>
          <div className={css(styles.toolbar, !readOnly && styles.show)}>
            <StyleControls
              editorState={editorState}
              onClickBlock={this.toggleBlockType}
              onClickInline={this.toggleInlineStyle}
            />
          </div>
          <div className={css(!readOnly && styles.editor)}>
            <Editor
              ref={(ref) => (this.editor = ref)}
              editorState={editorState}
              onChange={this.onChange}
              customStyleMap={styleMap}
              onTab={this.onTab}
              readOnly={readOnly}
              spellCheck={true}
              handleKeyCommand={this.handleKeyCommand}
              blockStyleFn={this.getBlockStyle}
            />
          </div>
          <div className={css(styles.buttonRow, !readOnly && styles.show)}>
            <Button
              label={"Cancel"}
              isWhite={true}
              customButtonStyle={styles.button}
              onClick={this.onCancel}
            />
            <div className={css(styles.divider)} />{" "}
            {/** Needed to retain ripple effect integrity */}
            <Button
              label={"Save"}
              customButtonStyle={styles.button}
              onClick={this.onSave}
            />
          </div>
          {showCommentButton && this.renderShowCommentButton()}
        </div>
      </ReactPlaceholder>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    paddingRight: 10,
    position: "relative",
    fontFamily: "CharterBT",
  },
  paddingBottom: {
    paddingBottom: 30,
  },
  pencilIcon: {
    marginLeft: 8,
    color: colors.BLACK(0.6),
    fontSize: 14,
    cursor: "pointer",
  },
  toolbar: {
    background: "#fff",
    border: "1px solid #ddd",
    fontFamily: `'Georgia', serif`,
    fontSize: 14,
    padding: 15,
    boxSizing: "border-box",
    width: "100%",
    display: "none",
    position: "sticky",
    top: -2,
    zIndex: 2,
  },
  show: {
    display: "flex",
  },
  buttonRow: {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    background: "#fff",
    border: "1px solid #ddd",
    padding: 15,
    boxSizing: "border-box",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    display: "none",
  },
  editor: {
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    ":hover": {
      borderColor: "#B3B3B3",
    },
    ":focus": {
      borderColor: "#3f85f7",
      ":hover": {
        boxShadow: "0px 0px 1px 1px #3f85f7",
        cursor: "text",
      },
    },
  },
  title: {
    padding: "30px 0 20px 50px",
    fontSize: 21,
    fontWeight: 500,
    color: colors.BLACK(),
    display: "flex",
    alignItems: "center",
    margin: 0,
    fontFamily: "Roboto",
    "@media only screen and (max-width: 415px)": {
      fontSize: 20,
    },
  },
  annotatedText: {
    backgroundColor: colors.LIGHT_YELLOW(),
    borderRadius: 2,
    cursor: "pointer",
  },
  addCommentButton: {
    position: "absolute",
    right: -40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: colors.BLACK(0.4),
    cursor: "pointer",
    height: 30,
    minHeight: 30,
    width: 30,
    minWidth: 30,
    padding: 2,
    borderRadius: "50%",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    background: "#FAFAFA",
  },
  blur: {
    background:
      "linear-gradient(180deg, rgba(250, 250, 250, 0) 0%, #FFF 86.38%)",
    height: "100%",
    position: "absolute",
    zIndex: 3,
    top: 0,
    width: "100%",
  },
  expandButton: {
    position: "absolute",
    bottom: 100,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 3,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "unset",
    padding: "0px 15px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.14)",
  },
  button: {
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
  divider: {
    width: 10,
  },
});

export default PaperDraft;
