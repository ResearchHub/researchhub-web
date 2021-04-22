import { draftCssToCustomCssCermine } from "./parse_tools/cermine";
import { EXTRACTOR_TYPE } from "./PaperDraftUtilConstants";
import { RichUtils } from "draft-js";

const { CERMINE, ENGRAFO } = EXTRACTOR_TYPE;

export const getBlockStyle = (style, extractorType = ENGRAFO) => {
  switch (extractorType) {
    case CERMINE:
      const customCss = draftCssToCustomCssCermine[style];
      return customCss != null ? customCss : style;
    case ENGRAFO:
    default:
      return style;
  }
};

export const getBlockStyleFn = (extractorType = ENGRAFO) => (contentBlock) => {
  const blockType = contentBlock.getType();
  return getBlockStyle(blockType, extractorType);
};

export const getHandleKeyCommand = ({ editorState, setEditorState }) => (
  command
) => {
  const newEditorState = RichUtils.handleKeyCommand(editorState, command);
  if (newEditorState) {
    setEditorState(newEditorState);
    return true;
  }
  return false;
};

export const getHandleOnTab = ({ editorState, setEditorState }) => (event) => {
  event && event.stopPropagation();
  setEditorState(RichUtils.onTab(event, editorState, 4));
};
