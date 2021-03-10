import React from "react";
import { connect } from "react-redux";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
} from "draft-js";
import { convertFromHTML } from "draft-convert";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

import { MessageActions } from "~/redux/message";

// Components
import AbstractPlaceholder from "~/components/Placeholders/AbstractPlaceholder";
import WaypointSection from "./WaypointSection";
import StyleControls from "./StyleControls";
import Button from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

import { fetchPaperDraft } from "~/config/fetch";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

import "~/components/Paper/Tabs/stylesheets/paper.css";

class PaperDraft extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevEditorState: EditorState.createEmpty(),
      editorState: EditorState.createEmpty(),
      readOnly: true,
      focused: false,
      fetching: true,
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

  componentDidUpdate(prevProps) {
    if (prevProps.paperId !== this.props.paperId) {
      this.fetchHTML();
    }
  }

  htmlToBlock = (nodeName, node, idsToRemove) => {
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
        }

        return {
          type: "header-two",
          data: {},
        };
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
  };

  htmlToStyle = (nodeName, node, currentStyle) => {
    if (nodeName === "xref") {
      return currentStyle.add("ITALIC");
    }
    return currentStyle;
  };

  htmlToEntity = (nodeName, node, createEntity) => {
    const { className } = node;

    if (
      (nodeName === "title" && className === "header") ||
      (nodeName === "p" && className === "last-paragraph")
    ) {
      const [name, index] = node.dataset.props.split("-");

      const entity = createEntity("WAYPOINT", "IMMUTABLE", {
        name: name,
        index: index,
      });

      return entity;
    }
  };

  fetchHTML = () => {
    const { paperId } = this.props;
    fetchPaperDraft({ paperId })
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(this.handleData)
      .catch(() => {
        this.handleError();
        this.setState({ fetching: false });
      });
  };

  handleData = (data) => {
    if (typeof data !== "string") {
      return this.setRawToEditorState(data);
    } else {
      return this.setBase64ToEditorState(data);
    }
  };

  /**
   * @param {JSON} res => Backend JSON with rawEditorState and saved Sections
   *
   * converts raw Draft JSON to Draft Edtior State
   */
  setRawToEditorState = (res) => {
    try {
      const { data, sections } = res;

      const editorState = EditorState.set(
        EditorState.createWithContent(convertFromRaw(data)),
        { decorator: this.decorator }
      );
      this.onChaange(editorState);
      this.updateParentState(sections);
    } catch {
      this.handleError();
    } finally {
      this.setState({ fetching: false });
    }
  };

  /**
   *
   * @param {String} base64 - string returned from scrapped pdf
   *
   * converts base64 to custom HTML to Draft Editor State
   */
  setBase64ToEditorState = (base64) => {
    const [html, idsToRemove, sectionTitles] = this.formatHTMLForMarkup(base64);

    try {
      const blocksFromHTML = convertFromHTML({
        htmlToBlock: (nodeName, node) =>
          this.htmlToBlock(nodeName, node, idsToRemove),
        htmlToStyle: this.htmlToStyle,
        htmlToEntity: this.htmlToEntity,
      })(html, { flat: true });

      const { editorState } = this.state;

      const updatedEditorState = EditorState.set(
        EditorState.push(editorState, blocksFromHTML),
        { decorator: this.decorator }
      );

      this.onChange(updatedEditorState);
      this.updateParentState(sectionTitles);
    } catch {
      this.handleError();
    } finally {
      this.setState({ fetching: false });
    }
  };

  handleError = (err) => {
    const { setPaperDraftExists, setPaperDraftSections } = this.props;
    setPaperDraftExists(false);
    setPaperDraftSections([]);
    this.setState({ fetching: false });
  };

  updateParentState = (sectionTitles) => {
    const { setPaperDraftExists, setPaperDraftSections } = this.props;
    setPaperDraftExists(true);
    setPaperDraftSections(sectionTitles);
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
    this.setState({ editorState });
  };

  onFocus = () => {
    this.setState({ focused: true });
    this.editor.focus();
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

  /**
   * Used for Modifier states
   */
  setEditorState = (content, changeType) => {
    const editorState = EditorState.push(
      this.state.editorState,
      content,
      changeType
    );

    this.onChange(editorState);
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
    const { setMessage, showMessage } = this.props;
    this.setState({ saving: true });
    this.saveEdit()
      .then((res) => {
        setMessage("Edit saved.");
        showMessage({ show: true });
        this.setState({ readOnly: true, saving: false });
      })
      .catch((err) => {
        setMessage("Something went wrong. Please try again!");
        showMessage({ error: true, show: true, saving: false });
      });
  };

  saveEdit = () => {
    const { paperId, paperDraftSections } = this.props;
    const contentState = this.state.editorState.getCurrentContent();

    return fetch(
      API.PAPER({
        paperId,
        hidePublic: true,
        route: "edit_file_extract",
      }),
      API.POST_CONFIG({
        data: convertToRaw(contentState),
        sections: paperDraftSections,
      })
    ).then(Helpers.checkStatus);
  };

  render() {
    const { isModerator, paperDraftExists } = this.props;
    const { fetching, editorState, readOnly, saving } = this.state;

    return (
      <ReactPlaceholder
        ready={!fetching}
        showLoadingAnimation
        customPlaceholder={
          <div style={{ paddingTop: 30 }}>
            <AbstractPlaceholder color="#efefef" />
            <AbstractPlaceholder color="#efefef" />
            <AbstractPlaceholder color="#efefef" />
          </div>
        }
      >
        <div className={css(styles.root, !paperDraftExists && styles.hidden)}>
          <h3 className={css(styles.title, !readOnly && styles.paddingBottom)}>
            Paper
            {isModerator && (
              <div className={css(styles.pencilIcon)} onClick={this.toggleEdit}>
                {icons.pencil}
              </div>
            )}
          </h3>
          <div
            className={css(styles.toolbar, !readOnly && styles.editActive)}
            onClick={this.onFocus}
          >
            <StyleControls
              editorState={editorState}
              onClickBlock={this.toggleBlockType}
              onClickInline={this.toggleInlineStyle}
            />
          </div>
          <div className={css(!readOnly && styles.editorActive)}>
            <Editor
              ref={(ref) => (this.editor = ref)}
              editorState={editorState}
              onChange={this.onChange}
              onTab={this.onTab}
              readOnly={readOnly}
              spellCheck={true}
              handleKeyCommand={this.handleKeyCommand}
              blockStyleFn={this.getBlockStyle}
            />
          </div>
          <div
            className={css(styles.buttonRow, !readOnly && styles.editActive)}
          >
            <Button
              label={"Cancel"}
              isWhite={true}
              customButtonStyle={styles.button}
              onClick={this.onCancel}
            />
            <div className={css(styles.divider)} />
            {/** Needed to retain ripple effect integrity */}
            <Button
              label={
                saving ? (
                  <Loader loading={true} size={10} color={"#FFF"} />
                ) : (
                  "Save"
                )
              }
              customButtonStyle={styles.button}
              disabled={saving}
              onClick={!saving && this.onSave}
            />
          </div>
        </div>
      </ReactPlaceholder>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    position: "relative",
    fontFamily: "CharterBT",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      flexDirection: "column",
    },
  },
  hidden: {
    display: "none",
  },
  paddingBottom: {
    paddingBottom: 30,
  },
  pencilIcon: {
    marginLeft: 8,
    color: "rgba(36, 31, 58, 0.4)",
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
    zIndex: 4,
    "@media only screen and (max-width: 767px)": {
      top: 51,
    },
  },
  editActive: {
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
  editorActive: {
    border: "1px solid #E8E8F2",
    backgroundColor: "#FBFBFD",
    padding: 20,
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
    padding: "30px 0 20px 0",
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

const mapStateToProps = (state) => ({
  vote: state.vote,
  auth: state.auth,
  user: state.auth.user,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperDraft);
