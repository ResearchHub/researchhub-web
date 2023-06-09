import Quill from "quill";
import { useEffect } from "react";
import { commentTypes, reviewCategories } from "../lib/options";
import { forceShowPlaceholder, hasQuillContent, insertReviewCategory, placeCursorAtEnd, trimQuillEditorContents, focusEditor } from "../lib/quill";
import { COMMENT_TYPES } from "../lib/types";

function useEffectForCommentTypeChange ({ commentType, quill, quillRef, isReady }: { commentType: string, quill: Quill|undefined, quillRef: any, isReady: boolean }) {
  useEffect(() => {
    if (!(isReady && quill)) {
      return;
    }

    if (commentType === COMMENT_TYPES.REVIEW) {
      const reviewAlreadySelected = hasQuillContent({ quill, contentType: "peer-review-rating" });
      if (reviewAlreadySelected) {
        return;
      }

      quillRef.current.classList.add("peer-review");      

      console.log('insertReviewCategory')
      insertReviewCategory({
        category: reviewCategories.overall,
        index: 0,
        quill,
        quillRef
      });     
    }
    else {
      quillRef.current.classList.remove("peer-review");
      const contents = quill.getContents()
      let editorWithoutPeerReviewBlocks;

      if (contents) {
        editorWithoutPeerReviewBlocks = contents
          .ops?.filter((op) => !op.insert["peer-review-rating"]);
        quill.setContents(editorWithoutPeerReviewBlocks);
      }

      const trimmedContents = trimQuillEditorContents({
        contents: quill.getContents(),
      });
      quill.setContents(trimmedContents);
    }

    const hasContent = hasQuillContent({ quill });
    if (!hasContent) {
      forceShowPlaceholder({
        quillRef,
        placeholderText: commentTypes.find((ctype) => ctype.value === commentType)?.placeholder,
      });
    }

    focusEditor({ quill });
  }, [commentType, isReady, quill])
}


export default useEffectForCommentTypeChange;