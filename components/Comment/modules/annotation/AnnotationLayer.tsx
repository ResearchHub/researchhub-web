import { StyleSheet, css } from "aphrodite";
import React, { createRef, useEffect, useRef, useState } from "react";
import {
  Comment as CommentModel,
  CommentThreadGroup,
  parseComment,
  COMMENT_FILTERS,
  COMMENT_TYPES,
  COMMENT_CONTEXTS,
  groupByThread,
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
import Annotation from "./Annotation";
import repositionAnnotations from "./lib/repositionAnnotations";
import differenceWith from "lodash/differenceWith";

interface Props {
  relativeRef: any; // Canvas will be rendered relative to this element
  document: GenericDocument;
}

const AnnotationCanvas = ({ relativeRef, document: doc }: Props) => {
  const [inlineComments, setInlineComments] = useState<CommentModel[]>([]);

  // Sorted List of annotations sorted by order of appearance on the page
  const [annotationsSortedByY, setAnnotationsSortedByY] = useState<
    AnnotationType[]
  >([]);

  // Orphans are annotations that could not be found on page
  const [orphanThreadIds, setOrphanThreadIds] = useState<string[]>([]);

  // The XRange position of the selected text. Holds the serialized DOM position.
  const { selectionXRange, initialSelectionPosition, resetSelectedPos } =
    useSelection({
      ref: relativeRef,
    });

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadRefs, setThreadRefs] = useState<any[]>([]);
  const commentThreads = useRef<{ [threadId: string]: CommentThreadGroup }>({});
  const textSelectionMenuRef = useRef<HTMLDivElement>(null);

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
    // const diff = inlineComments.filter(left => !prevInlineComments.current.some(right => left.id === right.id));
    const _commentThreads = groupByThread(inlineComments);
    commentThreads.current = _commentThreads;

    const { foundAnnotations, orphanThreadIds } = _createAnnotationsFromThreads(
      {
        threads: _commentThreads,
      }
    );

    setOrphanThreadIds(orphanThreadIds);
    const sorted = _sortAnnotationsByAppearanceInPage(foundAnnotations);
    setAnnotationsSortedByY(sorted);
  }, [inlineComments]);

  // Observe dimension changes for each of the threads.
  // If position has changed, recalculate.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const repositioned = repositionAnnotations({
        annotationsSortedByY: annotationsSortedByY,
        selectedThreadId,
        threadRefs,
      });

      _replaceAnnotations({ annotationsToReplace: repositioned });
    });

    threadRefs.forEach((t) => {
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
    setThreadRefs((refs) =>
      Array(annotationsSortedByY.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef())
    );
  }, [annotationsSortedByY.length]);

  useEffect(() => {
    const repositioned = repositionAnnotations({
      annotationsSortedByY: annotationsSortedByY,
      selectedThreadId,
      threadRefs,
    });

    _replaceAnnotations({ annotationsToReplace: repositioned });

    if (selectedThreadId) {
      let isOutOfViewport = false;
      let selectedThreadRect: any;

      const selectedAnnotation = annotationsSortedByY.find(
        (annotation, idx) => annotation.threadId === selectedThreadId
      );

      if (selectedAnnotation) {
        const relativeElOffsetTop =
          window.scrollY + relativeRef.current.getBoundingClientRect().y;
        const anchorOffsetTop =
          relativeElOffsetTop + selectedAnnotation.anchorCoordinates[0].y;

        console.log("anchorOffsetTop", anchorOffsetTop);
        console.log("window.scrollY", window.scrollY);
        console.log("relativeElOffsetTop", relativeElOffsetTop);

        if (
          window.scrollY > anchorOffsetTop ||
          window.scrollY + window.innerHeight < anchorOffsetTop
        ) {
          isOutOfViewport = true;
          window.scrollTo({
            top: anchorOffsetTop - 100,
            behavior: "smooth",
          });
        }
      }
    }

    //   annotationsSortedByY.forEach((annotation, idx) => {
    //     if (annotation.threadId === selectedThreadId) {
    //       const elemRect = threadRefs[idx].current.getBoundingClientRect();

    //       if (elemRect.top < 0) {
    //         isOutOfViewport = true;
    //         selectedThreadRect = elemRect;
    //       }
    //     }
    //   });

    //   const containerElemOffset =
    //     window.scrollY + relativeRef.current.getBoundingClientRect().y;

    // return {
    //   x: 0 - config.textSelectionMenu.width / 2,
    //   y:
    //     window.scrollY -
    //     containerElemOffset +
    //     (initialSelectionPosition?.y || 0),
    // };

    //   if (isOutOfViewport) {
    //     console.log('out of viewport')
    //     console.log('selectedThreadRect', selectedThreadRect)
    //     window.scroll({top: selectedThreadRect.top, behavior: 'smooth'});
    //   }
    // }
  }, [selectedThreadId]);

  useEffect(() => {
    const _handleClick = (event) => {
      const relativeRefRect = relativeRef!.current!.getBoundingClientRect();
      const relativeClickX = event.clientX - relativeRefRect.left;
      const relativeClickY = event.clientY - relativeRefRect.top;
      const clickX = event.clientX;
      const clickY = event.clientY;
      let selectedAnnotation: AnnotationType | null = null;

      for (let i = 0; i < annotationsSortedByY.length; i++) {
        const { anchorCoordinates } = annotationsSortedByY[i];
        const isAnchorClicked = anchorCoordinates.some(
          ({ x, y, width, height }) => {
            return (
              relativeClickX >= x &&
              relativeClickX <= x + width &&
              relativeClickY >= y &&
              relativeClickY >= y &&
              relativeClickY <= y + height
            );
          }
        );

        if (isAnchorClicked) {
          selectedAnnotation = annotationsSortedByY[i];
          continue;
        }
      }

      if (!selectedAnnotation) {
        for (let i = 0; i < annotationsSortedByY.length; i++) {
          const ref = threadRefs[i]?.current;

          if (ref) {
            const rect = ref.getBoundingClientRect();
            if (
              clickX >= rect.left &&
              clickX <= rect.right &&
              clickY >= rect.top &&
              clickY <= rect.bottom
            ) {
              selectedAnnotation = annotationsSortedByY[i];
              continue;
            }
          }
        }
      }

      if (selectedAnnotation) {
        setSelectedThreadId(selectedAnnotation.threadId);
      } else {
        setSelectedThreadId(null);
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, [annotationsSortedByY]);

  const _replaceAnnotations = ({ annotationsToReplace }) => {
    if (annotationsToReplace.length > 0) {
      setAnnotationsSortedByY((prevAnnotations) => {
        const newAnnotationsSortedByY = [...prevAnnotations];
        for (let i = 0; i < newAnnotationsSortedByY.length; i++) {
          const annotation = newAnnotationsSortedByY[i];
          const repositionedAnnotation: AnnotationType | undefined =
            annotationsToReplace.find(
              (_annotation) => annotation.threadId === _annotation.threadId
            );

          if (repositionedAnnotation) {
            newAnnotationsSortedByY[i] = repositionedAnnotation;
          }
        }

        return newAnnotationsSortedByY;
      });
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

  const _createAnnotationsFromThreads = ({
    threads,
  }: {
    threads: { [key: string]: CommentThreadGroup };
  }): {
    orphanThreadIds: Array<string>;
    foundAnnotations: Array<AnnotationType>;
  } => {
    console.log("%cDrawing anchors...", "color: #F3A113; font-weight: bold;");

    const orphanThreadIds: Array<string> = [];
    const foundAnnotations: Array<AnnotationType> = [];

    Object.values(threads).forEach((threadGroup) => {
      const existingAnnotation = annotationsSortedByY.find(
        (annotation) => annotation.threadId === threadGroup.threadId
      );

      if (existingAnnotation) {
        foundAnnotations.push(existingAnnotation);
        return;
      }

      const xrange = XRange.createFromSerialized(threadGroup.thread.anchor);

      if (xrange) {
        const annotation = createAnnotation({
          xrange,
          threadId: threadGroup.threadId,
          relativeEl: relativeRef.current,
          serializedAnchorPosition: threadGroup.thread.anchor || undefined,
        });

        foundAnnotations.push(annotation);
      } else {
        console.log(
          "[Annotation] No xrange found for thread. Orphan thread is:",
          threadGroup.thread
        );
        orphanThreadIds.push(threadGroup.threadId);
      }
    });

    return {
      orphanThreadIds,
      foundAnnotations,
    };
  };

  const _createNewAnnotation = (e) => {
    e.stopPropagation();

    if (!selectionXRange) {
      return console.error("No selected range. This should not happen.");
    }

    const newAnnotation = createAnnotation({
      xrange: selectionXRange,
      relativeEl: relativeRef.current,
      isNew: true,
    });

    const _annotationsSortedByY = _sortAnnotationsByAppearanceInPage([
      ...annotationsSortedByY,
      newAnnotation,
    ]);
    setSelectedThreadId(newAnnotation.threadId);
    setAnnotationsSortedByY(_annotationsSortedByY);
    resetSelectedPos();
  };

  const _handleCancelThread = ({ threadId, event }) => {
    setAnnotationsSortedByY((prevAnnotations) => {
      return prevAnnotations.filter(
        (annotation) => annotation.threadId !== threadId
      );
    });
  };

  const _handleCreateThread = async ({
    annotation,
    commentProps,
  }: {
    annotation: AnnotationType;
    commentProps: any;
  }) => {
    try {
      const comment = await createCommentAPI({
        ...commentProps,
        documentId: doc.id,
        documentType: doc.apiDocumentType,
        commentType: COMMENT_TYPES.ANNOTATION,
        anchor: {
          type: "text",
          position: annotation.xrange!.serialize(),
        },
      });

      setAnnotationsSortedByY((prevAnnotations) => {
        return prevAnnotations.filter(
          (_annotation) => _annotation.threadId !== annotation.threadId
        );
      });

      _onCreate({ comment, clientId: annotation.threadId });
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
  };

  const _onCreate = ({
    comment,
    clientId,
  }: {
    comment: CommentModel;
    clientId: string;
  }) => {
    console.log("comment", comment);
    setInlineComments([...inlineComments, comment]);
  };

  const { x: menuPosX, y: menuPosY } = _calcTextSelectionMenuPos();
  const showSelectionMenu = selectionXRange && initialSelectionPosition;

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
          onCreate: _onCreate,
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
            ref={textSelectionMenuRef}
          >
            <TextSelectionMenu
              onCommentClick={_createNewAnnotation}
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
            const key = `thread-` + threadId;
            const isFocused = selectedThreadId === threadId;
            return (
              <div
                id={key}
                ref={threadRefs[idx]}
                style={{
                  position: "absolute",
                  background: "white",
                  padding: 10,
                  border: isFocused ? "none" : `1px solid ${colors.border}`,
                  transform: `translate(${annotation.threadCoordinates.x}px, ${annotation.threadCoordinates.y}px)`,
                  width: contextConfig.annotation.commentWidth,
                  boxShadow: isFocused
                    ? "0px 0px 15px rgba(36, 31, 58, 0.2)"
                    : "none",
                  borderRadius: 4,
                }}
                className={css(styles.commentThread)}
                key={key}
              >
                {annotation.isNew ? (
                  <CommentEditor
                    handleCancel={(event) =>
                      _handleCancelThread({ threadId, event })
                    }
                    editorStyleOverride={styles.commentEditor}
                    editorId={`${key}-editor`}
                    handleSubmit={(commentProps) =>
                      _handleCreateThread({ annotation, commentProps })
                    }
                  />
                ) : (
                  <CommentAnnotationThread
                    key={`${key}-thread`}
                    document={doc}
                    threadId={threadId}
                    comments={commentThreads?.current[threadId]?.comments || []}
                    isFocused={isFocused}
                  />
                )}
              </div>
            );
          })}
        </div>
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
    cursor: "pointer",
    transition: "transform 0.4s ease",
  },
  commentEditor: {
    boxShadow: "none",
    padding: 0,
  },
});

export default AnnotationCanvas;
