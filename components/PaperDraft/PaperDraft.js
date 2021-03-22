import { connect } from "react-redux";
import {
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
} from "draft-js";
import { handleBlockStyleToggle } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import { MessageActions } from "~/redux/message";
import { StyleSheet, css } from "aphrodite";
import React from "react";
import ReactPlaceholder from "react-placeholder/lib";

// Components
import AbstractPlaceholder from "~/components/Placeholders/AbstractPlaceholder";
import StyleControls from "./StyleControls";
import Button from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";

import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

import "~/components/Paper/Tabs/stylesheets/paper.css";

class PaperDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReadOnly: true,
      isFocused: false,
    };
    this.editor; // $ref to Editor
  }

  onFocus = () => {
    this.setState({ isFocused: true });
    this.editor.focus();
  };

  onBlur = () => {
    this.setState({
      isReadOnly: true,
      isFocused: false,
    });
  };

  toggleBlockType = (toggledBlockType) => (event) => {
    event.stopPropagation();
    const {
      textEditorProps: { editorState, onChange },
    } = this.props;

    // selected block can have multiple block types which translates to css class
    const selectionState = editorState.getSelection();
    const selectionBlockTypes = new Set(
      editorState
        .getCurrentContent()
        .getBlockForKey(selectionState.getStartKey())
        .getType()
        .split(" ")
    );
    const newSlectionBlockTypes = handleBlockStyleToggle({
      selectionBlockTypes,
      toggledStyle: toggledBlockType,
    });
    const currentContentState = editorState.getCurrentContent();

    const modifiedContentState = Modifier.setBlockType(
      currentContentState,
      selectionState,
      Array.from(newSlectionBlockTypes).join(" ")
    );
    const newEditorState = EditorState.push(editorState, modifiedContentState);
    onChange(newEditorState);
  };

  toggleInlineStyle = (inlineStyle) => (event) => {
    event.stopPropagation();
    const {
      textEditorProps: { editorState, onChange },
    } = this.props;
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  toggleEdit = (_) => {
    const { isReadOnly } = this.state;
    this.setState(
      {
        isReadOnly: !isReadOnly,
      },
      () => {
        return this.state.isReadOnly ? this.editor.blur() : this.editor.focus();
      }
    );
  };

  onCancel = () => {
    const {
      textEditorProps: { initEditorState, onChange },
    } = this.props;
    const { isReadOnly } = this.state;
    onChange(initEditorState);
    this.setState({ isReadOnly: !isReadOnly }, () => this.editor.blur());
  };

  onSave = () => {
    const { setMessage, showMessage } = this.props;
    this.setState({ isSaving: true });
    this.saveEdit()
      .then((res) => {
        setMessage("Edit saved.");
        showMessage({ show: true });
        this.setState({ isReadOnly: true, isSaving: false });
      })
      .catch((err) => {
        setMessage("Something went wrong. Please try again!");
        showMessage({ error: true, show: true, isSaving: false });
      });
  };

  saveEdit = () => {
    const {
      textEditorProps: { setInitEditorState, editorState },
      paperId,
      paperDraftSections,
    } = this.props;
    const contentState = editorState.getCurrentContent();
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
    )
      .then(Helpers.checkStatus)
      .then(() =>
        /* after saving the new initState is saved state */
        setInitEditorState(editorState)
      );
  };

  render() {
    const {
      textEditorProps,
      textEditorProps: { editorState },
      isFetching,
      isViewerAllowedToEdit,
      paperDraftExists,
    } = this.props;
    const { isReadOnly, isSaving } = this.state;
    return (
      <ReactPlaceholder
        ready={!isFetching}
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
          <h3
            className={css(styles.title, !isReadOnly && styles.paddingBottom)}
          >
            Paper
            {isViewerAllowedToEdit && (
              <div className={css(styles.pencilIcon)} onClick={this.toggleEdit}>
                {icons.pencil}
              </div>
            )}
          </h3>
          <div
            className={css(styles.toolbar, !isReadOnly && styles.editActive)}
            onClick={this.onFocus}
          >
            <StyleControls
              editorState={editorState}
              onClickBlock={this.toggleBlockType}
              onClickInline={this.toggleInlineStyle}
            />
          </div>
          <div className={css(!isReadOnly && styles.editorActive)}>
            <Editor
              {...textEditorProps}
              readOnly={isReadOnly} // setting this to false will grant me access to selection
              ref={(ref) => (this.editor = ref)}
            />
          </div>
          <div
            className={css(styles.buttonRow, !isReadOnly && styles.editActive)}
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
                isSaving ? (
                  <Loader loading={true} size={10} color={"#FFF"} />
                ) : (
                  "Save"
                )
              }
              customButtonStyle={styles.button}
              disabled={isSaving}
              onClick={!isSaving && this.onSave}
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
