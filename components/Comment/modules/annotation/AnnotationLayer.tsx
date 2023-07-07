import { StyleSheet, css } from "aphrodite";
import React, { createRef, use, useEffect, useRef, useState } from "react";
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
import createShareableLink from "./lib/createShareableLink";
import XPathUtil from "../../lib/xrange/XPathUtil";

interface Props {
  contentRef: any;
  document: GenericDocument;
}

const AnnotationLayer = ({ contentRef, document: doc }: Props) => {
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
      contentRef: contentRef,
    });

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [positionFromUrl, setPositionFromUrl] = useState<AnnotationType | null>(
    null
  );
  const [threadRefs, setThreadRefs] = useState<any[]>([]);
  const commentThreads = useRef<{ [threadId: string]: CommentThreadGroup }>({});
  const textSelectionMenuRef = useRef<HTMLDivElement>(null);
  const contentElXpath = useRef<string>("");

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
    if (contentRef.current && contentElXpath.current === "") {
      contentElXpath.current =
        XPathUtil.getXPathFromNode(contentRef.current) || "";
    }
  }, [contentRef]);

  useEffect(() => {
    // FIXME: This should start working on page load after we use relative xpath instead of absolute
    if (contentRef.current && window.location.hash.length > 0) {
      const hashPairs = window.location.hash.split("&");
      const selectionIdx = hashPairs.findIndex((pair) =>
        pair.includes("selection")
      );

      if (selectionIdx > -1) {
        let MAX_ATTEMPTS_REMAINING = 5;
        const interval = setInterval(() => {
          if (MAX_ATTEMPTS_REMAINING === 0) {
            clearInterval(interval);
            return;
          }

          const [key, value] = hashPairs[selectionIdx].split("=");
          const serializedSelection = JSON.parse(decodeURIComponent(value));

          const xrange = XRange.createFromSerialized({
            serialized: serializedSelection,
            xpathPrefix: contentElXpath.current,
          });

          if (xrange) {
            const annotation = createAnnotation({
              xrange,
              ignoreXPathPrefix: contentElXpath.current,
              threadId: "position-from-url",
              relativeEl: contentRef.current,
              serializedAnchorPosition: xrange.serialize({
                ignoreXPathPrefix: contentElXpath.current,
              }),
            });
            setPositionFromUrl(annotation);
            clearInterval(interval);
          }

          MAX_ATTEMPTS_REMAINING--;
        }, 1000);
      }
    }
  }, [contentRef]);

  useEffect(() => {
    if (inlineComments.length === 0) return;

    const _commentThreads = groupByThread(inlineComments);
    commentThreads.current = _commentThreads;

    const { foundAnnotations, orphanThreadIds } = _drawAnnotations({
      threads: _commentThreads,
    });

    setOrphanThreadIds(orphanThreadIds);
    const sorted = _sortAnnotationsByAppearanceInPage(foundAnnotations);
    setAnnotationsSortedByY(sorted);
  }, [inlineComments]);

  // Observe dimension changes for each of the threads.
  // If position has changed, recalculate.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setAnnotationsSortedByY((annotations) => {
        const repositioned = repositionAnnotations({
          annotationsSortedByY: annotationsSortedByY,
          selectedThreadId,
          threadRefs,
        });

        return _replaceAnnotations({
          existing: annotations,
          replaceWith: repositioned,
        });
      });
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
  }, [threadRefs, selectedThreadId]);

  useEffect(() => {
    setThreadRefs((refs) =>
      Array(annotationsSortedByY.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef())
    );
  }, [annotationsSortedByY.length]);

  useEffect(() => {
    setAnnotationsSortedByY((annotations) => {
      const repositioned = repositionAnnotations({
        annotationsSortedByY: annotationsSortedByY,
        selectedThreadId,
        threadRefs,
      });

      return _replaceAnnotations({
        existing: annotations,
        replaceWith: repositioned,
      });
    });

    if (selectedThreadId) {
      let isOutOfViewport = false;

      const selectedAnnotation = annotationsSortedByY.find(
        (annotation, idx) => annotation.threadId === selectedThreadId
      );

      if (selectedAnnotation) {
        const relativeElOffsetTop =
          window.scrollY + contentRef.current.getBoundingClientRect().y;
        const anchorOffsetTop =
          relativeElOffsetTop + selectedAnnotation.anchorCoordinates[0].y;

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
  }, [selectedThreadId]);

  useEffect(() => {
    const _handleClick = (event) => {
      const contentRefRect = contentRef!.current!.getBoundingClientRect();
      const relativeClickX = event.clientX - contentRefRect.left;
      const relativeClickY = event.clientY - contentRefRect.top;
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

  const _replaceAnnotations = ({
    existing,
    replaceWith,
  }: {
    existing: AnnotationType[];
    replaceWith: AnnotationType[];
  }) => {
    const newAnnotationsSortedByY = [...existing];
    for (let i = 0; i < newAnnotationsSortedByY.length; i++) {
      const annotation = newAnnotationsSortedByY[i];
      const repositionedAnnotation: AnnotationType | undefined =
        replaceWith.find(
          (_annotation) => annotation.threadId === _annotation.threadId
        );

      if (repositionedAnnotation) {
        newAnnotationsSortedByY[i] = repositionedAnnotation;
      }
    }

    return newAnnotationsSortedByY;
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
    if (!contentRef.current) return { x: 0, y: 0 };

    const containerElemOffset =
      window.scrollY + contentRef.current.getBoundingClientRect().y;
    return {
      x: 0 - config.textSelectionMenu.width / 2,
      y:
        window.scrollY -
        containerElemOffset +
        (initialSelectionPosition?.y || 0),
    };
  };

  const _drawAnnotations = ({
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

      const xrange = XRange.createFromSerialized({
        serialized: threadGroup.thread.anchor,
        xpathPrefix: contentElXpath.current,
      });

      if (xrange) {
        const annotation = createAnnotation({
          xrange,
          threadId: threadGroup.threadId,
          relativeEl: contentRef.current,
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
      relativeEl: contentRef.current,
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
          position: annotation.xrange!.serialize({
            ignoreXPathPrefix: contentElXpath.current,
          }),
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
        />
      ))}
      {positionFromUrl && (
        <Annotation
          annotation={positionFromUrl}
          focused={true}
          color={colors.annotation.sharedViaUrl}
        />
      )}
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
              onLinkClick={() =>
                createShareableLink({
                  selectionXRange,
                  contentElXpath: contentElXpath.current,
                })
              }
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

export default AnnotationLayer;
