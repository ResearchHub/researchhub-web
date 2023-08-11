import { StyleSheet, css } from "aphrodite";
import React, {
  createRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Comment as CommentModel,
  CommentThreadGroup,
  parseComment,
  COMMENT_FILTERS,
  COMMENT_TYPES,
  COMMENT_CONTEXTS,
  groupByThread,
  CommentPrivacyFilter,
} from "../../lib/types";
import {
  Annotation as AnnotationType,
  SerializedAnchorPosition,
} from "./lib/types";
import { createCommentAPI, fetchCommentsAPI } from "../../lib/api";
import {
  GenericDocument,
  ApiDocumentType,
  ContentInstance,
} from "../../../Document/lib/types";
import XRange from "./lib/xrange/XRange";
import colors from "../../lib/colors";
import TextSelectionMenu from "../../TextSelectionMenu";
import useSelection, {
  Selection,
} from "~/components/Comment/modules/annotation/lib/useSelection";
import config from "../../lib/config";
import CommentEditor from "../../CommentEditor";
import { captureEvent } from "~/config/utils/events";
import { CommentTreeContext } from "../../lib/contexts";
import { sortOpts } from "../../lib/options";
import AnnotationCommentThread from "./AnnotationCommentThread";
import Annotation from "./Annotation";
import repositionAnnotations, {
  resetPositions,
} from "./lib/repositionAnnotations";
import createLinkToSelection from "./lib/createLinkToSelection";
import XPathUtil from "./lib/xrange/XPathUtil";
import CommentDrawer from "../../CommentDrawer";
import { breakpoints } from "~/config/themes/screen";
import throttle from "lodash/throttle";
import { useDispatch, useSelector } from "react-redux";
import { MessageActions } from "~/redux/message";
import CommentAvatars from "../../CommentAvatars";
import flattenComments from "../../lib/flattenComments";
import removeComment from "../../lib/removeComment";
import replaceComment from "../../lib/replaceComment";
import findComment from "../../lib/findComment";
import { isEmpty, localWarn } from "~/config/utils/nullchecks";
import {
  ID,
  RHUser,
  RhDocumentType,
  parseUser,
} from "~/config/types/root_types";
import { RootState } from "~/redux";
import ContentSupportModal from "~/components/Modals/ContentSupportModal";
import { Purchase } from "~/config/types/purchase";
import {
  annotationToSerializedAnchorPosition,
  createAnnotation,
  selectionToSerializedAnchorPosition,
  urlSelectionToAnnotation,
} from "./lib/selection";
import getAnnotationFromPosition from "./lib/getAnnotationFromPosition";
import AnnotationTextBubble from "./AnnotationTextBubble";
import useCacheControl from "~/config/hooks/useCacheControl";
import { useOrgs } from "~/components/contexts/OrganizationContext";

const { setMessage, showMessage } = MessageActions;
const DEBUG = true;

interface Props {
  contentRef: any;
  citationInstance?: ContentInstance;
  documentInstance?: ContentInstance;
  pageRendered: { pageNum: number }; // The last page rendered
  displayPreference: "all" | "mine" | "none";
  onFetch?: (commentThreads) => void;
}

const AnnotationLayer = ({
  contentRef,
  citationInstance,
  documentInstance,
  displayPreference,
  pageRendered = { pageNum: 0 },
  onFetch,
}: Props) => {
  const [inlineComments, setInlineComments] = useState<CommentModel[]>([]);

  // Sorted List of annotations sorted by order of appearance on the page
  const [annotationsSortedByY, setAnnotationsSortedByY] = useState<
    AnnotationType[]
  >([]);

  // Used to get the latest reference to annotationsSortedByY without triggering a re-render
  const annotationsSortedByYRef = useRef<AnnotationType[]>([]);

  // Orphans are annotations that could not be found on page
  const [orphanThreadIds, setOrphanThreadIds] = useState<string[]>([]);
  const orphanThreadIdsRef = useRef<string[]>([]);
  // An interval used to periodically check for orphans on the page.
  const orphanSearchIntervalRef = useRef<any>(null);

  // Holds information about new comments that have not yet been committed.
  const newCommentDataRef = useRef<{
    [key: string]: { isEmpty: boolean; content: any };
  }>({});

  // Setting this to true will redraw the annotations on the page.
  const [needsRedraw, setNeedsRedraw] = useState<
    { drawMode: "SKIP_EXISTING" | "ALL" } | false
  >(false);

  const [firstDrawComplete, setFirstDrawComplete] = useState<boolean>(false);

  const throttledSetNeedsRedraw = useCallback(
    throttle((value) => {
      setNeedsRedraw(value);
    }, 1000),
    [setNeedsRedraw]
  );

  // Holds range selction data initiated by user
  const selection = useSelection({
    contentRef: contentRef,
  });

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const selectedThreadIdRef = useRef<string | null>(null);
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null);
  const [currentPrivacyFilter, setCurrentPrivacyFilter] =
    useState<CommentPrivacyFilter>("PRIVATE");

  // Holds xpath about a particular text-range annotation that is shared via URL
  const [positionFromUrlAsAnnotation, setPositionFromUrlAsAnnotation] =
    useState<AnnotationType | null>(null);
  const serializedPositionFromUrl = useRef<any | null>(null);

  // Indicates whether inline comments were fetched
  const didFetchComplete = useRef<boolean>(false);
  // onFetch callback has been called
  const onFetchAlreadyInvoked = useRef<boolean>(false);

  const [threadRefs, setThreadRefs] = useState<any[]>([]);
  const threadRefsRef = useRef<any[]>([]);
  const commentThreads = useRef<{ [threadId: string]: CommentThreadGroup }>({});
  const uncomittedCommentThreads = useRef<{
    [threadId: string]: CommentThreadGroup;
  }>({});
  const textSelectionMenuRef = useRef<HTMLDivElement>(null);
  const windowDimensions = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const currentContext = citationInstance
    ? COMMENT_CONTEXTS.REF_MANAGER
    : COMMENT_CONTEXTS.ANNOTATION;
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const { revalidateDocument } = useCacheControl();
  const { currentOrg } = useOrgs();

  // Scroll to annotation only after it has been rendered
  useLayoutEffect(() => {
    const [key, value] = window.location.hash.split("=");

    if (key === "#threadId") {
      const renderedAnnotation = annotationsSortedByY.find(
        (annotation) => annotation.threadId === value
      );
      if (renderedAnnotation) {
        _scrollToAnnotation({ annotation: renderedAnnotation });
      }
    } else if (key === "#selection" && positionFromUrlAsAnnotation) {
      _scrollToAnnotation({ annotation: positionFromUrlAsAnnotation });
    }
  }, [annotationsSortedByY, selectedThreadId, positionFromUrlAsAnnotation]);

  // Observe changes to the URL hash (.e.g. link is clickd on)
  useEffect(() => {
    const handleHashChange = () => {
      const [key, value] = window.location.hash.split("=");

      if (key === "#threadId") {
        setSelectedThreadId(value);
      } else if (key === "#selection") {
        try {
          serializedPositionFromUrl.current = JSON.parse(
            decodeURIComponent(value)
          );
        } catch (error) {
          console.log(
            "Failed to parse selection from URL",
            value,
            "error was:",
            error
          );
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange, false);

    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);

  // Fetch comments from API and group them
  useEffect(() => {
    const _fetchComments = async ({
      contentInstance,
      privacyType,
    }: {
      contentInstance: ContentInstance;
      privacyType: CommentPrivacyFilter;
    }) => {
      return fetchCommentsAPI({
        documentId: contentInstance.id,
        filter: COMMENT_FILTERS.ANNOTATION,
        sort: "CREATED_DATE",
        ascending: true,
        documentType: contentInstance.type,
        // For annotations, we want a very large page size because there is no "load more" UI button
        childPageSize: 10000,
        pageSize: 10000,
        privacyType,
      });
    };

    (async () => {
      const promises: Promise<{ comments: any[]; count: number }>[] = [];
      if (citationInstance) {
        promises.push(
          _fetchComments({
            contentInstance: citationInstance,
            privacyType: "PRIVATE",
          })
        );
        promises.push(
          _fetchComments({
            contentInstance: citationInstance,
            privacyType: "WORKSPACE",
          })
        );
      }
      if (documentInstance) {
        promises.push(
          _fetchComments({
            contentInstance: documentInstance,
            privacyType: "PUBLIC",
          })
        );
      }

      Promise.all(promises)
        .then((results) => {
          const { comments, count } = results.reduce(
            (acc, result) => {
              const _comments = result.comments.map((raw) =>
                parseComment({ raw })
              );

              return {
                comments: [...acc.comments, ..._comments],
                count: acc.count + result.count,
              };
            },
            { comments: [], count: 0 }
          );

          setInlineComments(comments);
        })
        .finally(() => {
          didFetchComplete.current = true;
        });
    })();

    _setWindowDimensions();
  }, []);

  // Once we have comments, we want to group them by threads and draw them on the page
  useEffect(() => {
    const _comments = inlineComments.filter((comment) => {
      if (displayPreference === "all" || !displayPreference) return true;
      if (displayPreference === "mine") {
        return comment.createdBy.id === currentUser?.id;
      }
      return false;
    });

    const _commentThreads = groupByThread(_comments);
    commentThreads.current = _commentThreads;

    throttledSetNeedsRedraw({ drawMode: "SKIP_EXISTING" });

    if (didFetchComplete.current && !onFetchAlreadyInvoked.current) {
      onFetch &&
        onFetch({
          comments: inlineComments,
          threads: commentThreads.current,
          urlPosition: serializedPositionFromUrl.current,
        });
      onFetchAlreadyInvoked.current = true;
    }
  }, [inlineComments, displayPreference]);

  // Draw annotation as pages are rendered
  useEffect(() => {
    throttledSetNeedsRedraw({ drawMode: "ALL" });
    _findAndReconcileOrphans();

    return () => {
      if (orphanSearchIntervalRef.current !== null) {
        clearInterval(orphanSearchIntervalRef.current);
        orphanSearchIntervalRef.current = null;
      }
    };
  }, [pageRendered]);

  useEffect(() => {
    if (needsRedraw) {
      const { orphanThreadIds: nextOrphanThreadIds, foundAnnotations } =
        _drawAnnotations({
          annotationsSortedByY: annotationsSortedByYRef.current,
          threads: commentThreads.current,
          uncomittedCommentThreads: uncomittedCommentThreads.current,
          drawingMode: needsRedraw?.drawMode,
        });

      _setOrphans(nextOrphanThreadIds);
      setNeedsRedraw(false);
      _setAnnotations(foundAnnotations);

      const repositioned = repositionAnnotations({
        annotationsSortedByY: annotationsSortedByYRef.current,
        selectedThreadId,
        threadRefs,
      });

      const updated = _replaceAnnotations({
        existing: annotationsSortedByYRef.current,
        replaceWith: repositioned,
      });

      _setAnnotations(updated);

      // If position from URL is set, we want to draw it as well
      if (serializedPositionFromUrl.current) {
        try {
          const annotation = urlSelectionToAnnotation({
            urlSelection: serializedPositionFromUrl.current,
            relativeEl: contentRef.current,
          });

          if (annotation) {
            setPositionFromUrlAsAnnotation(annotation);
          }
        } catch (error) {}
      }

      if (!firstDrawComplete) {
        setFirstDrawComplete(true);
      }
    }
  }, [needsRedraw]);

  // Observe dimension changes for each of the threads.
  // If position has changed, recalculate.
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const repositioned = repositionAnnotations({
        annotationsSortedByY: annotationsSortedByYRef.current,
        selectedThreadId,
        threadRefs,
      });

      const updated = _replaceAnnotations({
        existing: annotationsSortedByYRef.current,
        replaceWith: repositioned,
      });

      _setAnnotations(updated);
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
    setThreadRefs((refs) => {
      const next = Array(annotationsSortedByY.length)
        .fill(null)
        .map((_, i) => refs[i] || createRef());

      threadRefsRef.current = next;
      return next;
    });
  }, [annotationsSortedByY.length]);

  // Move things around when a particular annotation is selected.
  useEffect(() => {
    const repositioned = repositionAnnotations({
      annotationsSortedByY: annotationsSortedByYRef.current,
      selectedThreadId,
      threadRefs,
    });

    const updated = _replaceAnnotations({
      existing: annotationsSortedByYRef.current,
      replaceWith: repositioned,
    });

    _setAnnotations(updated);

    if (selectedThreadId && renderingMode === "sidebar") {
      const selectedAnnotation = annotationsSortedByYRef.current.find(
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

    const _handleResize = throttle(() => {
      throttledSetNeedsRedraw({ drawMode: "ALL" });
      _setWindowDimensions();
    }, 500);

    window.addEventListener("resize", _handleResize);

    return () => {
      _handleResize.cancel();
      window.removeEventListener("resize", _handleResize);
    };
  }, [contentRef, annotationsSortedByY]);

  // When the contentRef changes in size, we want to redraw annotations
  useEffect(() => {
    const _handleResize = () => {
      throttledSetNeedsRedraw({ drawMode: "ALL" });
    };

    const resizeObserver = new ResizeObserver((entries) => {
      _handleResize();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
    };
  }, [contentRef]);

  // Handle click event.
  // Since click events happen in a canvas, we need to detect a user's click x,y coordinates and determine
  // what elment was clicked.
  useEffect(() => {
    const _handleClick = (event) => {
      if (selection.xrange || !window.getSelection()?.isCollapsed) {
        return;
      }

      const clickX = event.clientX;
      const clickY = event.clientY;
      let selectedAnnotation = getAnnotationFromPosition({
        x: clickX,
        y: clickY,
        contentRef,
        annotations: annotationsSortedByYRef.current,
      });

      if (!selectedAnnotation) {
        for (let i = 0; i < annotationsSortedByYRef.current.length; i++) {
          const ref = threadRefs[i]?.current;

          if (ref) {
            const rect = ref.getBoundingClientRect();
            if (
              clickX >= rect.left &&
              clickX <= rect.right &&
              clickY >= rect.top &&
              clickY <= rect.bottom
            ) {
              selectedAnnotation = annotationsSortedByYRef.current[i];
              continue;
            }
          }
        }
      }

      if (selectedAnnotation) {
        _setSelectedThreadId(selectedAnnotation.threadId);
      } else {
        _setSelectedThreadId(null);

        // Clear new annotations that are empty
        Object.keys(newCommentDataRef.current).forEach((newCommentId) => {
          const newComment = newCommentDataRef.current[newCommentId];

          if (newComment.isEmpty) {
            _purgeComment({ threadId: newCommentId });
          }
        });

        // Reset positions to original
        const nextAnnotationsSortedByY = resetPositions({
          annotationsSortedByY: annotationsSortedByYRef.current,
        });

        const repositioned = repositionAnnotations({
          annotationsSortedByY: nextAnnotationsSortedByY,
          selectedThreadId: null,
          threadRefs: threadRefsRef.current,
        });

        for (let i = 0; i < repositioned.length; i++) {
          const repositionedIdx = nextAnnotationsSortedByY.findIndex(
            (a) => a.threadId === repositioned[i].threadId
          );

          if (repositionedIdx > -1) {
            nextAnnotationsSortedByY[repositionedIdx] = repositioned[i];
          }
        }

        _setAnnotations(nextAnnotationsSortedByY);
      }
    };

    document.addEventListener("click", _handleClick);

    return () => {
      document.removeEventListener("click", _handleClick);
    };
  }, [selection?.xrange]);

  const _purgeComment = ({ threadId }) => {
    _setAnnotations(
      annotationsSortedByYRef.current.filter(
        (annotation) => annotation.threadId !== threadId
      )
    );
    delete newCommentDataRef.current[threadId];
    delete uncomittedCommentThreads.current[threadId];
  };

  const _findAndReconcileOrphans = async () => {
    let MAX_ATTEMPTS_REMAINING = 5;

    if (orphanThreadIdsRef.current.length === 0) {
      return;
    }
    const orphanThreads = {};
    for (let i = 0; i < orphanThreadIdsRef.current.length; i++) {
      const id = orphanThreadIdsRef.current[i];
      orphanThreads[id] = commentThreads.current[id];
    }

    orphanSearchIntervalRef.current = setInterval(() => {
      if (MAX_ATTEMPTS_REMAINING === 0) {
        clearInterval(orphanSearchIntervalRef.current);
        return;
      }

      throttledSetNeedsRedraw({ drawMode: "SKIP_EXISTING" });

      MAX_ATTEMPTS_REMAINING--;
    }, 500);
  };

  const _scrollToAnnotation = ({
    annotation,
    threadId,
  }: {
    annotation?: AnnotationType | null;
    threadId?: string | null;
  }) => {
    let renderedAnnotation: AnnotationType | undefined;

    if (threadId) {
      renderedAnnotation = annotationsSortedByYRef.current.find(
        (annotation) => annotation.threadId === threadId
      );
    } else if (annotation) {
      renderedAnnotation = annotation;
    } else {
      console.warn(
        "Can't scroll to an annotation that is not rendered yet",
        annotation,
        threadId
      );
    }

    if (renderedAnnotation) {
      const relativeElOffsetTop =
        window.scrollY + contentRef.current.getBoundingClientRect().y;
      const anchorOffsetTop =
        relativeElOffsetTop + renderedAnnotation.anchorCoordinates[0].y;

      window.scrollTo(0, anchorOffsetTop - 100);
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

  const _setSelectedThreadId = (threadId: string | null) => {
    selectedThreadIdRef.current = threadId;
    setSelectedThreadId(threadId);

    const [key, value] = window.location.hash.split("=");

    if (key === "#threadId") {
      const renderedAnnotation = annotationsSortedByY.find(
        (annotation) => annotation.threadId === value
      );

      // We only want to dismiss if the annotation is rendered
      if (renderedAnnotation) {
        history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );
      }
    }
    if (key === "#selection") {
      // We only want to dismiss if the annotation is rendered
      if (positionFromUrlAsAnnotation) {
        history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );
      }
    }
  };

  const _setWindowDimensions = () => {
    windowDimensions.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const _drawAnnotations = ({
    threads,
    annotationsSortedByY,
    uncomittedCommentThreads,
    drawingMode = "SKIP_EXISTING",
  }: {
    threads: { [key: string]: CommentThreadGroup };
    uncomittedCommentThreads: { [key: string]: CommentThreadGroup };
    annotationsSortedByY: AnnotationType[];
    // If the page changes size, chances are xrange would need to be recalculated. In that case, we need ALL
    drawingMode?: "SKIP_EXISTING" | "ALL";
  }): {
    orphanThreadIds: Array<string>;
    foundAnnotations: Array<AnnotationType>;
  } => {
    if (DEBUG) {
      console.log(
        `%cDrawing anchors / Mode: ${drawingMode} `,
        "color: #F3A113; font-weight: bold;"
      );
    }

    const orphanThreadIds: Array<string> = [];
    const foundAnnotations: Array<AnnotationType> = [];

    const tryToRenderThreads = (
      threads: { [threadId: string]: CommentThreadGroup },
      isNew = false
    ) => {
      Object.values(threads).forEach((threadGroup) => {
        const existingAnnotation = annotationsSortedByY.find(
          (annotation) => annotation.threadId === threadGroup.threadId
        );

        if (existingAnnotation && drawingMode === "SKIP_EXISTING") {
          foundAnnotations.push(existingAnnotation);
        } else {
          let isOrphan = false;

          try {
            const xrange = XRange.createFromSerialized({
              serialized: threadGroup.thread.anchor,
            });

            if (!xrange) {
              throw "could not create xrange";
            }

            const annotation = createAnnotation({
              xrange,
              isNew,
              threadId: threadGroup.threadId,
              relativeEl: contentRef.current,
              serializedAnchorPosition: threadGroup.thread!
                .anchor as SerializedAnchorPosition,
            });

            foundAnnotations.push(annotation);
          } catch (error) {
            isOrphan = true;
          }

          if (isOrphan) {
            // There are many reasons why an anchor could not be found.
            // The most common ones are: 1) Page has changed structure and the xpath is no longer valid
            // and 2) The content within the page has changed from the original.

            if (DEBUG) {
              const contentElXpath =
                XPathUtil.getXPathFromNode(contentRef.current) || "";
              console.log(
                "[Annotation] No xrange found for thread. Orphan thread is:",
                threadGroup.thread,
                "start:",
                threadGroup.thread.anchor?.startContainerPath,
                "end:",
                threadGroup.thread.anchor?.endContainerPath,
                // "xpathPrefix:",
                // contentElXpath,
                "contentElFromXpath",
                XPathUtil.getNodeFromXPath(contentElXpath),
                "startNodeFromXpath",
                XPathUtil.getNodeFromXPath(
                  contentElXpath + threadGroup.thread.anchor?.startContainerPath
                )
              );
            }

            orphanThreadIds.push(threadGroup.threadId);
          }
        }
      });
    };

    tryToRenderThreads(threads, false);
    tryToRenderThreads(uncomittedCommentThreads, true);
    const foundAndSorted = _sortAnnotationsByAppearanceInPage(foundAnnotations);

    return { orphanThreadIds, foundAnnotations: foundAndSorted };
  };

  const _createNewAnnotation = ({
    event,
    selection,
  }: {
    event: any;
    selection: Selection;
  }) => {
    event.stopPropagation();

    if (selection.error) {
      dispatch(setMessage(selection.error));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));
      return;
    }

    if (!selection.xrange) {
      return console.error("No selected range. This should not happen.");
    }

    const selectedText = selection.xrange.textContent();
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
      serializedAnchorPosition: selectionToSerializedAnchorPosition({
        selection,
      }),
      relativeEl: contentRef.current,
      isNew: true,
      xrange: selection.xrange,
    });

    const _annotationsSortedByY = _sortAnnotationsByAppearanceInPage([
      ...annotationsSortedByYRef.current,
      newAnnotation,
    ]);

    const { id, type } = getContentInstanceByPrivacy({
      privacy: currentPrivacyFilter,
      documentInstance,
      citationInstance,
    });

    uncomittedCommentThreads.current[newAnnotation.threadId] = {
      thread: {
        id: newAnnotation.threadId,
        threadType: COMMENT_TYPES.ANNOTATION,
        relatedContent: {
          id,
          type,
        },
        anchor: selectionToSerializedAnchorPosition({ selection }),
      },
      comments: [],
      threadId: newAnnotation.threadId,
    };

    selection.resetSelectedPos();
    _setAnnotations(_annotationsSortedByY);
    _setSelectedThreadId(newAnnotation.threadId);
  };

  const _setAnnotations = (updatedAnnotations: AnnotationType[]) => {
    annotationsSortedByYRef.current = updatedAnnotations;
    setAnnotationsSortedByY(updatedAnnotations);
  };

  const _setOrphans = (orphanIds: string[]) => {
    setOrphanThreadIds(orphanIds);
    orphanThreadIdsRef.current = orphanIds;
  };

  const _handleCancelThread = ({ threadId, event }) => {
    const updated = annotationsSortedByY.filter(
      (annotation) => annotation.threadId !== threadId
    );

    _setAnnotations(updated);
  };

  const getContentInstanceByPrivacy = ({
    privacy,
    documentInstance,
    citationInstance,
  }: {
    privacy: CommentPrivacyFilter;
    documentInstance?: ContentInstance;
    citationInstance?: ContentInstance;
  }): ContentInstance => {
    let contentTypeId: ID;
    let contentType: RhDocumentType;

    if (privacy === "PUBLIC") {
      if (documentInstance) {
        contentTypeId = documentInstance!.id;
        contentType = documentInstance!.type;
      } else {
        throw new Error("Cannot create public annotation without document");
      }
    } else if (privacy === "PRIVATE" || privacy === "WORKSPACE") {
      if (citationInstance) {
        contentTypeId = citationInstance!.id;
        contentType = citationInstance!.type;
      } else {
        throw new Error(
          "Cannot create private/workspace annotation without citation"
        );
      }
    }

    return { id: contentTypeId!, type: contentType! };
  };

  const _handleCreateThread = async ({
    annotation,
    commentProps,
    privacy,
  }: {
    annotation: AnnotationType;
    commentProps: any;
    privacy: CommentPrivacyFilter;
  }) => {
    const { id, type } = getContentInstanceByPrivacy({
      privacy,
      documentInstance,
      citationInstance,
    });

    if (DEBUG) {
      console.log(
        "Attempting to create comment for instance type",
        type,
        "with id",
        id
      );
    }

    try {
      const serialized = annotationToSerializedAnchorPosition({
        annotation,
      });

      const comment = await createCommentAPI({
        ...commentProps,
        documentId: id,
        documentType: type,
        privacy,
        organizationId: currentOrg?.id,
        commentType: COMMENT_TYPES.ANNOTATION,
        anchor: {
          type: "text",
          position: serialized,
        },
      });

      _onCreate({ comment });
      _purgeComment({ threadId: annotation.threadId });
    } catch (error) {
      dispatch(setMessage(`Failed to create comment. Please try again.`));
      // @ts-ignore
      dispatch(showMessage({ show: true, error: true }));

      captureEvent({
        error,
        msg: "Failed to create inline comment",
        data: {
          document,
          annotation,
        },
      });
    }
  };

  const _onCreate = ({
    comment,
    parent,
  }: {
    comment: CommentModel;
    parent?: CommentModel;
  }) => {
    if (parent) {
      parent.children = [...parent.children, comment];

      replaceComment({
        prev: parent,
        next: parent,
        list: inlineComments,
      });

      setInlineComments([...inlineComments]);
    } else {
      setInlineComments([...inlineComments, comment]);
    }

    revalidateDocument();
  };

  const _onRemove = ({ comment }: { comment: CommentModel }) => {
    const found = findComment({
      id: comment.id,
      comments: inlineComments,
    });
    if (found) {
      removeComment({
        comment: found.comment,
        list: inlineComments,
      });

      setInlineComments([...inlineComments]);
    } else {
      localWarn(
        `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
      );
    }

    revalidateDocument();
  };

  const _onUpdate = ({ comment }: { comment: CommentModel }) => {
    const found = findComment({
      id: comment.id,
      comments: inlineComments,
    });
    if (found) {
      replaceComment({
        prev: found.comment,
        next: comment,
        list: inlineComments,
      });
      setInlineComments([...inlineComments]);
    } else {
      localWarn(
        `Comment ${comment.id} could was expected to be found in tree but was not. This is likely an error`
      );
    }
  };

  const _onSupport = (data: any) => {
    const found = findComment({
      id: data.object_id,
      comments: inlineComments,
    });
    if (found) {
      const updatedComment = { ...found.comment };
      const tip: Purchase = {
        amount: data.amount,
        // @ts-ignore
        createdBy: currentUser,
      };
      updatedComment.tips.push(tip);
      _onUpdate({ comment: updatedComment });
    }
  };

  const getRenderingMode = ({
    contentRef,
  }: {
    contentRef: any;
  }): "inline" | "drawer" | "sidebar" => {
    if (!contentRef.current) return "sidebar";

    const rect = contentRef.current.getBoundingClientRect();
    const rightMarginWidth = window.innerWidth - (rect.x + rect.width);
    const sidebarWidth =
      config.annotation.sidebarCommentWidth + config.annotation.sidebarBuffer;

    if (rightMarginWidth >= sidebarWidth) {
      return "sidebar";
    } else if (
      rightMarginWidth < sidebarWidth &&
      window.innerWidth >= breakpoints.xsmall.int
    ) {
      return "inline";
    } else {
      return "drawer";
    }
  };

  const _calcTextSelectionMenuPos = ({
    selectionMouseCoordinates,
    renderingMode,
    initialSelectionPosition,
  }) => {
    if (!contentRef.current)
      return { right: "unset", left: "unset", top: "unset" };

    if (renderingMode === "sidebar") {
      const containerElemOffset =
        window.scrollY + contentRef.current.getBoundingClientRect().y;
      return {
        right: 0 - config.textSelectionMenu.width / 2,
        top:
          window.scrollY -
          containerElemOffset +
          (initialSelectionPosition?.y || 0),
        left: "unset",
      };
    } else {
      return {
        right: "unset",
        top: selectionMouseCoordinates?.y || 0,
        left: selectionMouseCoordinates?.x || 0,
      };
    }
  };

  const _onNewEditorChange = ({ isEmpty, content, threadId }) => {
    newCommentDataRef.current[threadId] = { isEmpty, content };
  };

  const _handleCreateSharableLink = () => {
    createLinkToSelection({
      selection,
      context: currentContext,
      ...(documentInstance && {
        documentId: documentInstance?.id,
        documentType: documentInstance?.type,
      }),
      ...(citationInstance && { citationId: citationInstance.id }),
    });
    dispatch(setMessage(`Link copied`));
    // @ts-ignore
    dispatch(showMessage({ show: true, error: false }));
  };

  const showSelectionMenu =
    selection.xrange && selection.initialSelectionPosition;
  const renderingMode = getRenderingMode({ contentRef });
  const contentRect = contentRef.current?.getBoundingClientRect();
  const contentElOffset = contentRect?.x;

  const {
    left: menuPosLeft,
    top: menuPosTop,
    right: menuPosRight,
  } = _calcTextSelectionMenuPos({
    selectionMouseCoordinates: selection.mouseCoordinates,
    initialSelectionPosition: selection.initialSelectionPosition,
    renderingMode,
  });

  // Before rendering annotations, we want to make sure that each annotations has a comment thread associated with it.
  // Since annotationsSortedByY and commentThreads are two distinct data structures, it is important that we make sure
  // That they are in sync prior to rendering since both of these data points are needed for rendering.
  // The two could be out-of-sync for a split second when a new annotation is created or removed.
  // Maintaining two separate data structures allows us to optimize rendering.
  const _annotationsSortedByY = annotationsSortedByYRef.current.filter(
    (annotation) => {
      return (
        commentThreads.current[annotation.threadId] !== undefined ||
        uncomittedCommentThreads.current[annotation.threadId] !== undefined ||
        annotation.isNew
      );
    }
  );

  const selectedThread = selectedThreadId
    ? commentThreads?.current[selectedThreadId]
    : null;

  return (
    <div className={css(styles.annotationLayer)}>
      <ContentSupportModal
        // @ts-ignore
        onSupport={(data: any) => {
          _onSupport(data);
        }}
      />

      <div className={css(styles.anchorLayer)}>
        {_annotationsSortedByY.map((annotation) => (
          <Annotation
            key={`annotation-${annotation.threadId}`}
            annotation={annotation}
            focused={
              selectedThreadId === annotation.threadId ||
              hoveredThreadId === annotation.threadId
            }
          />
        ))}
        {positionFromUrlAsAnnotation && (
          <Annotation
            annotation={positionFromUrlAsAnnotation}
            focused={true}
            color={colors.annotation.sharedViaUrl}
          />
        )}
      </div>
      <div className={css(styles.threadsLayer)}>
        <CommentTreeContext.Provider
          value={{
            sort: sortOpts[0].value,
            filter: COMMENT_FILTERS.ANNOTATION,
            comments: inlineComments,
            citation: citationInstance,
            context: currentContext,
            onCreate: _onCreate,
            onUpdate: _onUpdate,
            onRemove: _onRemove,
            onFetchMore: () => null, // Not applicable in this context
          }}
        >
          {showSelectionMenu && (
            <div
              id="textSelectionMenu"
              style={{
                position: "absolute",
                top: menuPosTop,
                left: menuPosLeft,
                right: menuPosRight,
                width: 50,
                zIndex: 5,
              }}
              ref={textSelectionMenuRef}
            >
              <TextSelectionMenu
                isHorizontal={renderingMode !== "sidebar"}
                onCommentClick={(event) =>
                  _createNewAnnotation({
                    event,
                    selection,
                  })
                }
                onLinkClick={() => _handleCreateSharableLink()}
              />
            </div>
          )}

          <div>
            {renderingMode === "inline" && (
              <div className={css(styles.avatarsContainer)}>
                {_annotationsSortedByY.map((annotation, idx) => {
                  const threadId = String(annotation.threadId);
                  const thread = commentThreads?.current[threadId];
                  const avatarPosition = `translate(${
                    contentRect.width - 15 /* buffer */
                  }px, ${annotation.anchorCoordinates[0].y}px)`;
                  const isFocused = threadId === selectedThreadId;
                  let commentPeople: RHUser[] = [];
                  if (thread) {
                    const { comments: flatComments } = flattenComments(
                      thread.comments
                    );
                    commentPeople = flatComments.map((c) => c.createdBy);
                  }

                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        _setSelectedThreadId(threadId);
                      }}
                      key={`avatar-for-` + threadId}
                      style={{
                        transform: avatarPosition,
                        display: isFocused ? "none" : "block",
                      }}
                    >
                      <div
                        className={css(styles.avatarWrapper)}
                        onMouseEnter={() => setHoveredThreadId(threadId)}
                        onMouseLeave={() => setHoveredThreadId(null)}
                      >
                        <CommentAvatars
                          people={commentPeople}
                          withTooltip={false}
                          spacing={-20}
                          size={25}
                          maxPeople={2}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className={css(
                styles.commentsContainer,
                renderingMode === "sidebar" && styles.sidebarContainer,
                renderingMode === "inline" && styles.inlineContainer
                // renderingMode === "drawer" && styles.drawerContainer
              )}
            >
              {_annotationsSortedByY.map((annotation, idx) => {
                const threadId = String(annotation.threadId);
                const key = `thread-` + threadId;
                const isFocused = selectedThreadId === threadId;

                let threadPosition = "";
                if (renderingMode === "inline") {
                  const inlineCommentPos = {
                    x: annotation.anchorCoordinates[0].x,
                    y: annotation.anchorCoordinates[0].y + 25,
                  };
                  if (isFocused) {
                    const inlineCommentRightPos =
                      contentElOffset +
                      annotation.anchorCoordinates[0].x +
                      config.annotation.inlineCommentWidth;
                    if (
                      inlineCommentRightPos > windowDimensions.current.width
                    ) {
                      inlineCommentPos.x =
                        inlineCommentPos.x -
                        (inlineCommentRightPos -
                          windowDimensions.current.width) -
                        10;
                    }
                  }

                  threadPosition = `translate(${inlineCommentPos.x}px, ${inlineCommentPos.y}px)`;
                } else if (renderingMode === "sidebar") {
                  threadPosition = `translate(${annotation.threadCoordinates.x}px, ${annotation.threadCoordinates.y}px)`;
                }

                const isThreadVisible =
                  (renderingMode === "inline" && isFocused) ||
                  (renderingMode === "drawer" && isFocused) ||
                  renderingMode === "sidebar";

                return (
                  <div id={key} className={css(styles.commentThreadWrapper)}>
                    <div
                      ref={threadRefs[idx]}
                      style={{
                        display: isThreadVisible ? "block" : "none",
                        transform: threadPosition,
                      }}
                      className={css(
                        styles.commentThread,
                        isFocused &&
                          renderingMode !== "drawer" &&
                          styles.focusedCommentThread,
                        renderingMode === "sidebar" && styles.sidebarComment,
                        renderingMode === "inline" && styles.inlineComment,
                        renderingMode === "drawer" && styles.drawerComment,
                        annotation.isNew && styles.newCommentThread
                      )}
                      onMouseEnter={() => setHoveredThreadId(threadId)}
                      onMouseLeave={() => setHoveredThreadId(null)}
                      key={key}
                    >
                      {(renderingMode === "inline" ||
                        renderingMode === "sidebar") && (
                        <>
                          {annotation.isNew ? (
                            <div
                              className={
                                css(styles.commentEditorWrapper) +
                                " CommentEditorForAnnotation"
                              }
                            >
                              <CommentEditor
                                handleCancel={(event) =>
                                  _handleCancelThread({ threadId, event })
                                }
                                onChange={({ content, isEmpty }) =>
                                  _onNewEditorChange({
                                    threadId: annotation.threadId,
                                    content,
                                    isEmpty,
                                  })
                                }
                                allowPrivacySelection={true}
                                author={currentUser?.authorProfile}
                                focusOnMount={true}
                                editorStyleOverride={styles.commentEditor}
                                editorId={`${key}-editor`}
                                content={
                                  newCommentDataRef.current[threadId]?.content
                                }
                                handleSubmit={(commentProps) =>
                                  _handleCreateThread({
                                    annotation,
                                    commentProps,
                                    privacy: commentProps.privacy,
                                  })
                                }
                              />
                            </div>
                          ) : (
                            <AnnotationCommentThread
                              key={`${key}-thread`}
                              renderingMode={renderingMode}
                              threadId={threadId}
                              onCancel={() => {
                                _setSelectedThreadId(null);
                                setHoveredThreadId(null);
                              }}
                              rootComment={
                                commentThreads?.current[threadId]
                                  ?.comments[0] || []
                              }
                              isFocused={isFocused}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {renderingMode === "drawer" && (
            <div style={{ display: selectedThreadId ? "block" : "none" }}>
              <CommentDrawer
                handleClose={() => _setSelectedThreadId(null)}
                isOpen={Boolean(selectedThreadId)}
              >
                <>
                  {selectedThread && (
                    <>
                      <div className={css(styles.annotationTextBubbleWrapper)}>
                        <AnnotationTextBubble
                          threadId={selectedThread?.thread?.id}
                          text={selectedThread?.thread?.anchor?.text || ""}
                        />
                      </div>
                      <AnnotationCommentThread
                        renderingMode={"drawer"}
                        threadId={selectedThread.threadId}
                        onCancel={() => {
                          _setSelectedThreadId(null);
                          setHoveredThreadId(null);
                        }}
                        rootComment={selectedThread?.comments[0] || []}
                        isFocused={true}
                      />
                    </>
                  )}
                </>
              </CommentDrawer>
            </div>
          )}
        </CommentTreeContext.Provider>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  annotationLayer: {},
  anchorLayer: {
    "mix-blend-mode": "multiply",
    position: "relative",
    zIndex: 3,
  },
  threadsLayer: {
    position: "relative",
    zIndex: 3,
  },
  commentsContainer: {},
  avatarsContainer: {
    position: "absolute",
    // right: 5,
    left: 0,

    [`@media (max-width: ${breakpoints.desktop.int}px)`]: {
      left: 0,
    },
  },
  sidebarContainer: {
    position: "absolute",
    right: -15,
  },
  focusedCommentThread: {
    zIndex: 2,
    boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.2)",
    ":hover": {
      background: "white",
    },
  },
  inlineContainer: {},
  drawerContainer: {},
  annotationTextBubbleWrapper: {
    marginBottom: 15,
  },
  sidebarComment: {
    width: config.annotation.sidebarCommentWidth,
    position: "absolute",
  },
  inlineComment: {
    width: config.annotation.inlineCommentWidth,
    position: "absolute",
  },
  drawerComment: {},
  commentThreadWrapper: {},
  commentThread: {
    minHeight: 150,
    border: `1px solid ${colors.border}`,
    borderRadius: 4,
    cursor: "pointer",
    transition: "transform 0.4s ease",
    background: "white",
    boxSizing: "border-box",
    ":hover": {
      background: "rgb(250 248 248)",
    },
  },
  newCommentThread: {
    ":hover": {
      background: "white",
    },
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
