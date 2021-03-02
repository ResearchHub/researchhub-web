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
import PropTypes from "prop-types";
import ReactPlaceholder from "react-placeholder/lib";
import { Waypoint } from "react-waypoint";

// Components
import AbstractPlaceholder from "~/components/Placeholders/AbstractPlaceholder";
import Button from "~/components/Form/Button";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const styleMap = {
  highlight: {
    backgroundColor: colors.BLACK(0.1),
    borderRadius: 2,
  },
  title: {
    padding: "15px 0",
    fontWeight: 500,
    fontSize: 20,
    display: "inline-block",
    lineHeight: 2,
    fontFamily: "Roboto",
    width: "100%",
  },
  subtitle: {
    padding: "10px 0",
    fontWeight: 500,
    fontSize: 18,
    display: "inline-block",
    lineHeight: 2,
    fontFamily: "CharterBT",
  },
  abstract: {
    fontStyle: "italic",
    fontSize: 14,
    padding: "0px 0 20px",
    display: "inline-block",
    lineHeight: 2,
    whiteSpace: "pre-wrap",
  },
  section: {
    display: "inline-block",
    padding: "15px 0",
  },
  paragraph: {
    display: "inline-block",
    margin: 0,
    padding: "10px 0",
    color: colors.BLACK(),
    fontWeight: 400,
    fontSize: 16,
    width: "100%",
    lineHeight: 2,
    boxSizing: "border-box",
    "@media only screen and (maxWidth: 967px)": {
      fontSize: 14,
      width: "100%",
    },
    "@media only screen and (maxWidth: 415px)": {
      fontSize: 12,
    },
  },
  xref: {
    fontStyle: "italic", //will inherit inline styles so not needed
  },
  meta: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 300,
    whiteSpace: "normal",
    lineHeight: 1.3,
  },
  back: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 300,
    whiteSpace: "normal",
    lineHeight: 1,
  },
  hidden: {
    height: 0,
    maxHeight: 0,
    overflow: "hidden",
    visibility: "hidden",
    opacity: 0,
    padding: 0,
    margin: 0,
    lineHeight: 0,
    display: "none",
  },
};

class PaperDraft extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      readOnly: true,
      showCommentButton: false,
      focused: false,
      fetching: true,
      expandPaper: false,

      seenEntityKeys: {},
    };

    this.decorator = new CompositeDecorator([
      {
        strategy: this.findWayPointEntity,
        component: (props) => (
          <SectionBlock
            {...props}
            onSectionEnter={this.props.setActiveSection}
          />
        ),
      },
    ]);

    // this.blockRenderMap = Immutable.Map({
    //   'section': {
    //     element: 'section',
    //     wrapper: <SectionBlock editorState={this.state.editorState} onSectionEnter={this.props.setActiveSection} />
    //         // {...props}
    //         // onSectionEnter={this.props.setActiveSection}
    //     // />
    //   },

    // });

    // this.extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(this.blockRenderMap);
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
        return currentStyle.add("hidden");
      case "article-id":
        return currentStyle.add("doi");
      default:
        return currentStyle.add("meta");
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
            htmlToStyle: (nodeName, node, currentStyle) => {
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
                  return currentStyle.add("hidden");
                case "article-id":
                  return currentStyle.add("doi");
                default:
                  return currentStyle.add("meta");
              }
            },
            htmlToEntity: this.htmlToEntity,
          })(html);

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
      const title = titleNode.textContent.trim().toLowerCase();
      const paragraph = lastPNode.textContent.trim();

      if (
        !titleNode ||
        !lastPNode ||
        title.length <= 1 ||
        paragraph.length <= 1
      ) {
        return (idsToRemove[section.id] = true);
      }
      if (
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

  // onBlur = () => {
  //   this.setState({
  //     readOnly: true,
  //     focused: false,
  //   });
  // };

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
            <span
              className={css(styles.pencilIcon)}
              onClick={() => this.setState({ readOnly: !readOnly })}
            >
              {icons.pencil}
            </span>
          </h3>
          <div className={css(!readOnly && styles.editor)}>
            <Editor
              editorState={editorState}
              onChange={this.onChange}
              customStyleMap={styleMap}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              readOnly={readOnly}
              readOnly={false}
            />
          </div>
          {showCommentButton && this.renderShowCommentButton()}
        </div>
      </ReactPlaceholder>
    );
  }
}

const SectionBlock = (props) => {
  const { contentState, entityKey, onSectionEnter } = props;

  const sectionInstance = contentState.getEntity(entityKey);
  const { name, index } = sectionInstance.getData();

  return (
    <div {...props}>
      <Waypoint
        onEnter={() => {
          onSectionEnter(index);
        }}
        topOffset={40}
        bottomOffset={"95%"}
      >
        <a name={name}>{props.children}</a>
      </Waypoint>
    </div>
  );
};

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
    paddingTop: 30,
    paddingLeft: 50,
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
});

export default PaperDraft;
