import { getBlockStyle } from "./util/PaperDraftTextEditorUtil";
import { getCurrSelectionBlockTypesInSet } from "../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";
import {
  getStyleControlButtonOptions,
  INLINE_STYLE_OPTIONS,
} from "./util/StyleControlsConstants";
import { StyleSheet, css } from "aphrodite";
import React, { useMemo } from "react";
import StyleButton from "./StyleButton";

// Config
import colors from "~/config/themes/colors";
import PaperDraftUnduxStore from "./undux/PaperDraftUnduxStore";

const BlockStyleControls = (props) => {
  const { editorState, onClickBlock, onClickInline } = props;
  const currSelectedBlockTypes = getCurrSelectionBlockTypesInSet(editorState);
  const paperDraftStore = PaperDraftUnduxStore.useStore();
  const paperExtractorType = paperDraftStore.get("extractorType");
  const blockButtonOptions = useMemo(
    () => getStyleControlButtonOptions(paperExtractorType),
    [paperExtractorType]
  );
  const blockStyleButtons = useMemo(
    () =>
      blockButtonOptions.map(({ label, style }) => {
        return (
          <StyleButton
            isStyleActive={
              currSelectedBlockTypes.has(style) ||
              currSelectedBlockTypes.has(
                getBlockStyle(style, paperDraftStore.get("extractorType"))
              )
            }
            key={label}
            label={label}
            onClick={onClickBlock(style)}
            style={style}
          />
        );
      }),
    [blockButtonOptions, currSelectedBlockTypes, getBlockStyle, onClickBlock]
  );
  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const inlineStylebuttons = useMemo(
    () =>
      INLINE_STYLE_OPTIONS.map(({ label, style }) => (
        <StyleButton
          isStyleActive={currentInlineStyle === style}
          key={label}
          label={label}
          onClick={onClickInline(style)}
          style={style}
        />
      )),
    [currentInlineStyle, onClickInline]
  );
  return (
    <div className={css(styles.root)}>
      {blockStyleButtons}
      {inlineStylebuttons}
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
