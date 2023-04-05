import { useEffect, useState } from "react";
import config from "./lib/config";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { textLength, trimDeltas, quillDeltaToHtml } from "./lib/quill";

type Args = {
  content: any;
  previewMaxCharLength?: number;
};

const CommentReadOnly = ({ content, previewMaxCharLength = config.default.previewMaxChars }: Args) => {
  const [isPreview, setIsPreview] = useState<boolean>(true);
  const [previewHtml, setPreviewHtml] = useState<any>(null);
  const [fullHtml, setFullHtml] = useState<any>(null);

  useEffect(() => {
    const length = textLength({ quillOps: content.ops });
    if (length > previewMaxCharLength) {
      const trimmed = trimDeltas({ quillOps: content.ops, maxLength: previewMaxCharLength });
      const trimmedHtml = quillDeltaToHtml({ ops: trimmed });
      setPreviewHtml(trimmedHtml);
    }
    
    const html = quillDeltaToHtml({ ops: content.ops });
    setFullHtml(html);
  }, []);

  const htmlToRender = (isPreview && previewHtml) ? previewHtml : fullHtml;
  return (
    <div>
      <div className="CommentEditor">
        <div className={"ql-container ql-snow" + (previewHtml && isPreview ? "quill-preview-mode" : "")}>
          <div className="ql-editor" dangerouslySetInnerHTML={{__html: htmlToRender}} />
        </div>
      </div>
      {previewHtml && (
        <IconButton
          overrideStyle={styles.readMoreWrapper}
          onClick={() => {
            setIsPreview(!isPreview)
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
