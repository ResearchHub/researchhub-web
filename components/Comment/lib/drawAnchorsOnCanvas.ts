import { ID } from "~/config/types/root_types";
import { Annotation } from "./types";
import colors from "./colors";

interface DrawProps {
  annotations: Annotation[];
  canvasRef: any;
  selectedThreadId?: ID | null;
}

const drawAnchorsOnCanvas = ({
  annotations,
  canvasRef,
  selectedThreadId,
}: DrawProps): void => {
  // Clear previous highlights
  const ctx = canvasRef.current.getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  annotations.forEach((anchor) => {
    const { anchorCoordinates } = anchor;
    anchorCoordinates.forEach(({ x, y, width, height }) => {
      if (anchor.threadId === selectedThreadId) {
        ctx.fillStyle = colors.annotation.selected;
      } else {
        ctx.fillStyle = colors.annotation.unselected;
      }

      ctx.fillRect(x, y, width, height);
    });
  });
};

export default drawAnchorsOnCanvas;
