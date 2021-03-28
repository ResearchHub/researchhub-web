import { css, StyleSheet } from "aphrodite";
import React from "react";

function PaperDraftInlineCommentTextWrap(props) {
  const { entityKey, contentState } = props ?? {};
  const data = contentState.getEntity(entityKey).getData();
  return (
    <span className={css(styles.commentTextHighLight)}>{props.children}</span>
  );
}

const styles = StyleSheet.create({
  commentTextHighLight: {
    backgroundColor: "rgb(204 243 221)",
  },
});

export default PaperDraftInlineCommentTextWrap;
