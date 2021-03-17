import { RichUtils } from "draft-js";

export const getBlockStyleFn = (block) => {
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

export const getHandleOnTab = ({ editorState, setEditorState }) => (e) => {
  e && e.preventDefault();
  e && e.persist();
  setEditorState(RichUtils.onTab(e, editorState, 4));
};
