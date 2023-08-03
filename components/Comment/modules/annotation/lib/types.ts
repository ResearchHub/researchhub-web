export type Annotation = {
  threadId: string | "new-annotation";
  serialized: SerializedAnchorPosition;
  isNew: boolean;
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
  text: string;
  pageNumber: number;
  type: "text";
};

export const parseAnchor = (raw: any): SerializedAnchorPosition => {
  return {
    type: raw.type,
    startContainerPath: raw.position?.startContainerPath,
    startOffset: raw.position?.startOffset,
    endContainerPath: raw.position?.endContainerPath,
    endOffset: raw.position?.endOffset,
    collapsed: raw.position?.collapsed,
    text: raw.position?.text,
    pageNumber: raw.position?.pageNumber || 0,
  };
};
