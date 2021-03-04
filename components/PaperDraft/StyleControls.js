import React from "react";
import { StyleSheet, css } from "aphrodite";

import StyleButton from "./StyleButton";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
];

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
];

const BlockStyleControls = (props) => {
  const { editorState, onClickBlock, onClickInline } = props;
  const selection = editorState.getSelection();

  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className={css(styles.root)}>
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          style={type.style}
          onClick={onClickBlock}
        />
      ))}
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          style={type.style}
          onClick={onClickInline}
        />
      ))}
    </div>
  );
};

const styles = StyleSheet.create({
  root: {
    fontFamily: "Helvetica",
    fontSize: 14,
    marginBottom: 5,
    userSelect: "none",
  },
  highlight: {
    backgroundColor: colors.BLACK(0.1),
    borderRadius: 2,
  },
  title: {
    fontWeight: 500,
    fontSize: 20,
    display: "inline-block",
    lineHeight: 2,
    fontFamily: "Roboto",
    width: "100%",
    whiteSpace: "normal",
  },
  subtitle: {
    fontWeight: 500,
    fontSize: 16,
    display: "inline-block",
    lineHeight: 2,
    fontFamily: "Roboto",
    whiteSpace: "normal",
  },
  section: {
    display: "inline",
  },
  paragraph: {
    display: "inline",
    padding: 0,
    color: colors.BLACK(),
    fontWeight: 400,
    fontSize: 16,
    width: "100%",
    lineHeight: 2,
    boxSizing: "border-box",
    whiteSpace: "pre-wrap",
    "@media only screen and (maxWidth: 967px)": {
      fontSize: 14,
      width: "100%",
    },
    "@media only screen and (maxWidth: 415px)": {
      fontSize: 12,
    },
  },
  span: {
    display: "inline",
    color: colors.BLUE(),
  },
  xref: {
    display: "inline",
    fontStyle: "italic", //will inherit inline styles so not needed,
  },
  body: {
    margin: 0,
    padding: 0,
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
});

export default BlockStyleControls;
