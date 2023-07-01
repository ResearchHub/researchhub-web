export type Annotation = {
  threadId: string | "new-annotation";
  serialized: SerializedAnchorPosition;
  anchorCoordinates: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  threadCoordinates: {
    x: number;
    y: number;
  };
  xrange: any;
};

export type SerializedAnchorPosition = {
  startContainerPath: string;
  startOffset: number;
  endContainerPath: string;
  endOffset: number;
  collapsed: boolean;
  textContent: string;
  page?: number;
  type: "text";
};

export const createAnnotation = ({
  serializedAnchorPosition,
  xrange,
  relativeEl,
  threadId,
}: {
  xrange: any;
  relativeEl?: any;
  threadId?: string | "new-annotation";
  serializedAnchorPosition?: SerializedAnchorPosition;
}): Annotation => {
  const highlightCoords = xrange.getCoordinates({
    relativeEl: relativeEl,
  });

  return {
    threadId: threadId || "new-annotation",
    serialized: xrange.serialize() || serializedAnchorPosition,
    anchorCoordinates: highlightCoords,
    threadCoordinates: {
      x: 0,
      y: highlightCoords[0].y, // Initial position on first render before adjustment
    },
    xrange,
  };
};

export const parseAnchor = (raw: any): SerializedAnchorPosition => {
  return {
    type: raw.type,
    startContainerPath: raw.position?.startContainerPath,
    startOffset: raw.position?.startOffset,
    endContainerPath: raw.position?.endContainerPath,
    endOffset: raw.position?.endOffset,
    collapsed: raw.position?.collapsed,
    textContent: raw.position?.textContent,
    page: raw.position?.page || null,
  };
};
