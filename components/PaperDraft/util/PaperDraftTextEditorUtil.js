import { RichUtils } from "draft-js";

export const getBlockStyleFn = (block) => {
  const blockType = block.getType();

  switch (blockType) {
    // these are css classNames. Refer to "paper.css"
    case "header-one":
      return "RichEditor-h1";
    case "header-two":
      return "RichEditor-h2";
    case "paragraph":
    case "unstyled":
      return "RichEditor-p";
    default:
      return blockType;
  }
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
