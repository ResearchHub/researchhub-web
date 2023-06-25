import { StyleSheet, css } from "aphrodite";
import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Comment as CommentModel,
  parseComment,
  UnrenderedAnnotationThread,
  RenderedAnnotationThread,
  COMMENT_FILTERS,
  COMMENT_TYPES,
  COMMENT_CONTEXTS,
} from "./lib/types";
import { createCommentAPI, fetchCommentsAPI } from "./lib/api";
import { GenericDocument } from "../Document/lib/types";
import XRange from "./lib/xrange/XRange";
import colors from "./lib/colors";
import drawThreadAnchorsOnCanvas from "./lib/drawThreadAnchorsOnCanvas";
import TextSelectionMenu from "./TextSelectionMenu";
import useSelection from "~/components/Comment/hooks/useSelection";
import config, { contextConfig } from "./lib/config";
import CommentEditor from "./CommentEditor";
import { captureEvent } from "~/config/utils/events";
import { CommentTreeContext } from "./lib/contexts";
import { sortOpts } from "./lib/options";
import CommentAnnotationThread from "./CommentAnnotationThread";
import groupBy from "lodash/groupBy";
import debounce from "lodash/debounce";

interface Props {
  relativeRef: any; // Canvas will be rendered relative to this element
  document: GenericDocument;
}

const AnnotationCanvas = ({ relativeRef, document: doc }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inlineComments, setInlineComments] = useState<CommentModel[]>([]);
  const [renderedAnnotationThreads, setRenderedAnnotationThreads] = useState<
    RenderedAnnotationThread[]
  >([]);
  const [canvasDimensions, setCanvasDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [selectedAnnotationThread, setSelectedAnnotationThread] =
    useState<RenderedAnnotationThread | null>(null);
  const { selectionXRange, initialSelectionPosition } = useSelection({
    ref: relativeRef,
  });
  const [newCommentAnnotation, setNewCommentAnnotation] =
    useState<UnrenderedAnnotationThread | null>(null);
  const newCommentAnnotationRef = useRef<UnrenderedAnnotationThread | null>(
    null
  );
  const [annotationThreadRefs, setAnnotationThreadRefs] = useState<any[]>([]);

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

  // Create a ref for each annotation thread so we can observe it for when it changes dimensions.
  // If a thread changes dimensions, we need to redraw the annotation sidebar because each thread is absolutely positioned
  useEffect(() => {
    setAnnotationThreadRefs((refs) =>
      Array(renderedAnnotationThreads.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef())
    );
  }, [renderedAnnotationThreads]);

  // useEffect(() => {
  //   console.log("Inside")
  //  _calcAnnotationThreadPositions();
  // }, [renderedAnnotationThreads])

  // We want to draw annotations when comments change or when the canvas dimensions change.
  useEffect(() => {
    if (
      (inlineComments.length > 0 || newCommentAnnotation) &&
      canvasDimensions.width > 0 &&
      canvasDimensions.height > 0
    ) {
      // _debouncedDrawAnchors();
      _drawAnchors();
    }

    // Cleanup function: cancel any trailing throttled call
    // return () => {
    //   _debouncedDrawAnchors.cancel();
    // };
  }, [
    canvasDimensions,
    inlineComments,
    newCommentAnnotation,
    selectedAnnotationThread,
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

      let selectedAnnotationThread: RenderedAnnotationThread | null = null;
      for (let i = 0; i < renderedAnnotationThreads.length; i++) {
        const { anchorCoordinates } = renderedAnnotationThreads[i];

        const isClickWithinHighlight = anchorCoordinates.some(
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
          selectedAnnotationThread = renderedAnnotationThreads[i];
          continue;
        }
      }

      if (selectedAnnotationThread) {
        setSelectedAnnotationThread(selectedAnnotationThread);
      } else {
        // Clicked outside of any highlight. Let's dismiss current selected.
        setSelectedAnnotationThread(null);
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
  }, [relativeRef, canvasRef, renderedAnnotationThreads]);

  // When the thread refs are ready, we want to set up observers to watch for changes in thread dimensions
  // If the thread dimensions change, we need to redraw all relative threads.
  useEffect(() => {
    // Create a new ResizeObserver that will update your layout or state
    const resizeObserver = new ResizeObserver((entries) => {
      // Iterate over all entries

      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        console.log("Element1:", entry.target, "Size", {
          height: rect.height,
          width: rect.width,
        });
      }
      // _debouncedCalcAnnotationThreadPositions();
    });

    // Observe each annotation for changes in size
    annotationThreadRefs.forEach((ref) => {
      if (ref.current) {
        resizeObserver.observe(ref.current);
      }
    });

    // Clean up by unobserving all elements when the component unmounts
    return () => {
      annotationThreadRefs.forEach((ref) => {
        if (ref.current) {
          resizeObserver.unobserve(ref.current);
        }
      });
    };
  }, [annotationThreadRefs]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        console.log("Element:", entry.target, "Size", {
          height: rect.height,
          width: rect.width,
        });
        _calcAnnotationThreadPositions();
      }
    });

    let focusedThreadRef: any = null;
    if (newCommentAnnotationRef?.current) {
      focusedThreadRef = newCommentAnnotationRef.current;
    } else if (selectedAnnotationThread) {
      focusedThreadRef = annotationThreadRefs.find(
        (ref) =>
          ref.current &&
          ref.current.contains(
            document.getElementById(
              `thread-${selectedAnnotationThread?.commentThread?.id}`
            )
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
  }, [annotationThreadRefs, selectedAnnotationThread]);

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

  const _sortAnnotationThreads = (
    annotationThreads: RenderedAnnotationThread[]
  ) => {
    const sorted = annotationThreads.sort((a, b) => {
      const aY = a.anchorCoordinates[a.anchorCoordinates.length - 1].y;
      const bY = b.anchorCoordinates[b.anchorCoordinates.length - 1].y;
      return aY - bY;
    });

    return sorted;
  };

  const _calcAnnotationThreadPositions = () => {
    const MIN_SPACE_BETWEEN_THREAD = 15;
    const SELECTED_THREAD_X_OFFSET = 30;
    const _renderedAnnotationThreads = _sortAnnotationThreads(
      renderedAnnotationThreads
    );
    const focalPointIndex = _renderedAnnotationThreads.findIndex(
      (thread) =>
        thread.commentThread?.id ===
          selectedAnnotationThread?.commentThread?.id || thread.isNew
    );

    const updatedThreads: Array<RenderedAnnotationThread> = [];
    const beforeFocalPointThreads = _renderedAnnotationThreads.slice(
      0,
      focalPointIndex
    );
    const focalPointThread = _renderedAnnotationThreads[focalPointIndex];
    const afterFocalPointThreads = _renderedAnnotationThreads.slice(
      focalPointIndex + 1
    );

    const focalPointAndBefore = [...beforeFocalPointThreads].concat(
      focalPointThread ? [focalPointThread] : []
    );
    for (let i = focalPointAndBefore.length - 1; i >= 0; i--) {
      const currentThread = focalPointAndBefore[i];
      const currentThreadRef = annotationThreadRefs[i];
      const prevThread = focalPointAndBefore[i - 1];
      const prevThreadRef = annotationThreadRefs[i - 1];

      if (prevThread && prevThreadRef?.current && currentThreadRef?.current) {
        const prevRect = prevThreadRef.current.getBoundingClientRect();
        const prevRectBottom = prevThread.threadCoordinates.y + prevRect.height;

        if (
          currentThread.threadCoordinates.y <
          prevRectBottom + MIN_SPACE_BETWEEN_THREAD
        ) {
          const prevThreadNewPosY =
            currentThread.threadCoordinates.y -
            MIN_SPACE_BETWEEN_THREAD -
            prevRect.height;
          if (prevThread.threadCoordinates.y !== prevThreadNewPosY) {
            // console.log(`Updating [Before] Position of thread ${i} from ${prevThread.threadCoordinates.y} to: ${prevThreadNewPosY}`);
            // console.log('XXprevThread', prevThread.commentThread?.anchor?.position.textContent)
            // console.log('XXcurrentThread', currentThread.commentThread?.anchor?.position.textContent)
            prevThread.threadCoordinates.y = prevThreadNewPosY;
            updatedThreads.push(prevThread);
          }
        }
      }
    }

    const focalPointAndAfter = (
      focalPointThread ? [focalPointThread] : []
    ).concat([...afterFocalPointThreads]);
    for (let i = 0; i < focalPointAndAfter.length - 1; i++) {
      const currentThread = focalPointAndAfter[i];
      const currentThreadRef = annotationThreadRefs[i];
      const nextThread = focalPointAndAfter[i + 1];
      const nextThreadRef = annotationThreadRefs[i + 1];

      if (nextThread && nextThreadRef?.current && currentThreadRef?.current) {
        const nextRect = nextThreadRef.current.getBoundingClientRect();
        const currentRect = currentThreadRef.current.getBoundingClientRect();
        const nextRectTop = nextThread.threadCoordinates.y;

        if (
          nextRectTop <
          currentThread.threadCoordinates.y +
            currentRect.height +
            MIN_SPACE_BETWEEN_THREAD
        ) {
          const nextThreadNewPosY =
            currentThread.threadCoordinates.y +
            currentRect.height +
            MIN_SPACE_BETWEEN_THREAD;
          if (nextThread.threadCoordinates.y !== nextThreadNewPosY) {
            console.log(
              `Updating [After] Position of thread ${i} from ${nextThread.threadCoordinates.y} to: ${nextThreadNewPosY}`
            );
            nextThread.threadCoordinates.y = nextThreadNewPosY;
            updatedThreads.push(currentThread);
          }
        }
      }
    }

    // Rconcile updated with current
    if (updatedThreads.length > 0) {
      const reconciledThreads = [...renderedAnnotationThreads];
      for (let i = 0; i < renderedAnnotationThreads.length; i++) {
        const currentThread = renderedAnnotationThreads[i];
        const updatedThread = updatedThreads.find(
          (thread) =>
            thread.commentThread?.id === currentThread.commentThread?.id
        );
        if (updatedThread) {
          reconciledThreads[i] = updatedThread;
        }
      }

      setRenderedAnnotationThreads(reconciledThreads);
    }
  };
  const _debouncedCalcAnnotationThreadPositions = debounce(
    _calcAnnotationThreadPositions,
    500
  );

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
    console.log("Drawing anchors...");

    const commentThreads = groupBy(inlineComments, (c) => c.thread.id);
    const _unrenderedThreads = Object.keys(
      commentThreads
    ).map<UnrenderedAnnotationThread>((_threadId) => {
      const comments = commentThreads[_threadId];
      const commentThread = comments[0].thread;
      const xrange =
        XRange.createFromSerialized(commentThread.anchor?.position) || null;

      const _t: UnrenderedAnnotationThread = {
        comments,
        commentThread,
        xrange: xrange,
        isNew: false,
      };
      return _t;
    });

    if (newCommentAnnotation) {
      _unrenderedThreads.push(newCommentAnnotation);
    }

    drawThreadAnchorsOnCanvas({
      unrenderedAnnotationThreads: _unrenderedThreads,
      canvasRef,
      onRender: setRenderedAnnotationThreads,
      selectedAnnotationThread,
    });
  };
  // Since there are a bunch of dependencies that can trigger the re-drawing,
  // we want to debounce so drawing doesn't occur too often.
  const _debouncedDrawAnchors = debounce(_drawAnchors, 500);

  const _displayCommentEditor = () => {
    if (!selectionXRange) {
      return console.error("No selected range. This should not happen.");
    }

    setNewCommentAnnotation({
      isNew: true,
      xrange: selectionXRange,
      comments: [],
    });
  };

  const { x: menuPosX, y: menuPosY } = _calcTextSelectionMenuPos();
  const showSelectionMenu = selectionXRange && initialSelectionPosition;

  const AnnotationCanvas = useMemo(() => {
    return (
      <canvas ref={canvasRef} id="overlay" className={css(styles.canvas)} />
    );
  }, []);

  const MemoizedCommentAnnotationThread = React.memo(CommentAnnotationThread);

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
        {renderedAnnotationThreads.length > 0 && (
          <div
            className={css(styles.commentSidebar)}
            style={{ position: "absolute", right: -510, top: 0, width: 500 }}
          >
            {renderedAnnotationThreads.map((thread, idx) => {
              const id =
                `thread-` + thread.commentThread?.id || "new-comment-thread";

              return (
                <div
                  id={id}
                  ref={annotationThreadRefs[idx]}
                  style={{
                    position: "absolute",
                    background: thread.isNew ? "none" : "white",
                    padding: 10,
                    border: thread.isNew
                      ? "none"
                      : `1px solid ${colors.border}`,
                    left: thread.threadCoordinates.x,
                    top: thread.threadCoordinates.y,
                    width: contextConfig.annotation.commentWidth,
                  }}
                  key={id}
                >
                  {thread.comments.length > 0 && (
                    <CommentAnnotationThread
                      key={`${id}-thread`}
                      document={doc}
                      thread={thread}
                      isFocused={
                        selectedAnnotationThread?.commentThread?.id ===
                        thread?.commentThread?.id
                      }
                    />
                  )}
                  {thread.isNew && (
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
                              position: thread.xrange!.serialize(),
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
                              thread,
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
