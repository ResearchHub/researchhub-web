import { RichUtils } from "draft-js";
import { INLINE_COMMENT_MAP } from "../../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";

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
    case INLINE_COMMENT_MAP.CLASS_NAME:
      return INLINE_COMMENT_MAP.CSS;
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
