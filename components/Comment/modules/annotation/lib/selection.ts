import { Selection } from "./useSelection";
import { genClientId } from "~/config/utils/id";
import XRange from "./xrange/XRange";
import { Annotation, SerializedAnchorPosition } from "./types";

export const isSelectionInsideElement = ({ element, selection }) => {
  try {
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return element.contains(range.commonAncestorContainer);
    }
  } catch (error) {}
  return false;
};

export const getSelectedNodes = ({ selection }) => {
  const fragment = document.createDocumentFragment();
  const nodeList = [];

  for (let i = 0; i < selection.rangeCount; i++) {
    fragment.append(selection.getRangeAt(i).cloneContents());
  }

  const walker = document.createTreeWalker(fragment);
  let currentNode = walker.currentNode;

  while (currentNode) {
    // @ts-ignore
    nodeList.push(currentNode);
    // @ts-ignore
    currentNode = walker.nextNode();
  }

  return nodeList;
};

export const selectionContainsDisallowedElements = ({
  selection,
  disallowedTags,
}) => {
  const selectedNodes = getSelectedNodes({ selection });

  let isDisallowedSelected = false;
  selectedNodes.forEach((node) => {
    // @ts-ignore
    if (node.nodeName && disallowedTags.includes(node.nodeName.toLowerCase())) {
      isDisallowedSelected = true;
    }
  });

  return isDisallowedSelected;
};

export const annotationToSerializedAnchorPosition = ({
  annotation,
  ignoreXPathPrefix,
}: {
  annotation: Annotation;
  ignoreXPathPrefix: string;
}): SerializedAnchorPosition => {
  const serializedXrange = annotation.xrange.serialize({ ignoreXPathPrefix });

  return {
    startContainerPath: serializedXrange.startContainerPath,
    startOffset: serializedXrange.startOffset,
    endContainerPath: serializedXrange.endContainerPath,
    endOffset: serializedXrange.endOffset,
    collapsed: serializedXrange.collapsed,
    text: annotation.serialized.text,
    pageNumber: annotation.serialized.pageNumber,
    type: "text",
  };
};

export const selectionToSerializedAnchorPosition = ({
  selection,
  ignoreXPathPrefix,
}: {
  selection: Selection;
  ignoreXPathPrefix: string;
}): SerializedAnchorPosition => {
  const serializedXrange = selection.xrange.serialize({ ignoreXPathPrefix });

  return {
    startContainerPath: serializedXrange.startContainerPath,
    startOffset: serializedXrange.startOffset,
    endContainerPath: serializedXrange.endContainerPath,
    endOffset: serializedXrange.endOffset,
    collapsed: serializedXrange.collapsed,
    text: selection.xrange.textContent(),
    pageNumber: selection.pageNumber,
    type: "text",
  };
};

export const urlSelectionToAnnotation = ({
  urlSelection,
  ignoreXPathPrefix,
  relativeEl,
}: {
  urlSelection: any;
  ignoreXPathPrefix: string;
  relativeEl: any;
}): Annotation => {
  const serializedSelection = JSON.parse(decodeURIComponent(urlSelection));

  const xrange = XRange.createFromSerialized({
    serialized: serializedSelection,
    xpathPrefix: ignoreXPathPrefix,
  });

  if (!xrange) {
    throw "Could not create XRange from serialized URL";
  }

  const serializedXrange = xrange.serialize({
    ignoreXPathPrefix,
  });

  const annotation = createAnnotation({
    xrange,
    threadId: "position-from-url",
    relativeEl,
    serializedAnchorPosition: {
      ...serializedXrange,
      text: xrange.textContent(),
      pageNumber: serializedSelection.pageNumber,
    },
  });

  return annotation;
};

export const createAnnotation = ({
  serializedAnchorPosition,
  relativeEl,
  threadId,
  isNew = false,
  xrange,
}: {
  isNew?: boolean;
  relativeEl?: any;
  threadId?: string;
  serializedAnchorPosition: SerializedAnchorPosition;
  xrange: any;
}): Annotation => {
  const highlightCoords = xrange.getCoordinates({
    relativeEl,
  });

  return {
    threadId: threadId ?? `new-annotation-${genClientId()}`,
    serialized: serializedAnchorPosition,
    anchorCoordinates: highlightCoords,
    isNew,
    threadCoordinates: {
      x: 0,
      y: highlightCoords[0].y, // Initial position on first render before adjustment
    },
    xrange,
  };
};
