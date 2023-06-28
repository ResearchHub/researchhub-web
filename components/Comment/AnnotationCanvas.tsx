import { StyleSheet, css } from "aphrodite";
import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Comment as CommentModel,
  parseComment,
  COMMENT_FILTERS,
  COMMENT_TYPES,
  COMMENT_CONTEXTS,
  createAnnotation,
  Annotation,
} from "./lib/types";
import { createCommentAPI, fetchCommentsAPI } from "./lib/api";
import { GenericDocument } from "../Document/lib/types";
import XRange from "./lib/xrange/XRange";
import colors from "./lib/colors";
import drawAnchorsOnCanvas from "./lib/drawAnchorsOnCanvas";
import TextSelectionMenu from "./TextSelectionMenu";
import useSelection from "~/components/Comment/hooks/useSelection";
import config, { contextConfig } from "./lib/config";
import CommentEditor from "./CommentEditor";
import { captureEvent } from "~/config/utils/events";
import { CommentTreeContext } from "./lib/contexts";
import { sortOpts } from "./lib/options";
import CommentAnnotationThread from "./CommentAnnotationThread";
import groupBy from "lodash/groupBy";
import { ID } from "~/config/types/root_types";

interface Props {
  relativeRef: any; // Canvas will be rendered relative to this element
  document: GenericDocument;
}

const AnnotationCanvas = ({ relativeRef, document: doc }: Props) => {
  const [inlineComments, setInlineComments] = useState<CommentModel[]>([]);

  // Anchors (e.g. highlights) will be rendered on top of this canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sorted List of annotations sorted by order of appearance on the page
  const [annotationsSortedByY, setAnnotationsSortedByY] = useState<
    Annotation[]
  >([]);

  // Orphans are annotations that could not be found on page
  const [orphanThreadIds, setOrphanThreadIds] = useState<ID[]>([]);

  // The XRange position of the selected text. Holds the serialized DOM position.
  const { selectionXRange, initialSelectionPosition } = useSelection({
    ref: relativeRef,
  });

  const [newAnnotation, setNewAnnotation] = useState<Annotation | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<
    ID | "new-annotation" | null
  >(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const newThreadRef = useRef<any | null>(null);
  const [threadRefs, setThreadRefs] = useState<any[]>([]);
  const commentThreads: { [key: string]: Array<CommentModel> } = groupBy(
    inlineComments,
    (c: CommentModel) => String(c.thread.id)
  );

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

  // Draw anchors on canvas once canvas is ready
  useEffect(() => {
    if (
      (inlineComments.length > 0 || newAnnotation) &&
      canvasDimensions.width > 0 &&
      canvasDimensions.height > 0
    ) {
      _drawAnchors();
    }
  }, [canvasDimensions, inlineComments, newAnnotation, selectedThreadId]);

  // Observe dimension changes for each of the threads.
  // If position has changed, recalculate.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        // console.log("Element:", entry.target, "Size", {
        //   height: rect.height,
        //   width: rect.width,
        // });

        // TODO: Debounce this calculation
        _calcThreadPositions();
      }
    });

    let focusedThreadRef: any = null;
    if (newThreadRef?.current) {
      focusedThreadRef = newThreadRef.current;
    } else if (selectedThreadId) {
      focusedThreadRef = threadRefs.find(
        (ref) =>
          ref.current &&
          ref.current.contains(
            document.getElementById(`thread-${selectedThreadId}`)
          )
      );
    }

    if (focusedThreadRef?.current) {
      resizeObserver.observe(focusedThreadRef.current);
    }

    return () => {
      if (focusedThreadRef?.current) {
        resizeObserver.unobserve(focusedThreadRef.current);
      }
    };
  }, [threadRefs, selectedThreadId]);

  // Creates list of sorted refs that matches order of annotationsSortedByY
  // Create a ref for each thread so we can observe it for when it changes dimensions.
  // If a thread changes dimensions, we need to redraw the comment sidebar because each thread within it is absolutely positioned.
  useEffect(() => {
    setThreadRefs((refs) =>
      Array(annotationsSortedByY.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef())
    );
  }, [annotationsSortedByY, newAnnotation]);

  // Set up click events.
  // The canvas element has no pointer-events because we want the user to be able to select text
  // in the content layer beneath. As a result, we can't detect click events on the canvas so
  // we need to detect click events on the content layer and compare to the canvas highlight coordinates to
  // see if there is a match.
  useEffect(() => {
    const handleClick = (event): void => {
      const rect = canvasRef!.current!.getBoundingClientRect();
      const clickedX = event.clientX - rect.left;
      const clickedY = event.clientY - rect.top;

      let selectedAnnotation: Annotation | null = null;
      for (let i = 0; i < annotationsSortedByY.length; i++) {
        const { anchorCoordinates } = annotationsSortedByY[i];

        const isAnchorClicked = anchorCoordinates.some(
          ({ x, y, width, height }) => {
            return (
              clickedX >= x &&
              clickedX <= x + width &&
              clickedY >= y &&
              clickedY <= y + height
            );
          }
        );

        if (isAnchorClicked) {
          selectedAnnotation = annotationsSortedByY[i];
          continue;
        }
      }

      if (selectedAnnotation) {
        setSelectedThreadId(selectedAnnotation.threadId);
      } else {
        // Selected dismissed.
        setSelectedThreadId(null);
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
  }, [relativeRef, canvasRef, annotationsSortedByY]);

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

  const _sortAnnotationsByAppearanceInPage = (
    annotations: Annotation[]
  ): Annotation[] => {
    const sorted = annotations.sort((a, b) => {
      const aY = a.anchorCoordinates[a.anchorCoordinates.length - 1].y;
      const bY = b.anchorCoordinates[b.anchorCoordinates.length - 1].y;
      return aY - bY;
    });

    return sorted;
  };

  const _calcThreadPositions = (): void => {
    const SELECTED_THREAD_X_OFFSET = 30;
    const MIN_SPACE_BETWEEN_THREAD = 15; // Threads will be at least this distance apart

    const focalPointIndex = annotationsSortedByY.findIndex(
      (pos) =>
        pos.threadId === selectedThreadId || pos.threadId === "new-annotation"
    );

    const repositioned: Array<Annotation> = []; // Keep track of threads that have been repositioned.
    const beforeFocalPoint = annotationsSortedByY.slice(0, focalPointIndex);
    const focalPoint = annotationsSortedByY[focalPointIndex];
    const afterFocalPoint = annotationsSortedByY.slice(focalPointIndex + 1);
    const focalPointAndBefore = [...beforeFocalPoint].concat(
      focalPoint ? [focalPoint] : []
    );
    for (let i = focalPointAndBefore.length - 1; i >= 0; i--) {
      const annotation = focalPointAndBefore[i];
      const prevAnnotation = annotationsSortedByY[i - 1];
      const threadRef = threadRefs[i];
      const prevThreadRef = threadRefs[i - 1];

      if (prevThreadRef?.current && threadRef?.current) {
        const prevRect = prevThreadRef.current.getBoundingClientRect();
        const prevRectBottom =
          prevAnnotation.threadCoordinates.y + prevRect.height;

        if (
          annotation.threadCoordinates.y <
          prevRectBottom + MIN_SPACE_BETWEEN_THREAD
        ) {
          const prevThreadNewPosY =
            annotation.threadCoordinates.y -
            MIN_SPACE_BETWEEN_THREAD -
            prevRect.height;
          if (prevAnnotation.threadCoordinates.y !== prevThreadNewPosY) {
            // console.log(`Updating [Before] Position of thread ${i} from ${prevThread.threadCoordinates.y} to: ${prevThreadNewPosY}`);
            // console.log('XXprevThread', prevThread.commentThread?.anchor?.position.textContent)
            // console.log('XXcurrentThread', currentThread.commentThread?.anchor?.position.textContent)
            prevAnnotation.threadCoordinates.y = prevThreadNewPosY;
            repositioned.push(prevAnnotation);
          }
        }
      }
    }

    const focalPointAndAfter = (focalPoint ? [focalPoint] : []).concat([
      ...afterFocalPoint,
    ]);
    for (let i = 0; i < focalPointAndAfter.length - 1; i++) {
      const annotation = focalPointAndAfter[i];
      const nextAnnotation = annotationsSortedByY[i + 1];
      const threadRef = threadRefs[i];
      const nextThreadRef = threadRefs[i + 1];

      if (nextThreadRef?.current && threadRef?.current) {
        const nextRect = nextThreadRef.current.getBoundingClientRect();
        const currentRect = threadRef.current.getBoundingClientRect();
        const nextRectTop = nextAnnotation.threadCoordinates.y;

        if (
          nextRectTop <
          annotation.threadCoordinates.y +
            currentRect.height +
            MIN_SPACE_BETWEEN_THREAD
        ) {
          const nextThreadNewPosY =
            annotation.threadCoordinates.y +
            currentRect.height +
            MIN_SPACE_BETWEEN_THREAD;
          if (nextAnnotation.threadCoordinates.y !== nextThreadNewPosY) {
            // console.log(
            //   `Updating [After] Position of thread ${i} from ${nextAnnotation.threadCoordinates.y} to: ${nextThreadNewPosY}`
            // );
            nextAnnotation.threadCoordinates.y = nextThreadNewPosY;
            repositioned.push(annotation);
          }
        }
      }
    }

    // Rconcile updated with current
    if (repositioned.length > 0) {
      for (let i = 0; i < annotationsSortedByY.length; i++) {
        const annotation = annotationsSortedByY[i];
        const repositionedThread: Annotation | undefined = repositioned.find(
          (thread) => annotation.threadId === annotationsSortedByY[i].threadId
        );
        if (repositionedThread) {
          annotationsSortedByY[i] = repositionedThread;
        }
      }

      setAnnotationsSortedByY(annotationsSortedByY);
    }
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

  const _drawAnchors = () => {
    const threadIds = Object.keys(commentThreads);
    console.log("%cDrawing anchors...", "color: #F3A113; font-weight: bold;");

    const orphanThreadIds: Array<ID> = [];
    let foundAnnotations: Array<Annotation> = [];
    for (let i = 0; i < threadIds.length; i++) {
      const threadId = String(threadIds[i]);
      const threadComments = commentThreads[threadId];
      const thread = commentThreads[threadId][0].thread;
      const xrange = XRange.createFromSerialized(thread.anchor) || null;

      if (!xrange) {
        console.log(
          "[Annotation] No xrange found for thread. Orphan thread is:",
          thread
        );
        orphanThreadIds.push(threadId);
        continue;
      }

      const anchorPos = createAnnotation({
        xrange,
        threadId,
        canvasEl: canvasRef.current,
        serializedAnchorPosition: threadComments[0].thread.anchor || undefined,
      });

      foundAnnotations.push(anchorPos);
    }

    if (newAnnotation) {
      foundAnnotations.push(newAnnotation);
    }

    foundAnnotations = _sortAnnotationsByAppearanceInPage(foundAnnotations);

    drawAnchorsOnCanvas({
      annotations: foundAnnotations,
      canvasRef,
      // selectedAnnotationThread,
    });

    setOrphanThreadIds(orphanThreadIds);
    setAnnotationsSortedByY(foundAnnotations);
  };

  const _displayCommentEditor = () => {
    if (!selectionXRange) {
      return console.error("No selected range. This should not happen.");
    }

    const newAnnotation = createAnnotation({
      xrange: selectionXRange,
      threadId: "new-thread",
      canvasEl: canvasRef.current,
    });

    setNewAnnotation(newAnnotation);
  };

  const { x: menuPosX, y: menuPosY } = _calcTextSelectionMenuPos();
  const showSelectionMenu = selectionXRange && initialSelectionPosition;

  const AnnotationCanvas = useMemo(() => {
    return (
      <canvas ref={canvasRef} id="overlay" className={css(styles.canvas)} />
    );
  }, []);

  return (
    <div>
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
                  left: annotation.threadCoordinates.x,
                  top: annotation.threadCoordinates.y,
                  width: contextConfig.annotation.commentWidth,
                }}
                key={key}
              >
                <CommentAnnotationThread
                  key={`${key}-thread`}
                  document={doc}
                  threadId={threadId}
                  comments={commentThreads[threadId] || []}
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
        {AnnotationCanvas}
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
});

export default AnnotationCanvas;
