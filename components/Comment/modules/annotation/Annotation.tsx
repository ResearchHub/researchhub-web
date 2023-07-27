import React, { useEffect, useState } from "react";
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
  const [rects, setRects] = useState(annotation.anchorCoordinates);

  useEffect(() => {
    setRects(annotation.anchorCoordinates);
  }, [annotation]);

  return (
    <>
      {rects.map((rect, i) => {
        if (!rect) return null;

        const fill = color
          ? color
          : focused
          ? colors.annotation.selected
          : colors.annotation.unselected;

        return (
          <svg
            key={`svg-${i}`}
            className={css(styles.annotation)}
            style={{
              position: "absolute",
              top: rect.y,
              left: rect.x,
              width: rect.width,
              height: rect.height,
              borderBottom: focused
                ? "2px solid rgb(234 166 1)"
                : "2px solid rgb(255 212 0)",
              cursor: "pointer",
            }}
          >
            <rect x="0" y="0" width="100%" height="100%" fill={fill} />
          </svg>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  annotation: {
    pointerEvents: "none",
  },
});

export default Annotation;
