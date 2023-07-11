import React, { createRef, useEffect, useState } from "react";
import { Annotation as AnnotationType } from "./lib/types";
import colors from "../../lib/colors";
import { StyleSheet, css } from "aphrodite";

const Annotation = ({
  annotation,
  focused,
  color,
}: {
  annotation: AnnotationType;
  focused: boolean;
  color?: string;
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

        if (color) {
          ctx.fillStyle = color;
        } else if (focused) {
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
          ref={canvasRef}
          className={css(styles.annotation)}
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

const styles = StyleSheet.create({
  annotation: {
    pointerEvents: "none",
  },
});

export default Annotation;
