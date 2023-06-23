import { StyleSheet, css } from "aphrodite";
import { createRef, useEffect, useRef, useState } from "react";
import {
  Comment as CommentModel,
  parseComment,
  UnrenderedAnnotation,
  RenderedAnnotation,
  COMMENT_FILTERS,
  COMMENT_TYPES,
} from "./lib/types";
import { createCommentAPI, fetchCommentsAPI } from "./lib/api";
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
import { captureEvent } from "~/config/utils/events";

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
  const [annotationRefs, setAnnotationRefs] = useState<any[]>([]);

  useEffect(() => {
    const _fetch = async () => {
      const { comments: rawComments } = await fetchCommentsAPI({
        documentId: document.id,
        filter: COMMENT_FILTERS.INNER_CONTENT_COMMENT,
        documentType: document.apiDocumentType,
      });
      const comments = rawComments.map((raw) => parseComment({ raw }));
      setInlineComments(comments);
    };

    _fetch();
  }, []);

  // Create a ref for each annotation so that we can observe it for dimension changes
  useEffect(() => {
    setAnnotationRefs((refs) =>
      Array(renderedAnnotations.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef())
    );
  }, [renderedAnnotations]);

  useEffect(() => {
    if (
      (inlineComments.length > 0 || newCommentAnnotation) &&
      canvasDimensions.width > 0 &&
      canvasDimensions.height > 0
    ) {
      _drawAnnotations();
    }
  }, [
    canvasDimensions,
    inlineComments,
    newCommentAnnotation,
    selectedAnnotation,
  ]);

  // The canvas element has no pointer-events because we want the user to be able to select text
  // in the content layer beneath. As a result, we can't detect click events on the canvas so
  // we need to detect click events on the content layer and compare to the canvas highlight coordinates to
  // see if there is a match.
  useEffect(() => {
    const handleClick = (event) => {
      const rect = canvasRef!.current!.getBoundingClientRect();
      const clickedX = event.clientX - rect.left;
      const clickedY = event.clientY - rect.top;

      let highlightClickedOn: RenderedAnnotation | null = null;
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
          highlightClickedOn = highlight;
          continue;
        }
      }

      if (highlightClickedOn) {
        setSelectedAnnotation(highlightClickedOn);
      } else {
        // Clicked outside of any highlight. Let's dismiss current selected.
        setSelectedAnnotation(null);
      }
    };

    const contentEl = relativeRef.current;
    const canvasEl = canvasRef.current;
    if (contentEl && canvasEl) {
      window.addEventListener("click", handleClick);
    }

    return () => {
      if (contentEl && canvasEl) {
        window.removeEventListener("click", handleClick);
      }
    };
  }, [relativeRef, canvasRef, renderedAnnotations]);

  const _sortAnnotations = (annotations: RenderedAnnotation[]) => {
    console.log("Sorting annotations:", annotations);

    const sorted = annotations.sort((a, b) => {
      const aY = a.anchorCoordinates[a.anchorCoordinates.length - 1].y;
      const bY = b.anchorCoordinates[b.anchorCoordinates.length - 1].y;
      return aY - bY;
    });

    console.log("Sorting results:", sorted);
    return sorted;
  };

  const _calcCommentPositions = () => {
    const _renderedAnnotations = _sortAnnotations(renderedAnnotations);

    const _udpatedRenderedAnnotations: Array<RenderedAnnotation> = [];
    let hasChanged = false;
    for (let i = 0; i < _renderedAnnotations.length; i++) {
      const prevRef = annotationRefs[i - 1];
      const currentRef = annotationRefs[i];
      const prevAnnotation = _renderedAnnotations[i - 1];
      const currentAnnotation = { ..._renderedAnnotations[i] };

      if (prevRef?.current && currentRef?.current) {
        const prevRect = prevRef.current.getBoundingClientRect();
        const currentRect = currentRef.current.getBoundingClientRect();
        const prevRectBottom =
          prevAnnotation.commentCoordinates.y + prevRect.height;

        if (prevRectBottom > currentAnnotation.commentCoordinates.y) {
          const newPosY = prevRectBottom + 10;
          if (newPosY !== currentAnnotation.commentCoordinates.y) {
            currentAnnotation.commentCoordinates.y = newPosY;
            hasChanged = true; // A change occurred
            console.log(
              "hasChanged",
              hasChanged,
              "newPosY",
              newPosY,
              "prevRectBottom",
              prevRectBottom,
              "currentAnnotation.commentCoordinates.y",
              currentAnnotation.commentCoordinates.y
            );
          }
        }
      }

      if (
        currentAnnotation &&
        selectedAnnotation?.comment?.id === currentAnnotation?.comment?.id
      ) {
        if (currentAnnotation.commentCoordinates.x !== -30) {
          currentAnnotation.commentCoordinates.x = -30;
          hasChanged = true; // A change occurred
        }
      }

      _udpatedRenderedAnnotations.push(currentAnnotation);
    }

    if (hasChanged) {
      setRenderedAnnotations(_udpatedRenderedAnnotations);
    }
  };

  useEffect(() => {
    // Create a new ResizeObserver that will update your layout or state
    const resizeObserver = new ResizeObserver((entries) => {
      // Iterate over all entries
      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        console.log("Element:", entry.target, "Size", {
          height: rect.height,
          width: rect.width,
        });

        // Here you can trigger a re-render or update some state as needed
        _calcCommentPositions();
      }
    });

    // Observe each comment
    annotationRefs.forEach((ref) => {
      if (ref.current) {
        resizeObserver.observe(ref.current);
      }
    });

    // Clean up by unobserving all elements when the component unmounts
    return () => {
      annotationRefs.forEach((ref) => {
        if (ref.current) {
          resizeObserver.unobserve(ref.current);
        }
      });
    };
  }, [annotationRefs]); // Re-run effect when commentRefs changes

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
    console.log("Drawing annotations...");
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
      selectedAnnotation,
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
                ref={annotationRefs[idx]}
                style={{
                  position: "absolute",
                  background: annotation.isNew ? "none" : "white",
                  padding: 10,
                  border: annotation.isNew
                    ? "none"
                    : `1px solid ${colors.border}`,
                  left: annotation.commentCoordinates.x,
                  top: annotation.commentCoordinates.y,
                  width: config.annotations.commentWidth,
                }}
                key={`annotation-${idx}`}
              >
                {annotation.comment && (
                  <Comment document={document} comment={annotation!.comment} />
                )}
                {annotation.isNew && (
                  <CommentEditor
                    editorId="new-inline-comment"
                    handleSubmit={async (props) => {
                      try {
                        const comment = await createCommentAPI({
                          ...props,
                          documentId: document.id,
                          documentType: document.apiDocumentType,
                          commentType: COMMENT_TYPES.INNER_CONTENT_COMMENT,
                          anchor: {
                            type: "text",
                            position: annotation.xrange!.serialize(),
                          },
                        });

                        setNewCommentAnnotation(null);
                        setInlineComments([...inlineComments, comment]);
                      } catch (error) {
                        captureEvent({
                          msg: "Failed to create inline comment",
                          data: {
                            document,
                            error,
                            position: annotation.xrange!.serialize(),
                          },
                        });
                      }
                    }}
                  />
                )}
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
