import React, { createRef, useEffect, useState } from "react";
import { Annotation as AnnotationType } from "./lib/types";
import colors from "../../lib/colors";

const Annotation = ({
  annotation,
  focused,
  handleClick,
}: {
  annotation: AnnotationType;
  focused: boolean;
  handleClick: Function;
}) => {
  const [canvasRefs, setCanvasRefs] = useState<any[]>([]);

  useEffect(() => {
    const refs = annotation.anchorCoordinates.map(() =>
      createRef<HTMLCanvasElement>()
    );
    setCanvasRefs(refs);
  }, []);

  useEffect(() => {
    canvasRefs.forEach((canvasRef, i) => {
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        const { anchorCoordinates } = annotation;
        const { x, y, width, height } = anchorCoordinates[i];
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (focused) {
          ctx.fillStyle = colors.annotation.selected;
        } else {
          ctx.fillStyle = colors.annotation.unselected;
        }

        ctx.fillRect(0, 0, width, height);
      }
    });
  }, [canvasRefs, focused]);

  return (
    <>
      {canvasRefs.map((canvasRef, i) => (
        <canvas
          onClick={() => handleClick(annotation.threadId)}
          ref={canvasRef}
          style={{
            position: "absolute",
            top: annotation.anchorCoordinates[i].y,
            left: annotation.anchorCoordinates[i].x,
          }}
        />
      ))}
    </>
  );
};

export default Annotation;
