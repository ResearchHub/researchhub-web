import { useEffect, useState, useContext } from "react";
import config, { contextConfig } from "./lib/config";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  textLength,
  imageLength,
  trimDeltas,
  quillDeltaToHtml,
} from "./lib/quill";
import { CommentTreeContext } from "./lib/contexts";
import { COMMENT_CONTEXTS } from "./lib/types";

type Args = {
  content: any;
  previewMaxCharLength?: number;
  previewMaxImageLength?: number;
};

const CommentReadOnly = ({
  content,
  previewMaxCharLength = contextConfig.generic.previewMaxChars,
  previewMaxImageLength = contextConfig.generic.previewMaxImages,
}: Args) => {
  const [isPreview, setIsPreview] = useState<boolean>(true);
  const [previewHtml, setPreviewHtml] = useState<any>(null);
  const [fullHtml, setFullHtml] = useState<any>(null);
  const commentTreeState = useContext(CommentTreeContext);

  useEffect(() => {
    const trimContentEnabled = previewMaxCharLength > 0;
    const _textLength = textLength({ quillOps: content.ops });
    const _imageLength = imageLength({ quillOps: content.ops });
    if (
      trimContentEnabled &&
      (_textLength > previewMaxCharLength ||
        _imageLength > previewMaxImageLength)
    ) {
      const trimmed = trimDeltas({
        quillOps: content.ops,
        maxLength: previewMaxCharLength,
        maxImages: previewMaxImageLength,
      });
      const trimmedHtml = quillDeltaToHtml({ ops: trimmed });
      setPreviewHtml(trimmedHtml);
    }
    const html = quillDeltaToHtml({ ops: content.ops });
    setFullHtml(html);
  }, []);

  const isNarrowWidthContext =
    commentTreeState.context === COMMENT_CONTEXTS.SIDEBAR ||
    commentTreeState.context === COMMENT_CONTEXTS.DRAWER;
  const htmlToRender = isPreview && previewHtml ? previewHtml : fullHtml;
  return (
    <div>
      <div
        className={`CommentEditor ${
          isNarrowWidthContext ? "CommentEditorForNarrowWidth" : ""
        }`}
      >
        <div
          className={
            "ql-container ql-snow  " +
            (previewHtml && isPreview ? "quill-preview-mode" : "")
          }
        >
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: htmlToRender }}
          />
        </div>
      </div>
      {previewHtml && (
        <IconButton
          overrideStyle={styles.readMoreWrapper}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPreview(!isPreview);
          }}
        >
          <span className={css(styles.readMore)}>
            {isPreview ? `Read More` : `Show Less`}
          </span>
          <FontAwesomeIcon
            icon={isPreview ? faAngleDown : faAngleUp}
            style={{ marginLeft: 3, fontSize: 16 }}
          />
        </IconButton>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  readMore: {
    fontWeight: 500,
    fontSize: 14,
  },
  readMoreWrapper: {
    color: colors.primary.btn,
    marginLeft: -5,
  },
});

export default CommentReadOnly;
