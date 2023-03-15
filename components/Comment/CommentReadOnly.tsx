import { useEffect, useState } from "react";
import { useQuill } from "./hooks/useQuill";
import config from "./lib/config";
import { css, StyleSheet } from "aphrodite";
import colors from "./lib/colors";
import IconButton from "../Icons/IconButton";

type Args = {
  content: any;
};

const CommentReadOnly = ({ content }: Args) => {
  const { quill, quillRef } = useQuill();
  const [isPreview, setIsPreview] = useState<boolean>(true);

  useEffect(() => {
    if (quill) {
      quill.disable();
      quill.setContents(content);
      if (isPreview) {
        quill.deleteText(config.comment.previewMaxChars, quill.getLength());
      }
    }
  }, [quill, isPreview]);


  return (
    <div>
      <div ref={quillRef} />
      <IconButton overrideStyle={styles.readMoreWrapper} onClick={() => setIsPreview(!isPreview)}>
        <span className={css(styles.readMore)}>
          {isPreview ? `Read More` : `Show Less`}
        </span>
      </IconButton>
    </div>
  );
};

const styles = StyleSheet.create({
  readMore: {
    color: colors.primary.btn,
    fontWeight: 400,
    fontSize: 14,
  },
  readMoreWrapper: {
    marginLeft: -5,
  },
})

export default CommentReadOnly;
