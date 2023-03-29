import { useEffect, useState } from "react";
import { useQuill } from "./hooks/useQuill";
import config from "./lib/config";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 

type Args = {
  content: any;
};

const CommentReadOnly = ({ content }: Args) => {
  var startTime = performance.now()

  const [isPreview, setIsPreview] = useState<boolean>(true);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState<boolean>(false);

  var cfg = {};
  var converter = new QuillDeltaToHtmlConverter(content.ops, cfg);
  var html = converter.convert();

      var endTime = performance.now()
      console.log('content', content.ops)
      console.log('html', html)
      console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

      // if (length > config.comment.previewMaxChars) {
      //   setShowLoadMoreBtn(true);
      //   if (isPreview) {
      //     quill.deleteText(config.comment.previewMaxChars, length);
      //   }
      // }

  return (
    <div>
      <div className={showLoadMoreBtn && isPreview ? "quill-preview-mode" : ""}>
        <div  dangerouslySetInnerHTML={{__html: html}} />
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
