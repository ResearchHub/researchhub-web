import { UnrenderedAnnotation, RenderedAnnotation } from "./types";

interface DrawProps {
  unrenderedAnnotations: UnrenderedAnnotation[];
  canvasRef: any;
  onRender?: Function;
}

const drawAnnotationsOnCanvas = ({
  unrenderedAnnotations,
  canvasRef,
  onRender,
}: DrawProps) => {
  // Clear previous highlights
  const ctx = canvasRef.current.getContext("2d");
  ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const _renderedAnnotations: RenderedAnnotation[] = [];
  unrenderedAnnotations.forEach((unrenderedAnnotation) => {
    const { xrange } = unrenderedAnnotation;
    const highlightCoords = xrange.getCoordinates({
      relativeEl: canvasRef.current,
    });
    highlightCoords.forEach(({ x, y, width, height }) => {
      ctx.fillRect(x, y, width, height);
    });

    _renderedAnnotations.push({
      ...unrenderedAnnotation,
      anchorCoordinates: highlightCoords,
      commentCoordinates: { x: 0, y: highlightCoords[0].y },
    });
  });

  onRender && onRender(_renderedAnnotations);
};

export default drawAnnotationsOnCanvas;
