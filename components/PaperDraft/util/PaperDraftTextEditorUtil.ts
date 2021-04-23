import { draftCssToCustomCssCermine } from "./parse_tools/cermine";
import { EXTRACTOR_TYPE } from "./PaperDraftUtilConstants";
import { ContentBlock, DraftEditorCommand, RichUtils } from "draft-js";
import { ValueOf } from "../../../config/types/root_types";

const { CERMINE, ENGRAFO } = EXTRACTOR_TYPE;

// TODO: calvinhlee maybe remove /change this default as we go further.
export function getBlockStyle(
  style: any,
  extractorType: ValueOf<typeof EXTRACTOR_TYPE>
) {
  switch (extractorType || CERMINE) {
    case CERMINE:
      const customCss = draftCssToCustomCssCermine[style];
      return customCss != null ? customCss : style;
    case ENGRAFO:
    default:
      return style;
  }
}

// TODO: calvinhlee maybe remove /change this default as we go further.
export function getBlockStyleFn(extractorType: ValueOf<typeof EXTRACTOR_TYPE>) {
  return (contentBlock: ContentBlock) => {
    return getBlockStyle(contentBlock.getType(), extractorType || CERMINE);
  };
}

export const getHandleKeyCommand = ({ editorState, setEditorState }) => (
  command: DraftEditorCommand
) => {
  const newEditorState = RichUtils.handleKeyCommand(editorState, command);
  if (newEditorState) {
    setEditorState(newEditorState);
    return true;
  }
  return false;
};

export const getHandleOnTab = ({ editorState, setEditorState }) => (
  event: React.KeyboardEvent<{}> /* DraftJS SyntheticKeyboardEvent */
) => {
  event && event.stopPropagation();
  setEditorState(RichUtils.onTab(event, editorState, 4));
};
