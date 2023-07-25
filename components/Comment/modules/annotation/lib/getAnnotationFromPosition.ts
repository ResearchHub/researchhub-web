import { Annotation as AnnotationType } from "./types";

const getAnnotationFromPosition = ({
  x,
  y,
  contentRef,
  annotations,
}: {
  x: number;
  y: number;
  contentRef: any;
  annotations: AnnotationType[];
}): AnnotationType | null => {
  const contentRefRect = contentRef!.current!.getBoundingClientRect();
  const relativeClickX = x - contentRefRect.left;
  const relativeClickY = y - contentRefRect.top;

  for (let i = 0; i < annotations.length; i++) {
    const { anchorCoordinates } = annotations[i];
    const isWithinBounds = anchorCoordinates.some(({ x, y, width, height }) => {
      return (
        relativeClickX >= x &&
        relativeClickX <= x + width &&
        relativeClickY >= y &&
        relativeClickY >= y &&
        relativeClickY <= y + height
      );
    });

    if (isWithinBounds) {
      return annotations[i];
    }
  }

  return null;
};

export default getAnnotationFromPosition;
