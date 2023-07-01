import { StyleSheet, css } from "aphrodite";
import React, { createRef, useEffect, useRef, useState } from "react";
import {
  Comment as CommentModel,
  parseComment,
  COMMENT_FILTERS,
  COMMENT_TYPES,
  COMMENT_CONTEXTS,
} from "../../lib/types";
import { createAnnotation, Annotation as AnnotationType } from "./lib/types";

import { createCommentAPI, fetchCommentsAPI } from "../../lib/api";
import { GenericDocument } from "../../../Document/lib/types";
import XRange from "../../lib/xrange/XRange";
import colors from "../../lib/colors";
import TextSelectionMenu from "../../TextSelectionMenu";
import useSelection from "~/components/Comment/hooks/useSelection";
import config, { contextConfig } from "../../lib/config";
import CommentEditor from "../../CommentEditor";
import { captureEvent } from "~/config/utils/events";
import { CommentTreeContext } from "../../lib/contexts";
import { sortOpts } from "../../lib/options";
import CommentAnnotationThread from "../../CommentAnnotationThread";
import groupBy from "lodash/groupBy";
import { ID } from "~/config/types/root_types";
import Annotation from "./Annotation";
import repositionAnnotations from "./lib/repositionAnnotations";

interface Props {
  relativeRef: any; // Canvas will be rendered relative to this element
  document: GenericDocument;
}

const AnnotationCanvas = ({ relativeRef, document: doc }: Props) => {
  const [inlineComments, setInlineComments] = useState<CommentModel[]>([]);

  // Anchors (e.g. highlights) will be rendered on top of this canvas
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sorted List of annotations sorted by order of appearance on the page
  const [annotationsSortedByY, setAnnotationsSortedByY] = useState<
    AnnotationType[]
  >([]);

  const prevAnnotationsSortedByY = useRef(annotationsSortedByY);

  // Orphans are annotations that could not be found on page
  const [orphanThreadIds, setOrphanThreadIds] = useState<ID[]>([]);

  // The XRange position of the selected text. Holds the serialized DOM position.
  const { selectionXRange, initialSelectionPosition } = useSelection({
    ref: relativeRef,
  });

  const [newAnnotation, setNewAnnotation] = useState<AnnotationType | null>(
    null
  );
  const [selectedThreadId, setSelectedThreadId] = useState<
    ID | "new-annotation" | null
  >(null);
  // const [canvasDimensions, setCanvasDimensions] = useState<{
  //   width: number;
  //   height: number;
  // }>({ width: 0, height: 0 });
  const newThreadRef = useRef<any | null>(null);
  const [threadRefs, setThreadRefs] = useState<any[]>([]);
  const commentThreads = useRef<{ [key: string]: Array<CommentModel> }>({});

  // Fetch comments from API
  useEffect(() => {
    const _fetch = async () => {
      const { comments: rawComments } = await fetchCommentsAPI({
        documentId: doc.id,
        filter: COMMENT_FILTERS.ANNOTATION,
        documentType: doc.apiDocumentType,
      });
      const comments = rawComments.map((raw) => parseComment({ raw }));
      setInlineComments(comments);
    };

    _fetch();
  }, []);

  useEffect(() => {
    commentThreads.current = groupBy(inlineComments, (c: CommentModel) =>
      String(c.thread.id)
    );

    createAndSortAnnotations({
      threadIdsToDraw: Object.keys(commentThreads.current),
    });
  }, [inlineComments]);

  // Draw anchors on canvas once canvas is ready
  // useEffect(() => {
  //   if (
  //     (inlineComments.length > 0 || newAnnotation) &&
  //     canvasDimensions.width > 0 &&
  //     canvasDimensions.height > 0
  //   ) {
  //     _drawAnchors({ threadIdsToDraw: Object.keys(commentThreads.current) });
  //   }
  // }, [canvasDimensions, inlineComments, newAnnotation]);

  // Draw anchors on canvas once canvas is ready
  // useEffect(() => {
  //   if (selectedThreadId) {
  //     _drawAnchors({ threadIdsToDraw: [selectedThreadId] });
  //   }
  // }, [selectedThreadId]);

  // Observe dimension changes for each of the threads.
  // If position has changed, recalculate.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const repositioned = repositionAnnotations({
        annotationsSortedByY: annotationsSortedByY,
        selectedThreadId,
        threadRefs,
      });

      replaceAnnotations({ annotationsToReplace: repositioned });
    });

    threadRefs.forEach((t) => {
      console.log("setting up observer");
      if (t.current) {
        resizeObserver.observe(t.current);
      }
    });

    return () => {
      threadRefs.forEach((t) => {
        if (t.current) {
          resizeObserver.unobserve(t.current);
        }
      });
    };
  }, [threadRefs]);

  useEffect(() => {
    if (selectedThreadId) {
      const repositioned = repositionAnnotations({
        annotationsSortedByY: annotationsSortedByY,
        selectedThreadId,
        threadRefs,
      });

      replaceAnnotations({ annotationsToReplace: repositioned });
    }
  }, [selectedThreadId]);

  useEffect(() => {
    if (
      annotationsSortedByY.length !== prevAnnotationsSortedByY?.current?.length
    ) {
      prevAnnotationsSortedByY.current = annotationsSortedByY;

      setThreadRefs((refs) =>
        Array(annotationsSortedByY.length)
          .fill(null)
          .map((_, i) => refs[i] || createRef())
      );
    }
  }, [annotationsSortedByY.length]);

  // Set up click events.
  // The canvas element has no pointer-events because we want the user to be able to select text
  // in the content layer beneath. As a result, we can't detect click events on the canvas so
  // we need to detect click events on the content layer and compare to the canvas highlight coordinates to
  // see if there is a match.
  // useEffect(() => {
  //   const handleClick = (event): void => {
  //     const rect = canvasRef!.current!.getBoundingClientRect();
  //     const clickedX = event.clientX - rect.left;
  //     const clickedY = event.clientY - rect.top;

  //     let selectedAnnotation: Annotation | null = null;
  //     for (let i = 0; i < annotationsSortedByY.length; i++) {
  //       const { anchorCoordinates } = annotationsSortedByY[i];

  //       const isAnchorClicked = anchorCoordinates.some(
  //         ({ x, y, width, height }) => {
  //           return (
  //             clickedX >= x &&
  //             clickedX <= x + width &&
  //             clickedY >= y &&
  //             clickedY <= y + height
  //           );
  //         }
  //       );

  //       if (isAnchorClicked) {
  //         selectedAnnotation = annotationsSortedByY[i];
  //         continue;
  //       }
  //     }

  //     if (selectedAnnotation) {
  //       setSelectedThreadId(selectedAnnotation.threadId);
  //     } else {
  //       // Selected dismissed.
  //       setSelectedThreadId(null);
  //     }
  //   };

  //   const contentEl = relativeRef.current;
  //   const canvasEl = canvasRef.current;
  //   if (contentEl && canvasEl) {
  //     window.addEventListener("click", handleClick);
  //   }

  //   return () => {
  //     if (contentEl && canvasEl) {
  //       window.removeEventListener("click", handleClick);
  //     }
  //   };
  // }, [relativeRef, canvasRef, annotationsSortedByY]);

  // Observe content dimension changes (relativeEl) so that we can resize the canvas accordingly
  // and redraw the highlights in the correct position.
  // useEffect(() => {
  //   if (canvasRef.current && relativeRef.current) {
  //     const observer = new ResizeObserver(() => {
  //       canvasRef!.current!.width = relativeRef.current.offsetWidth;
  //       canvasRef!.current!.height = relativeRef.current.offsetHeight;
  //       setCanvasDimensions({
  //         width: canvasRef!.current!.width,
  //         height: canvasRef!.current!.height,
  //       });
  //     });

  //     observer.observe(relativeRef.current);

  //     return () => observer.disconnect();
  //   }
  // }, [relativeRef, canvasRef]);

  const replaceAnnotations = ({ annotationsToReplace }) => {
    if (annotationsToReplace.length > 0) {
      const newAnnotationsSortedByY = [...annotationsSortedByY];
      for (let i = 0; i < newAnnotationsSortedByY.length; i++) {
        const annotation = newAnnotationsSortedByY[i];
        const repositionedAnnotation: AnnotationType | undefined =
          annotationsToReplace.find(
            (_annotation) => annotation.threadId === _annotation.threadId
          );

        if (repositionedAnnotation) {
          // console.log('%cRepositioned', 'color: green; font-weight: bold;')
          // console.log(`reconciling thread ${i}:`, "L: ", annotation.serialized.textContent, "R: ", repositionedAnnotation?.serialized.textContent)
          // console.log(`next thread ${i + 1}:`, newAnnotationsSortedByY[i + 1]?.serialized.textContent, newAnnotationsSortedByY[i + 1]?.threadCoordinates.y)
          // console.log(`Before Y:`, annotation.threadCoordinates.y, "After Y: ", repositionedAnnotation?.threadCoordinates.y)
          newAnnotationsSortedByY[i] = repositionedAnnotation;
        }
      }

      setAnnotationsSortedByY(newAnnotationsSortedByY);
    }
  };

  const _sortAnnotationsByAppearanceInPage = (
    annotations: AnnotationType[]
  ): AnnotationType[] => {
    const sorted = annotations.sort((a, b) => {
      const aY = a.anchorCoordinates[a.anchorCoordinates.length - 1].y;
      const bY = b.anchorCoordinates[b.anchorCoordinates.length - 1].y;
      return aY - bY;
    });

    return sorted;
  };

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

  const createAndSortAnnotations = ({ threadIdsToDraw }) => {
    // const startTime = performance.now();
    console.log("%cDrawing anchors...", "color: #F3A113; font-weight: bold;");

    const orphanThreadIds: Array<ID> = [];
    let foundAnnotations: Array<AnnotationType> = [];

    for (let i = 0; i < threadIdsToDraw.length; i++) {
      const threadId = String(threadIdsToDraw[i]);
      const thread = commentThreads.current[threadId][0].thread;
      const xrange = XRange.createFromSerialized(thread.anchor) || null;

      if (!xrange) {
        console.log(
          "[Annotation] No xrange found for thread. Orphan thread is:",
          thread
        );
        orphanThreadIds.push(threadId);
        continue;
      }

      const annotation = createAnnotation({
        xrange,
        threadId,
        relativeEl: relativeRef.current,
        serializedAnchorPosition: thread.anchor || undefined,
      });

      foundAnnotations.push(annotation);
    }

    if (newAnnotation) {
      foundAnnotations.push(newAnnotation);
    }

    foundAnnotations = _sortAnnotationsByAppearanceInPage(foundAnnotations);

    // drawAnchorsOnCanvas({
    //   annotations: foundAnnotations,
    //   canvasRef,
    //   selectedThreadId,
    // });

    setOrphanThreadIds(orphanThreadIds);

    if (!annotationsSortedByY.length) {
      // Setting annotation only on first draw, when none exist
      // TODO: This may not be the best place to do this. consider another location
      setAnnotationsSortedByY(foundAnnotations);
    }

    // const endTime = performance.now();
    // const timeTaken = endTime - startTime;

    // console.log(`Time taken: ${timeTaken} milliseconds.`);
  };

  // const _drawAnchors = ({ threadIdsToDraw }) => {
  //   // const startTime = performance.now();
  //   console.log("%cDrawing anchors...", "color: #F3A113; font-weight: bold;");

  //   const orphanThreadIds: Array<ID> = [];
  //   let foundAnnotations: Array<AnnotationType> = [];

  //   for (let i = 0; i < threadIdsToDraw.length; i++) {
  //     const threadId = String(threadIdsToDraw[i]);
  //     const thread = commentThreads.current[threadId][0].thread;
  //     const xrange = XRange.createFromSerialized(thread.anchor) || null;

  //     if (!xrange) {
  //       console.log(
  //         "[Annotation] No xrange found for thread. Orphan thread is:",
  //         thread
  //       );
  //       orphanThreadIds.push(threadId);
  //       continue;
  //     }

  //     const annotation = createAnnotation({
  //       xrange,
  //       threadId,
  //       relativeEl: relativeRef.current,
  //       serializedAnchorPosition: thread.anchor || undefined,
  //     });

  //     foundAnnotations.push(annotation);
  //   }

  //   if (newAnnotation) {
  //     foundAnnotations.push(newAnnotation);
  //   }

  //   foundAnnotations = _sortAnnotationsByAppearanceInPage(foundAnnotations);

  //   // drawAnchorsOnCanvas({
  //   //   annotations: foundAnnotations,
  //   //   canvasRef,
  //   //   selectedThreadId,
  //   // });

  //   setOrphanThreadIds(orphanThreadIds);

  //   if (!annotationsSortedByY.length) {
  //     // Setting annotation only on first draw, when none exist
  //     // TODO: This may not be the best place to do this. consider another location
  //     setAnnotationsSortedByY(foundAnnotations);
  //   }

  //   // const endTime = performance.now();
  //   // const timeTaken = endTime - startTime;

  //   // console.log(`Time taken: ${timeTaken} milliseconds.`);
  // };

  const _displayCommentEditor = () => {
    if (!selectionXRange) {
      return console.error("No selected range. This should not happen.");
    }

    const newAnnotation = createAnnotation({
      xrange: selectionXRange,
      threadId: "new-thread",
      relativeEl: relativeRef.current,
    });

    setNewAnnotation(newAnnotation);
  };

  const { x: menuPosX, y: menuPosY } = _calcTextSelectionMenuPos();
  const showSelectionMenu = selectionXRange && initialSelectionPosition;

  // const AnnotationCanvas = useMemo(() => {
  //   return (
  //     <canvas ref={canvasRef} id="overlay" className={css(styles.canvas)} />
  //   );
  // }, []);
  console.log("annotationsSortedByY", annotationsSortedByY);
  return (
    <div style={{ position: "relative" }}>
      {annotationsSortedByY.map((annotation) => (
        <Annotation
          key={`annotation-${annotation.threadId}`}
          annotation={annotation}
          focused={selectedThreadId === annotation.threadId}
          handleClick={(threadId) => setSelectedThreadId(threadId)}
        />
      ))}
      <CommentTreeContext.Provider
        value={{
          sort: sortOpts[0].value,
          filter: COMMENT_FILTERS.ANNOTATION,
          comments: inlineComments,
          context: COMMENT_CONTEXTS.ANNOTATION,
          onCreate: () => alert("Create"),
          onUpdate: () => alert("Update"),
          onRemove: () => alert("Remove"),
          onFetchMore: () => alert("Fetch more"),
        }}
      >
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
        <div
          className={css(styles.commentSidebar)}
          style={{ position: "absolute", right: -510, top: 0, width: 500 }}
        >
          {annotationsSortedByY.map((annotation, idx) => {
            const threadId = String(annotation.threadId);
            const key = `thread-` + threadId || "new-thread";

            return (
              <div
                id={key}
                ref={threadRefs[idx]}
                style={{
                  position: "absolute",
                  background: threadId === "new-thread" ? "none" : "white",
                  padding: 10,
                  border: threadId ? "none" : `1px solid ${colors.border}`,
                  transform: `translate(${annotation.threadCoordinates.x}px, ${annotation.threadCoordinates.y}px)`,
                  width: contextConfig.annotation.commentWidth,
                }}
                className={css(styles.commentThread)}
                key={key}
              >
                <CommentAnnotationThread
                  key={`${key}-thread`}
                  document={doc}
                  threadId={threadId}
                  comments={commentThreads.current[threadId] || []}
                  isFocused={selectedThreadId === threadId}
                />
                {threadId === "new-thread" && (
                  <CommentEditor
                    editorId="new-inline-comment"
                    handleSubmit={async (props) => {
                      try {
                        const comment = await createCommentAPI({
                          ...props,
                          documentId: doc.id,
                          documentType: doc.apiDocumentType,
                          commentType: COMMENT_TYPES.ANNOTATION,
                          anchor: {
                            type: "text",
                            position: annotation.xrange!.serialize(),
                          },
                        });

                        // setNewCommentAnnotation(null);
                        // setInlineComments([...inlineComments, comment]);
                      } catch (error) {
                        captureEvent({
                          msg: "Failed to create inline comment",
                          data: {
                            document,
                            error,
                            annotation,
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
        {/* {AnnotationCanvas} */}
      </CommentTreeContext.Provider>
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
  commentThread: {
    transition: "transform 0.4s ease",
  },
});

export default AnnotationCanvas;
