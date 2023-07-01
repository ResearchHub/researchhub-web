import { ID } from "~/config/types/root_types";
import { Annotation as AnnotationType } from "./types";

const repositionAnnotations = ({
  annotationsSortedByY,
  selectedThreadId,
  threadRefs,
}: {
  annotationsSortedByY: AnnotationType[];
  selectedThreadId: ID;
  threadRefs: any[];
}): AnnotationType[] => {
  const SELECTED_THREAD_X_OFFSET = 30;
  const MIN_SPACE_BETWEEN_THREAD = 15; // Threads will be at least this distance apart

  const focalPointIndex = annotationsSortedByY.findIndex(
    (pos) =>
      pos.threadId === selectedThreadId || pos.threadId === "new-annotation"
  );

  const repositioned: Array<AnnotationType> = []; // Keep track of threads that have been repositioned.
  const beforeFocalPoint = annotationsSortedByY.slice(0, focalPointIndex);
  const focalPoint =
    focalPointIndex >= 0 ? { ...annotationsSortedByY[focalPointIndex] } : null;

  // If focal point exists, we want to add a constraint that it is positioned right next to its anchor.
  if (focalPoint) {
    focalPoint.threadCoordinates.y = focalPoint.anchorCoordinates[0].y;
    focalPoint.threadCoordinates.x = -SELECTED_THREAD_X_OFFSET;
  }

  const afterFocalPoint = annotationsSortedByY.slice(focalPointIndex + 1);
  const focalPointAndBefore = [...beforeFocalPoint].concat(
    focalPoint ? [focalPoint] : []
  );
  for (let i = focalPointAndBefore.length - 1; i >= 0; i--) {
    const annotation = focalPointAndBefore[i];
    const prevAnnotation = focalPointAndBefore[i - 1];
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
          // console.log('Current annotation:', annotation.serialized.textContent)
          // console.log('Prev annotation:', prevAnnotation.serialized.textContent)
          console.log(
            `Updating [Before] Position of thread ${i - 1} from ${
              prevAnnotation.threadCoordinates.y
            } to: ${prevThreadNewPosY}`
          );

          // In addition to keeping track of repositioned, we need to update immediately by modifying current list so that the next iteration
          // has correct value.
          focalPointAndBefore[i - 1].threadCoordinates.y = prevThreadNewPosY;
          focalPointAndBefore[i - 1].threadCoordinates.x = 0;

          repositioned.push({
            ...prevAnnotation,
            threadCoordinates: {
              ...prevAnnotation.threadCoordinates,
              y: prevThreadNewPosY,
            },
          });
        }
      }
    }
  }

  const focalPointAndAfter = (focalPoint ? [focalPoint] : []).concat([
    ...afterFocalPoint,
  ]);
  for (let i = 0; i < focalPointAndAfter.length - 1; i++) {
    const annotation = focalPointAndAfter[i];
    const nextAnnotation = focalPointAndAfter[i + 1];
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
          // console.log("annotation.threadCoordinates.y", annotation.threadCoordinates.y)
          // console.log('nextRectTop', nextRectTop)
          // console.log("currentRect.height", currentRect.height)
          // console.log("MIN_SPACE_BETWEEN_THREAD", MIN_SPACE_BETWEEN_THREAD)
          // console.log(
          //   `Updating [After] Position of thread from ${nextAnnotation.threadCoordinates.y} to: ${nextThreadNewPosY}`
          // );

          // In addition to keeping track of repositioned, we need to update immediately by modifying current list so that the next iteration
          // has correct value.
          focalPointAndAfter[i + 1].threadCoordinates.y = nextThreadNewPosY;
          focalPointAndAfter[i + 1].threadCoordinates.x = 0;

          repositioned.push({
            ...nextAnnotation,
            threadCoordinates: {
              ...nextAnnotation.threadCoordinates,
              y: nextThreadNewPosY,
            },
          });
        }
      }
    }
  }

  return repositioned;
};

export default repositionAnnotations;
