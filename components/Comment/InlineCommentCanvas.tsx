import { StyleSheet, css } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import { Comment, parseComment } from "./lib/types";
import { fetchInlineCommentsAPI } from "./lib/api";
import { GenericDocument } from "../Document/lib/types";
import XRange from "./lib/xrange/XRange";
import { isEmpty } from "~/config/utils/nullchecks";
import { createPortal } from "react-dom";
interface Props {
  relativeRef: any; // Canvas will be rendered relative to this element
  document: GenericDocument;
}

export type CommentWithRange = {
  comment: Comment;
  xrange: any | null;
};

export type RenderedComment = {
  comment: Comment;
  xrange: any;
  anchorCoordinates: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  commentCoordinates: { x: number; y: number };
};

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

  const _renderedComments: RenderedComment[] = [];
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

const InlineCommentCanvas = ({ relativeRef, document }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inlineComments, setInlineComments] = useState<Comment[]>([]);
  const [renderedComments, setRenderedComments] = useState<RenderedComment[]>(
    []
  );
  const [canvasDimensions, setCanvasDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [selectedInlineComment, setSelectedInlineComment] =
    useState<RenderedComment | null>(null);

  useEffect(() => {
    const _fetch = async () => {
      const { comments: rawComments } = await fetchInlineCommentsAPI({
        documentId: document.id,
        documentType: document.apiDocumentType,
      });
      const comments = rawComments.map((raw) => parseComment({ raw }));
      setInlineComments(comments);
    };

    _fetch();
  }, []);

  const _drawHighlights = () => {
    const commentsWithRanges = inlineComments
      .map((comment): CommentWithRange => {
        const _xrange =
          XRange.createFromSerialized(comment.anchor?.position) || null;
        return { comment: { ...comment }, xrange: _xrange };
      })
      .filter((c) => !isEmpty(c.xrange));

    drawHighlightsOnCanvas({
      commentsWithRange: commentsWithRanges,
      canvasRef,
      onRender: setRenderedComments,
    });
  };

  useEffect(() => {
    if (
      inlineComments.length > 0 &&
      canvasDimensions.width > 0 &&
      canvasDimensions.height > 0
    ) {
      _drawHighlights();
    }
  }, [canvasDimensions, inlineComments]);

  // The canvas element has no pointer-events because we want the user to be able to select text
  // in the content layer beneath. As a result, we can't detect click events on the canvas so
  // we need to detect click events on the content layer and compare to the canvas highlight coordinates to
  // see if there is a match.
  useEffect(() => {
    const handleCanvasClick = (event) => {
      const rect = canvasRef!.current!.getBoundingClientRect();
      const clickedX = event.clientX - rect.left;
      const clickedY = event.clientY - rect.top;

      for (let i = 0; i < renderedComments.length; i++) {
        const highlight = renderedComments[i];

        const isClickWithinHighlight = highlight.anchorCoordinates.some(
          ({ x, y, width, height }) => {
            return (
              clickedX >= x &&
              clickedX <= x + width &&
              clickedY >= y &&
              clickedY <= y + height
            );
          }
        );

        if (isClickWithinHighlight) {
          setSelectedInlineComment(renderedComments[i]);
        }
      }
    };

    const contentEl = relativeRef.current;
    const canvasEl = canvasRef.current;
    if (contentEl && canvasEl) {
      contentEl.addEventListener("click", handleCanvasClick);
    }

    return () => {
      if (contentEl && canvasEl) {
        contentEl.removeEventListener("click", handleCanvasClick);
      }
    };
  }, [relativeRef, canvasRef, renderedComments]);

  // Observe content dimension changes (relativeEl) so that we can resize the canvas accordingly
  // and redraw the highlights in the correct position.
  useEffect(() => {
    if (canvasRef.current && relativeRef.current) {
      const observer = new ResizeObserver(() => {
        canvasRef!.current!.width = relativeRef.current.offsetWidth;
        canvasRef!.current!.height = relativeRef.current.offsetHeight;
        setCanvasDimensions({
          width: canvasRef!.current!.width,
          height: canvasRef!.current!.height,
        });
      });

      observer.observe(relativeRef.current);

      return () => observer.disconnect();
    }
  }, [relativeRef, canvasRef]);

  return (
    <div>
      {renderedComments.length > 0 && (
        <div
          className={css(styles.commentSidebar)}
          style={{ position: "absolute", right: -510, top: 0, width: 500 }}
        >
          {renderedComments.map((_rc) => (
            <div
              style={{
                position: "absolute",
                backgroundColor: "red",
                left: _rc.commentCoordinates.x,
                top: _rc.commentCoordinates.y,
              }}
              key={_rc.comment.id}
            >
              This is a test
            </div>
          ))}
        </div>
      )}
      <canvas ref={canvasRef} id="overlay" className={css(styles.canvas)} />
    </div>
  );
};

const styles = StyleSheet.create({
  canvas: {
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0,
  },
  commentSidebar: {},
});

export default InlineCommentCanvas;
