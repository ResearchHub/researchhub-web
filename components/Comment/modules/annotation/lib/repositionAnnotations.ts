import { ID } from "~/config/types/root_types";
import { Annotation as AnnotationType } from "./types";

export const resetPositions = ({
  annotationsSortedByY,
}: {
  annotationsSortedByY: AnnotationType[];
}): AnnotationType[] => {
  const nextAnnotationsSortedByY: AnnotationType[] = [];
  for (let i = 0; i < annotationsSortedByY.length; i++) {
    const annotation = { ...annotationsSortedByY[i] };
    const firstAnchorRect = annotation.anchorCoordinates[0];
    annotation.threadCoordinates.x = annotation.threadCoordinates.x;
    annotation.threadCoordinates.y = firstAnchorRect.y;
    nextAnnotationsSortedByY[i] = annotation;
  }

  return nextAnnotationsSortedByY;
};

const repositionAnnotations = ({
  annotationsSortedByY,
  selectedThreadId,
  threadRefs,
}: {
  annotationsSortedByY: AnnotationType[];
  selectedThreadId: ID;
  threadRefs: any[];
}): AnnotationType[] => {
  const INITIAL_X_OFFSET = 0;
  const SELECTED_THREAD_X_OFFSET = 30;
  const MIN_SPACE_BETWEEN_THREAD = 15; // Threads will be at least this distance apart
  const _annotationsSortedByY = [...annotationsSortedByY];
  const repositioned: { [threadId: string]: AnnotationType } = {}; // Keep track of threads that have been repositioned.

  // Reset x position of all threads
  for (let i = 0; i < _annotationsSortedByY.length; i++) {
    if (
      _annotationsSortedByY[i].threadCoordinates.x !== INITIAL_X_OFFSET &&
      _annotationsSortedByY[i].threadId !== selectedThreadId
    ) {
      _annotationsSortedByY[i].threadCoordinates.x = 0;
      repositioned[_annotationsSortedByY[i].threadId] =
        _annotationsSortedByY[i];
    }
  }

  const focalPointIndex = _annotationsSortedByY.findIndex(
    (_annotation) => _annotation.threadId === selectedThreadId
  );

  const focalPoint =
    focalPointIndex >= 0 ? { ..._annotationsSortedByY[focalPointIndex] } : null;

  // If focal point exists, we want to add a constraint that it is positioned right next to its anchor.
  if (focalPoint) {
    _annotationsSortedByY[focalPointIndex].threadCoordinates.y =
      focalPoint.anchorCoordinates[0].y;
    _annotationsSortedByY[focalPointIndex].threadCoordinates.x =
      -SELECTED_THREAD_X_OFFSET;

    repositioned[focalPoint.threadId] = _annotationsSortedByY[focalPointIndex];
  }

  for (let i = focalPointIndex; i >= 0; i--) {
    const annotation = _annotationsSortedByY[i];
    const prevAnnotation = _annotationsSortedByY[i - 1];
    const threadRef = threadRefs[i];
    const prevThreadRef = threadRefs[i - 1];

    if (prevThreadRef?.current && threadRef?.current) {
      const prevRect = prevThreadRef.current.getBoundingClientRect();
      const prevRectBottom =
        prevAnnotation.threadCoordinates.y + prevRect.height;

      if (
        annotation.threadCoordinates.y <
        prevRectBottom + MIN_SPACE_BETWEEN_THREAD
      ) {
        const prevThreadNewPosY =
          annotation.threadCoordinates.y -
          MIN_SPACE_BETWEEN_THREAD -
          prevRect.height;
        if (prevAnnotation.threadCoordinates.y !== prevThreadNewPosY) {
          // console.log(
          //   `Updating [Before] Position of thread ${i - 1} from ${
          //     prevAnnotation.threadCoordinates.y
          //   } to: ${prevThreadNewPosY}`
          // );

          // In addition to keeping track of repositioned, we need to update immediately by modifying current list so that the next iteration
          // has correct value.
          _annotationsSortedByY[i - 1].threadCoordinates.y = prevThreadNewPosY;

          repositioned[prevAnnotation.threadId] = {
            ...prevAnnotation,
            threadCoordinates: {
              ...prevAnnotation.threadCoordinates,
              y: prevThreadNewPosY,
            },
          };
        }
      }
    }
  }

  for (let i = focalPointIndex; i < _annotationsSortedByY.length - 1; i++) {
    const annotation = _annotationsSortedByY[i];
    const nextAnnotation = _annotationsSortedByY[i + 1];
    const threadRef = threadRefs[i];
    const nextThreadRef = threadRefs[i + 1];

    if (nextThreadRef?.current && threadRef?.current) {
      const currentRect = threadRef.current.getBoundingClientRect();
      const nextRectTop = nextAnnotation.threadCoordinates.y;

      if (
        nextRectTop <
        annotation.threadCoordinates.y +
          currentRect.height +
          MIN_SPACE_BETWEEN_THREAD
      ) {
        const nextThreadNewPosY =
          annotation.threadCoordinates.y +
          currentRect.height +
          MIN_SPACE_BETWEEN_THREAD;
        if (nextAnnotation.threadCoordinates.y !== nextThreadNewPosY) {
          // console.log(
          //   `Updating [After] Position of thread ${i + 1} from ${
          //     nextAnnotation.threadCoordinates.y
          //   } to: ${nextThreadNewPosY}`
          // );

          // In addition to keeping track of repositioned, we need to update immediately by modifying current list so that the next iteration
          // has correct value.
          _annotationsSortedByY[i + 1].threadCoordinates.y = nextThreadNewPosY;

          repositioned[nextAnnotation.threadId] = {
            ...nextAnnotation,
            threadCoordinates: {
              ...nextAnnotation.threadCoordinates,
              y: nextThreadNewPosY,
            },
          };
        }
      }
    }
  }

  return Object.values(repositioned);
};

export default repositionAnnotations;
