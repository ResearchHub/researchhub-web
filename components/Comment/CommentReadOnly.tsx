import { useEffect, useState } from "react";
import { useQuill } from "./hooks/useQuill";
import config from "./lib/config";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
import { reviewCategories } from "./lib/options";
import { buildHtmlForReviewBlot } from "./lib/quill";

type Args = {
  content: any;
};


const CommentReadOnly = ({ content }: Args) => {
  const [isPreview, setIsPreview] = useState<boolean>(true);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState<boolean>(false);

  var cfg = {};
  var converter = new QuillDeltaToHtmlConverter(content.ops, cfg);
  converter.renderCustomWith(function(customOp, contextOp){
    if (customOp.insert.type === 'peer-review-rating') {
      const category = customOp.insert.value?.category 
      const label = reviewCategories[category]?.label || "Unknown category";
      const rating = customOp.insert.value?.rating;
      // @ts-ignore
      const html = buildHtmlForReviewBlot({ category: label, readOnly: true, rating });
      return html;
    } else {
        console.error('Unmanaged custom blot!');
    }
  });

  const html = converter.convert();
      // if (length > config.comment.previewMaxChars) {
      //   setShowLoadMoreBtn(true);
      //   if (isPreview) {
      //     quill.deleteText(config.comment.previewMaxChars, length);
      //   }
      // }

  return (
    <div>
      <div className="CommentEditor">
        <div className={"ql-container ql-snow" + (showLoadMoreBtn && isPreview ? "quill-preview-mode" : "")}>
          <div className="ql-editor" dangerouslySetInnerHTML={{__html: html}} />
        </div>
      </div>
      {showLoadMoreBtn && (
        <IconButton
          overrideStyle={styles.readMoreWrapper}
          onClick={() => setIsPreview(!isPreview)}
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
