import { css, StyleSheet } from "aphrodite";
import InlineCommentUnduxStore, {
  cleanupStoreAndCloseDisplay,
  getSavedInlineCommentsGivenBlockKeyAndThreadID,
  InlineComment,
  InlineCommentStore,
} from "./undux/InlineCommentUnduxStore";
import { formatTextWrapID } from "./util/PaperDraftInlineCommentUtil";
import PaperDraftUnduxStore from "../PaperDraft/undux/PaperDraftUnduxStore";
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
  useRef,
  RefObject,
} from "react";

type UseEffectPrepareSlideButtonArgs = {
  decoratedText: string;
  inlineCommentStore: InlineCommentStore;
  isBeingPrompted: boolean;
  setShouldPrepSlideButton: (flag: boolean) => void;
  shouldPrepSlideButton: boolean;
  textRef: RefObject<HTMLSpanElement>;
};

function useEffectPrepareSlideButton({
  decoratedText,
  inlineCommentStore,
  isBeingPrompted,
  setShouldPrepSlideButton,
  shouldPrepSlideButton,
  textRef,
}: UseEffectPrepareSlideButtonArgs): void {
  const preparingInlineComment = inlineCommentStore.get(
    "preparingInlineComment"
  );
  useEffect(() => {
    if (
      textRef != null &&
      isBeingPrompted &&
      preparingInlineComment.offsetTop == null
    ) {
      const { offsetTop } = textRef.current || { offsetTop: null };
      inlineCommentStore.set("preparingInlineComment")({
        ...preparingInlineComment,
        highlightedText: decoratedText,
        offsetTop,
      });
      setShouldPrepSlideButton(false);
    }
  }, [
    inlineCommentStore,
    isBeingPrompted,
    setShouldPrepSlideButton,
    shouldPrepSlideButton,
    textRef,
  ]);
}

export default function PaperDraftInlineCommentTextWrapWithSlideButton(
  /* Props passed down from draft-js. See documentations for decorators */
  { blockKey, children, contentState, decoratedText, entityKey }
): ReactElement<"span"> {
  const inlineCommentStore = InlineCommentUnduxStore.useStore();
  const paperDraftStore = PaperDraftUnduxStore.useStore();
  const promptedEntityKey = inlineCommentStore.get("promptedEntityKey");
  const displayableInlineComments = inlineCommentStore.get(
    "displayableInlineComments"
  );
  const [shouldPrepSlideButton, setShouldPrepSlideButton] = useState<boolean>(
    true
  );
  const textRef = useRef<HTMLSpanElement>(null);

  const { commentThreadID } = contentState.getEntity(entityKey).getData();
  const isCommentSavedInBackend = commentThreadID != null;
  const isCommentBeingDisplayed = useMemo(
    (): boolean =>
      (displayableInlineComments || []).find(
        (inlineComment: InlineComment): boolean => {
          const {
            commentThreadID: displayedThreadID,
            entityKey: displayedEntityKey,
          } = inlineComment;
          return (
            (commentThreadID != null &&
              displayedThreadID === commentThreadID) ||
            displayedEntityKey === entityKey
          );
        }
      ) != null,
    [displayableInlineComments, entityKey]
  );
  const shouldTextBeHighlighted = useMemo<boolean>(
    (): boolean => isCommentBeingDisplayed || isCommentSavedInBackend,
    [isCommentBeingDisplayed, isCommentSavedInBackend]
  );

  const isBeingPrompted =
    promptedEntityKey === entityKey &&
    !inlineCommentStore.get("silencedPromptKeys").has(entityKey);
  useEffectPrepareSlideButton({
    decoratedText,
    inlineCommentStore,
    isBeingPrompted,
    setShouldPrepSlideButton,
    shouldPrepSlideButton,
    textRef,
  });

  const openCommentThreadDisplay = (event: SyntheticEvent): void => {
    event.preventDefault();
    if (isCommentSavedInBackend) {
      cleanupStoreAndCloseDisplay({
        inlineCommentStore,
      });
      inlineCommentStore.set("displayableInlineComments")(
        getSavedInlineCommentsGivenBlockKeyAndThreadID({
          blockKey,
          commentThreadID,
          editorState: paperDraftStore.get("editorState"),
        })
      );
    }
  };

  return (
    <span
      className={css(
        shouldTextBeHighlighted
          ? styles.commentTextHighLight
          : styles.textNonHighLight,
        isCommentBeingDisplayed ? styles.commentActiveHighlight : null
      )}
      id={
        commentThreadID != null
          ? formatTextWrapID(commentThreadID)
          : formatTextWrapID(entityKey)
      }
      key={`InlineCommentTextWrap-${entityKey}-${commentThreadID}`}
      onClick={openCommentThreadDisplay}
      ref={textRef}
      role="none"
    >
      {children}
    </span>
  );
}

const styles = StyleSheet.create({
  commentActiveHighlight: {
    backgroundColor: "rgb(140 230 180)",
    cursor: "pointer",
  },
  commentTextHighLight: {
    backgroundColor: "rgb(204 243 221)",
    cursor: "pointer",
  },
  popoverBodyStyle: {
    background: "rgb(0,0,0)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: 14,
    padding: "8px 16px",
    borderRadius: 5,
  },
  textNonHighLight: {
    backgroundColor: "transparent",
  },
});
