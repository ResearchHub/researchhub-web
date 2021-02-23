import React, { Fragment, useState } from "react";
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
  KeyBindingUtil,
} from "draft-js";
import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const { hasCommandModifier } = KeyBindingUtil;

const styleMap = {
  HIGHLIGHT: {
    backgroundColor: "#FFFF00",
  },
};
class PaperDraft extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
    showBox: false,
    selectedText: false,
  };

  componentDidMount() {
    const { abstract } = this.props;
    this.setState({
      editorState: EditorState.createWithContent(
        ContentState.createFromText(
          "For traditional library collections, archivists can select a representative sample from a collection and display it in a featured physical or digital library space. Web archive collections may consist of thousands of archived pages, or mementos. How should an archivist display this sample to drive visitors to their collection? Search engines and social media platforms often represent web pages as cards consisting of text snippets, titles, and images. Web storytelling is a popular method for grouping these cards in order to summarize a topic. Unfortunately, social media platforms are not archive-aware and fail to consistently create a good experience for mementos. They also allow no UI alterations for their cards. Thus, we created MementoEmbed to generate cards for individual mementos and Raintale for creating entire stories that archivists can export to a variety of formats."
        )
      ),
    });
  }

  onChange = (editorState) => {
    this.setState({ editorState }, () => {
      this.getSelectedText(editorState);
    });
  };

  onFocus = () => {
    this.setState({
      showBox: true,
    });
  };

  blockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === "unstyled") {
      return {
        component: (props) => (
          <Component
            {...props}
            highlight={false}
            showBox={this.state.showBox}
            setHighlight={this.setHighlight}
          />
        ),
        editable: false,
        props: {
          foo: "bar",
        },
      };
    }
    // else if (type === "HIGHLIGHT") {
    //   return {
    //     component: (props) => <Component {...props} highlight={true} />,
    //     editable: false,
    //     props: {
    //       foo: "bar"
    //     }
    //   }
    // }
  };

  insertBlock = () => {
    const { editorState } = this.state;

    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity(
      "COMMENT",
      "IMMUTABLE",
      { a: "b" }
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        " "
      ),
    });
  };

  setHighlight = () => {
    const selectionState = this.state.editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();

    this.setComment(currentContent, selectionState);
  };

  getSelectedText = () => {
    const selectionState = this.state.editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = this.state.editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();

    const selectedText = currentContentBlock.getText().slice(start, end);
    this.setComment(currentContent, selectionState);
  };

  setComment = (contentState, selectionState) => {
    const newContent = Modifier.applyInlineStyle(
      this.state.editorState.getCurrentContent(),
      selectionState,
      "HIGHLIGHT"
    );

    this.setState({
      editorState: EditorState.push(
        this.state.editorState,
        newContent,
        "change-inline-style"
      ),
    });
  };

  render() {
    const { editorState } = this.state;

    return (
      <div className={css(styles.root)}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          blockRendererFn={this.blockRenderer}
          focus={this.onFocus}
          customStyleMap={styleMap}
          onFocus={this.onFocus}
          // onBlur={() => this.setState({ showBox: false })}
        />
      </div>
    );
  }
}

const Component = (props) => {
  // const [showBox, setShowBox] = useState(false);
  const {
    block,
    contentState,
    blockProps,
    highlight,
    showBox,
    setHighlight,
  } = props;
  // const data = contentState.getEntity(block.getEntityAt(0)).getData();
  // console.log(props, data, blockProps);

  // const [showBox, setShowBox] = useState(false);

  const renderBox = () => {
    return (
      <div className={css(styles.commentContainer)} onClick={setHighlight}>
        {icons.commentAltPlus}
      </div>
    );
  };

  return (
    <p
      className={css(styles.text)}
      // onMouseEnter={() => setShowBox(true)}
      // onMouseLeave={() => setShowBox(false)}
    >
      {showBox && renderBox()}
      {<EditorBlock {...props} />}
    </p>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "100%",
    lineHeight: 2,
    display: "flex",
    paddingRight: 10,
  },
  text: {
    width: "100%",
    position: "relative",
    margin: 0,
    padding: 0,
  },
  highlight: {
    background: "#EDEDED",
  },
  commentContainer: {
    position: "absolute",
    right: -49,
    fontSize: 20,
    color: colors.BLACK(0.7),
  },
});

export default PaperDraft;
