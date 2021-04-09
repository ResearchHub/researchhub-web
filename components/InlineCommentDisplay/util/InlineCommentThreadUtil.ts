import { SyntheticEvent } from "react";
import { ID } from "../../PaperDraftInlineComment/undux/InlineCommentUnduxStore";

type GetTargetDraftEntityElArgs = {
  commentThreadID: ID;
  entityKey: ID;
};
type ScrollToTargetElFncArgs = {
  onSuccess: () => void;
  targetElement: HTMLElement | null;
};
type ScrollToTargetElFncReturn = (event: SyntheticEvent) => void;

function isElemntWithinViewPort(element: HTMLElement): boolean {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= document.documentElement.clientHeight
  );
}

export function getTargetInlineDraftEntityEl({
  commentThreadID,
  entityKey,
}): HTMLElement | null {
  let entityEl = document.getElementById(`inline-comment-${commentThreadID}`);
  if (entityEl == null) {
    entityEl = document.getElementById(`inline-comment-${entityKey}`);
  }
  return entityEl;
}

export const getScrollToTargetElFnc = ({
  onSuccess,
  targetElement,
}: ScrollToTargetElFncArgs): ScrollToTargetElFncReturn => (
  event: SyntheticEvent
): void => {
  event.stopPropagation();
  if (targetElement != null && !isElemntWithinViewPort(targetElement)) {
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    onSuccess();
  }
};
