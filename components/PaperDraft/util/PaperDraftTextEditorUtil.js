import { RichUtils } from "draft-js";
import { INLINE_COMMENT_MAP } from "../../PaperDraftInlineComment/util/PaperDraftInlineCommentUtil";

export const draftCssToCustomCss = {
  "header-one": "RichEditor-h1",
  "header-two": "RichEditor-h2",
  paragraph: "RichEditor-p",
  unstyled: "RichEditor-p",
  [INLINE_COMMENT_MAP.DRAFT_JS]: INLINE_COMMENT_MAP.PAPER_DRAFT,
};

export const getBlockStyleFn = (block) => {
  const blockType = block.getType();
  const customCss = draftCssToCustomCss[blockType];
  return customCss != null ? customCss : blockType;
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
