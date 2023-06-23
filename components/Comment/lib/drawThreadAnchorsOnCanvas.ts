import { UnrenderedAnnotationThread, RenderedAnnotationThread } from "./types";

interface DrawProps {
  unrenderedAnnotationThreads: UnrenderedAnnotationThread[];
  canvasRef: any;
  onRender?: Function;
  selectedAnnotationThread?: RenderedAnnotationThread | null;
}

const drawThreadAnchorsOnCanvas = ({
  unrenderedAnnotationThreads,
  canvasRef,
  onRender,
  selectedAnnotationThread,
}: DrawProps): void => {
  // Clear previous highlights
  const ctx = canvasRef.current.getContext("2d");
  // ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const _renderedAnnotationThreads: RenderedAnnotationThread[] = [];
  unrenderedAnnotationThreads.forEach((unrenderedAnnotationThread) => {
    const { xrange } = unrenderedAnnotationThread;
    const highlightCoords = xrange.getCoordinates({
      relativeEl: canvasRef.current,
    });
    highlightCoords.forEach(({ x, y, width, height }) => {
      if (
        selectedAnnotationThread &&
        selectedAnnotationThread.commentThread?.id ===
          unrenderedAnnotationThread?.commentThread?.id
      ) {
        ctx.fillStyle = "rgb(252, 187, 41, 0.5)";
      } else {
        ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
      }

      ctx.fillRect(x, y, width, height);
    });

    _renderedAnnotationThreads.push({
      ...unrenderedAnnotationThread,
      anchorCoordinates: highlightCoords,
      threadCoordinates: { x: 0, y: highlightCoords[0].y },
    });
  });

  onRender && onRender(_renderedAnnotationThreads);
};

export default drawThreadAnchorsOnCanvas;
