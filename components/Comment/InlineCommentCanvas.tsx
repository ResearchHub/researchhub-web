import { StyleSheet, css } from "aphrodite";
import { useEffect, useRef, useState } from "react";
import {
  Comment as CommentModel,
  parseComment,
  UnrenderedAnnotation,
  RenderedAnnotation,
} from "./lib/types";
import { fetchInlineCommentsAPI } from "./lib/api";
import { GenericDocument } from "../Document/lib/types";
import XRange from "./lib/xrange/XRange";
import { isEmpty } from "~/config/utils/nullchecks";
import Comment from "./Comment";
import colors from "./lib/colors";
import drawAnnotationsOnCanvas from "./lib/drawAnnotationsOnCanvas";
import TextSelectionMenu from "./TextSelectionMenu";
import useSelection from "~/components/Comment/hooks/useSelection";
import config from "./lib/config";
import CommentEditor from "./CommentEditor";

interface Props {
  relativeRef: any; // Canvas will be rendered relative to this element
  document: GenericDocument;
}

const InlineCommentCanvas = ({ relativeRef, document }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inlineComments, setInlineComments] = useState<CommentModel[]>([]);
  const [renderedAnnotations, setRenderedAnnotations] = useState<
    RenderedAnnotation[]
  >([]);
  const [canvasDimensions, setCanvasDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [selectedAnnotation, setSelectedAnnotation] =
    useState<RenderedAnnotation | null>(null);
  const { selectionXRange, initialSelectionPosition } = useSelection({
    ref: relativeRef,
  });
  const [newCommentAnnotation, setNewCommentAnnotation] =
    useState<UnrenderedAnnotation | null>(null);

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

  useEffect(() => {
    if (
      (inlineComments.length > 0 || newCommentAnnotation)  &&
      canvasDimensions.width > 0 &&
      canvasDimensions.height > 0
    ) {
      _drawAnnotations();
    }
  }, [canvasDimensions, inlineComments, newCommentAnnotation]);

  // The canvas element has no pointer-events because we want the user to be able to select text
  // in the content layer beneath. As a result, we can't detect click events on the canvas so
  // we need to detect click events on the content layer and compare to the canvas highlight coordinates to
  // see if there is a match.
  useEffect(() => {
    const handleCanvasClick = (event) => {
      const rect = canvasRef!.current!.getBoundingClientRect();
      const clickedX = event.clientX - rect.left;
      const clickedY = event.clientY - rect.top;

      for (let i = 0; i < renderedAnnotations.length; i++) {
        const highlight = renderedAnnotations[i];

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
          setSelectedAnnotation(renderedAnnotations[i]);
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
  }, [relativeRef, canvasRef, renderedAnnotations]);

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

  const _calcTextSelectionMenuPos = () => {
    if (!relativeRef.current) return { x: 0, y: 0 };

    const containerElemOffset =
      window.scrollY + relativeRef.current.getBoundingClientRect().y;
    return {
      x: 0 - config.textSelectionMenu.width / 2,
      y:
        window.scrollY -
        containerElemOffset +
        (initialSelectionPosition?.y || 0),
    };
  };

  const _drawAnnotations = () => {
    console.log('drawing highlights')
    const unrenderedAnnotations = inlineComments
      .map((comment): UnrenderedAnnotation => {
        const _xrange =
          XRange.createFromSerialized(comment.anchor?.position) || null;
        return { comment: { ...comment }, xrange: _xrange };
      })
      .filter((c) => !isEmpty(c.xrange));

    if (newCommentAnnotation) {
      unrenderedAnnotations.push(newCommentAnnotation);
    }

    drawAnnotationsOnCanvas({
      unrenderedAnnotations,
      canvasRef,
      onRender: setRenderedAnnotations,
    });
  };

  const _displayCommentEditor = () => {
    if (!selectionXRange) {
      return console.error("No selected range. This should not happen.");
    }

    setNewCommentAnnotation({
      isNew: true,
      xrange: selectionXRange,
    });
  };

  const { x: menuPosX, y: menuPosY } = _calcTextSelectionMenuPos();
  const showSelectionMenu = selectionXRange && initialSelectionPosition;
  return (
    <div>
      {showSelectionMenu && (
        <div
          id="textSelectionMenu"
          style={{
            position: "absolute",
            top: menuPosY,
            right: menuPosX,
            width: 50,
            zIndex: 5,
            height: config.textSelectionMenu.height,
          }}
        >
          <TextSelectionMenu
            onCommentClick={_displayCommentEditor}
            onLinkClick={undefined}
          />
        </div>
      )}
      {renderedAnnotations.length > 0 && (
        <div
          className={css(styles.commentSidebar)}
          style={{ position: "absolute", right: -510, top: 0, width: 500 }}
        >
          {renderedAnnotations.map((annotation, idx) => {
            return (
              <div
                style={{
                  position: "absolute",
                  background: "white",
                  padding: 10,
                  border: `1px solid ${colors.border}`,
                  left: annotation.commentCoordinates.x,
                  top: annotation.commentCoordinates.y,
                }}
                key={`annotation-${idx}`}
              >
                {annotation.comment && (
                  <Comment document={document} comment={annotation!.comment} />
                )}
                {annotation.isNew && <CommentEditor editorId="new-inline-comment" handleSubmit={() => null} />}
              </div>
            );
          })}
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
