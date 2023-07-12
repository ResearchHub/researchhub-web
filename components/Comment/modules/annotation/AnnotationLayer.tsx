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
import XRange from "./lib/xrange/XRange";
import colors from "../../lib/colors";
import TextSelectionMenu from "../../TextSelectionMenu";
import useSelection from "~/components/Comment/hooks/useSelection";
import config from "../../lib/config";
import CommentEditor from "../../CommentEditor";
import { captureEvent } from "~/config/utils/events";
import { CommentTreeContext } from "../../lib/contexts";
import { sortOpts } from "../../lib/options";
import AnnotationCommentThread from "./AnnotationCommentThread";
import Annotation from "./Annotation";
import repositionAnnotations from "./lib/repositionAnnotations";
import createShareableLink from "./lib/createShareableLink";
import XPathUtil from "./lib/xrange/XPathUtil";
import CommentDrawer from "../../CommentDrawer";
import { breakpoints } from "~/config/themes/screen";
import debounce from "lodash/debounce";
import AuthorAvatar from "~/components/AuthorAvatar";
import { useDispatch } from "react-redux";
import { MessageActions } from "~/redux/message";
const { setMessage, showMessage } = MessageActions;

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

  // Holds information about a particular annotation that is shared via URL
  const [positionFromUrl, setPositionFromUrl] = useState<AnnotationType | null>(
    null
  );

  // Dictates how the comment should be rendered. Depends on the screen size.
  const [renderCommentsAs, setRenderCommentsAs] = useState<
    "sidebar" | "drawer" | "inline"
  >("inline");

  const [threadRefs, setThreadRefs] = useState<any[]>([]);
  const commentThreads = useRef<{ [threadId: string]: CommentThreadGroup }>({});
  const textSelectionMenuRef = useRef<HTMLDivElement>(null);
  const contentElXpath = useRef<string>("");
  const dispatch = useDispatch();

  // Fetch comments from API
  useEffect(() => {
    const _fetch = async () => {
      const { comments: rawComments } = await fetchCommentsAPI({
        documentId: doc.id,
        filter: COMMENT_FILTERS.ANNOTATION,
        sort: "CREATED_DATE",
        ascending: true,
        documentType: doc.apiDocumentType,
        // For annotations, we want a very large page size because there is no "load more" UI button
        childPageSize: 10000,
        pageSize: 10000,
      });
      const comments = rawComments.map((raw) => parseComment({ raw }));
      setInlineComments(comments);
    };

    _fetch();
  }, []);

  // Once we have comments, we want to group them by threads and draw them as annotations
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

  // Gets xpath to the contentEl. Later, we will use this to retrieve a relative xpath to the selected text.
  // instead of an absolute path.
  useEffect(() => {
    if (contentRef.current && contentElXpath.current === "") {
      contentElXpath.current =
        XPathUtil.getXPathFromNode(contentRef.current) || "";
    }
  }, [contentRef]);

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

  // Create a sorted list of threads that maps to sorted list of annotations
  // threadRefs[i] will always map to annotationsSortedByY[i] and vice versa
  useEffect(() => {
    setThreadRefs((refs) =>
      Array(annotationsSortedByY.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef())
    );
  }, [annotationsSortedByY.length]);

  // Move things around when a particular annotation is selected.
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
          window.scrollTo({
            top: anchorOffsetTop - 100,
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedThreadId]);

  // When a resize happens, we want to how to render annotations. i.e. drawer, sidebar, inline
  useEffect(() => {
    if (!contentRef.current) return;

    const _handleResize = debounce(() => {
      const rect = contentRef.current.getBoundingClientRect();
      const rightMarginWidth = window.innerWidth - (rect.x + rect.width);
      const sidebarWidth =
        config.annotation.sidebarCommentWidth + config.annotation.sidebarBuffer;

      if (rightMarginWidth >= sidebarWidth) {
        setRenderCommentsAs("sidebar");
      } else if (
        rightMarginWidth < sidebarWidth &&
        window.innerWidth >= breakpoints.xsmall.int
      ) {
        setRenderCommentsAs("inline");
      } else {
        setRenderCommentsAs("drawer");
      }

      _drawAnnotations({
        threads: commentThreads.current,
      });
    }, 1000);

    _handleResize();
    window.addEventListener("resize", _handleResize);

    return () => {
      _handleResize.cancel();
      window.removeEventListener("resize", _handleResize);
    };
  }, [contentRef]);

  // Handle click event.
  // Since click events happen in a canvas, we need to detect a user's click x,y coordinates and determine
  // what elment was clicked.
  useEffect(() => {
    const _handleClick = (event) => {
      if (selectionXRange) {
        return;
      }

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

      if (positionFromUrl) {
        setPositionFromUrl(null);
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, [annotationsSortedByY, positionFromUrl, selectionXRange]);

  // If a serialized position to an annotation is shared via the URL, we want to unserialize it and scroll
  // the user to its position.
  useEffect(() => {
    if (contentRef.current && window.location.hash.length > 0) {
      const hashPairs = window.location.hash.split("&");
      const selectionIdx = hashPairs.findIndex((pair) =>
        pair.includes("selection")
      );

      if (selectionIdx > -1) {
        let MAX_ATTEMPTS_REMAINING = 5; // Since the page is in transition, we want to retry x number of times
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
            _scrollToAnnotation({ annotation });
          }

          MAX_ATTEMPTS_REMAINING--;
        }, 1000);
      }
    }
  }, [contentRef]);

  const _scrollToAnnotation = ({
    annotation,
  }: {
    annotation: AnnotationType;
  }) => {
    if (annotation) {
      const relativeElOffsetTop =
        window.scrollY + contentRef.current.getBoundingClientRect().y;
      const anchorOffsetTop =
        relativeElOffsetTop + annotation.anchorCoordinates[0].y;

      window.scrollTo({
        top: anchorOffsetTop - 100,
        behavior: "smooth",
      });
    }
  };

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

    const selectedText = selectionXRange.textContent();
    if (selectedText.length > config.annotation.maxSelectionChars) {
      dispatch(
        setMessage(
          `Selected text is too long. Select text less than ${config.annotation.maxSelectionChars} characters long.`
        )
      );
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      return;
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

  const WrapperEl =
    renderCommentsAs === "drawer" ? CommentDrawer : React.Fragment;
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
          onFetchMore: () => null, // Not applicable in this context
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

        {/* @ts-ignore */}
        <WrapperEl
          isOpen={Boolean(selectedThreadId)}
          handleClose={() => setSelectedThreadId(null)}
        >
          <div className={css(styles.avatarsContainer)}>
            {annotationsSortedByY.map((annotation, idx) => {
              const threadId = String(annotation.threadId);
              const showAvatarAlongBorder =
                renderCommentsAs === "inline" ? true : false;
              const avatarPosition = `translate(-25px, ${annotation.anchorCoordinates[0].y}px)`;
              const isFocused = threadId === selectedThreadId;

              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedThreadId(threadId);
                  }}
                  key={`avatar-for-` + threadId}
                  style={{
                    transform: avatarPosition,
                    display: isFocused ? "none" : "block",
                  }}
                >
                  {showAvatarAlongBorder && (
                    <div className={css(styles.avatarWrapper)}>
                      <AuthorAvatar
                        author={
                          commentThreads?.current[threadId]?.comments[0]
                            .createdBy.authorProfile
                        }
                        size={25}
                        trueSize={true}
                        disableLink
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            className={css(
              styles.commentsContainer,
              renderCommentsAs === "sidebar" && styles.sidebarContainer,
              renderCommentsAs === "inline" && styles.inlineContainer,
              renderCommentsAs === "drawer" && styles.drawerContainer
            )}
          >
            {annotationsSortedByY.map((annotation, idx) => {
              const threadId = String(annotation.threadId);
              const key = `thread-` + threadId;
              const isFocused = selectedThreadId === threadId;

              let threadPosition = "";
              if (renderCommentsAs === "inline") {
                threadPosition = `translate(${
                  annotation.anchorCoordinates[0].x
                }px, ${annotation.anchorCoordinates[0].y + 25}px)`;
              } else if (renderCommentsAs === "sidebar") {
                threadPosition = `translate(${annotation.threadCoordinates.x}px, ${annotation.threadCoordinates.y}px)`;
              }

              const isThreadVisible =
                (renderCommentsAs === "inline" && isFocused) ||
                (renderCommentsAs === "drawer" && isFocused) ||
                renderCommentsAs === "sidebar";

              return (
                <div
                  id={key}
                  ref={threadRefs[idx]}
                  style={{
                    display: isThreadVisible ? "block" : "none",
                    transform: threadPosition,
                  }}
                  className={css(
                    styles.commentThread,
                    isFocused && styles.focusedCommentThread,
                    renderCommentsAs === "sidebar" && styles.sidebarComment,
                    renderCommentsAs === "inline" && styles.inlineComment,
                    renderCommentsAs === "drawer" && styles.drawerComment
                  )}
                  key={key}
                >
                  {annotation.isNew ? (
                    <div className={css(styles.commentEditorWrapper)}>
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
                    </div>
                  ) : (
                    <AnnotationCommentThread
                      key={`${key}-thread`}
                      document={doc}
                      threadId={threadId}
                      onCancel={() => {
                        setSelectedThreadId(null);
                      }}
                      rootComment={
                        commentThreads?.current[threadId]?.comments[0] || []
                      }
                      isFocused={isFocused}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </WrapperEl>
      </CommentTreeContext.Provider>
    </div>
  );
};

const styles = StyleSheet.create({
  commentsContainer: {},
  avatarsContainer: {
    position: "absolute",
    right: -15,
  },
  sidebarContainer: {
    position: "absolute",
    right: -15,
  },
  focusedCommentThread: {
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.2)",
  },
  inlineContainer: {},
  drawerContainer: {},
  sidebarComment: {
    width: config.annotation.sidebarCommentWidth,
    position: "absolute",
  },
  inlineComment: {
    width: config.annotation.inlineCommentWidth,
    position: "absolute",
  },
  drawerComment: {},
  commentThread: {
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    cursor: "pointer",
    transition: "transform 0.4s ease",
    background: "white",
    boxSizing: "border-box",
  },
  commentEditor: {
    boxShadow: "none",
    padding: 0,
  },
  commentEditorWrapper: {
    padding: 10,
  },
  avatarWrapper: {
    position: "absolute",
    background: "white",
    padding: 5,
    borderRadius: "50% 50% 50% 0%",
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.2)",
    border: `1px solid white`,
    ":hover": {
      background: "#EDEDED",
      transition: "0.2s",
      border: `1px solid #999`,
    },
  },
});

export default AnnotationLayer;
