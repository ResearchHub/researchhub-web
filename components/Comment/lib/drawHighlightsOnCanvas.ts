import { CommentWithRange, RenderedInlineComment } from "./types";

interface DrawProps {
  commentsWithRange: CommentWithRange[];
  canvasRef: any;
  onRender?: Function;
}

const drawHighlightsOnCanvas = ({
  commentsWithRange,
  canvasRef,
  onRender,
}: DrawProps) => {
  // Clear previous highlights
  const ctx = canvasRef.current.getContext("2d");
  ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const _renderedComments: RenderedInlineComment[] = [];
  commentsWithRange.forEach((commentWithRange) => {
    const { xrange } = commentWithRange;
    const highlightCoords = xrange.getCoordinates({
      relativeEl: canvasRef.current,
    });
    highlightCoords.forEach(({ x, y, width, height }) => {
      ctx.fillRect(x, y, width, height);
    });

    _renderedComments.push({
      xrange,
      anchorCoordinates: highlightCoords,
      comment: commentWithRange.comment,
      commentCoordinates: { x: 0, y: highlightCoords[0].y },
    });
  });

  onRender && onRender(_renderedComments);
};

export default drawHighlightsOnCanvas;
