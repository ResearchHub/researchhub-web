import { StyleSheet, css } from "aphrodite";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { breakpoints } from "~/config/themes/screen";
import DocumentControls from "~/components/Document/DocumentControls";
import DocumentExpandedNav from "~/components/Document/DocumentExpandedNav";
import { zoomOptions } from "~/components/Document/lib/PDFViewer/config";
import { ContentInstance, GenericDocument } from "./lib/types";
import throttle from "lodash/throttle";
import { LEFT_SIDEBAR_MAX_WIDTH } from "../Home/sidebar/RootLeftSidebar";
import DocumentPlaceholder from "./lib/Placeholders/DocumentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faSpinnerThird,
} from "@fortawesome/pro-light-svg-icons";
import {
  Comment as CommentType,
  CommentThreadGroup,
  CommentPrivacyFilter,
} from "../Comment/lib/types";
import config from "./lib/config";
import DocumentViewerContext, {
  Page,
  VisibilityPreferenceForViewingComments,
  ViewerContext,
} from "./lib/DocumentViewerContext";
import { useRouter } from "next/router";
import colors from "~/config/themes/colors";
import UploadFileDragAndDrop from "../UploadFileDragAndDrop";
import { useReferenceActiveProjectContext } from "../ReferenceManager/references/reference_organizer/context/ReferenceActiveProjectContext";
import { useOrgs } from "../contexts/OrganizationContext";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { updateReferenceCitationFile } from "../ReferenceManager/references/api/updateReferenceCitation";
import { useReferencesTableContext } from "../ReferenceManager/references/reference_table/context/ReferencesTableContext";

const AnnotationLayer = dynamic(
  () => import("~/components/Comment/modules/annotation/AnnotationLayer")
);
const PDFViewer = dynamic(() => import("./lib/PDFViewer/_PDFViewer"), {
  ssr: false,
});

export type ZoomAction = {
  isExpanded: boolean;
  zoom: number;
  newWidth: number;
};

type Props = {
  postHtml?: string;
  pdfUrl?: string | null;
  onZoom?: Function;
  viewerWidth?: number;
  citationInstance?: ContentInstance;
  documentInstance?: ContentInstance;
  document?: GenericDocument | null;
  expanded?: boolean;
  hasError?: boolean;
  onClose?: Function;
  showExpandBtn?: boolean;
  isPost?: boolean;
  expandedOnlyMode?: boolean;
  setReferenceItemDatum?: (datum) => void;
  referenceItemDatum?: any;
  documentViewerClass?: any;
  withControls?: boolean;
  allowAnnotations?: boolean;
};

const DocumentViewer = ({
  postHtml,
  onZoom,
  viewerWidth = config.width,
  pdfUrl,
  isPost,
  citationInstance,
  documentInstance,
  document: doc,
  expanded = false,
  hasError = false,
  showExpandBtn = true,
  onClose,
  expandedOnlyMode = false,
  setReferenceItemDatum,
  referenceItemDatum,
  documentViewerClass,
  withControls = true,
  allowAnnotations = true,
}: Props) => {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const [isExpanded, setIsExpanded] = useState<boolean>(
    expandedOnlyMode || expanded
  );
  const [numAnnotations, setNumAnnotations] = useState<number>(0);
  const contentRef = useRef(null);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [hasLoadError, setHasLoadError] = useState<boolean>(hasError);
  const [fullScreenSelectedZoom, setFullScreenSelectedZoom] =
    useState<number>(1.25);
  const [selectedZoom, setSelectedZoom] = useState<number>(1);
  const [isPdfReady, setIsPdfReady] = useState<boolean>(false);
  const [viewerContext, setViewerContext] = useState<ViewerContext>(
    ViewerContext.GENERIC
  );
  const [numPagesToPreload, setNumPagesToPreload] = useState<number>(
    config.numPdfPagesToPreload
  );
  const [lastPageRendered, setLastPageRendered] = useState<Page>({
    pageNumber: 0,
  });

  const defaultPrivacyFilter = documentInstance ? "PUBLIC" : "WORKSPACE";

  const [
    visibilityPreferenceForNewComment,
    setVisibilityPreferenceForNewComment,
  ] = useState<CommentPrivacyFilter>(defaultPrivacyFilter);
  const [
    visibilityPreferenceForViewingComments,
    setVisibilityPreferenceForViewingComments,
  ] = useState<VisibilityPreferenceForViewingComments>(defaultPrivacyFilter);
  const { setOpenedTabs, openedTabs } = useReferencesTableContext();

  const { activeProject } = useReferenceActiveProjectContext();

  const { currentOrg } = useOrgs();

  const [windowDimensions, setWindowDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const onPdfReady = ({ numPages }) => {
    setIsPdfReady(true);
  };

  const throttledSetDimensions = useCallback(
    throttle(() => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 1000),
    []
  );

  useEffect(() => {
    if (window.innerWidth < breakpoints.small.int) {
      setFullScreenSelectedZoom(1.0);
    }
  }, []);

  useEffect(() => {
    throttledSetDimensions();
    window.addEventListener("resize", throttledSetDimensions);

    return () => {
      throttledSetDimensions.cancel();
      window.removeEventListener("resize", throttledSetDimensions);
    };
  }, []);

  useEffect(() => {
    let viewerContext = ViewerContext.GENERIC;
    const isPost = ["post"].includes(router.pathname.split("/")[1]);
    const isPaper = ["paper"].includes(router.pathname.split("/")[1]);
    if (isPost || isPaper) {
      viewerContext = ViewerContext.DOCUMENT_PAGE;
    } else if (citationInstance) {
      viewerContext = ViewerContext.REF_MANAGER;
    }
    setViewerContext(viewerContext);
  }, [router.isReady]);

  useEffect(() => {
    if (isExpanded) {
      document.documentElement.style.setProperty(
        "--zoom-multiplier",
        String(fullScreenSelectedZoom)
      );
    } else {
      document.documentElement.style.setProperty(
        "--zoom-multiplier",
        String(selectedZoom)
      );
    }
  }, [isExpanded, fullScreenSelectedZoom, selectedZoom]);

  function handleZoomIn() {
    if (isExpanded) {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === fullScreenSelectedZoom
      );
      const isLastOption = currentIdx === zoomOptions.length - 1;
      if (isLastOption) {
        return;
      }

      const newZoom = zoomOptions[currentIdx + 1].value;
      setFullScreenSelectedZoom(newZoom);
      onZoom &&
        onZoom({
          isExpanded: true,
          zoom: newZoom,
          newWidth: viewerWidth * newZoom,
        } as ZoomAction);
    } else {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === selectedZoom
      );
      const isLastOption = currentIdx === zoomOptions.length - 1;
      if (isLastOption) {
        return;
      }

      const newZoom = zoomOptions[currentIdx + 1].value;
      setSelectedZoom(newZoom);
      onZoom &&
        onZoom({
          isExpanded: false,
          zoom: newZoom,
          newWidth: viewerWidth * newZoom,
        } as ZoomAction);
    }
  }
  function handleZoomOut() {
    if (isExpanded) {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === fullScreenSelectedZoom
      );
      const isFirstOption = currentIdx === 0;
      if (isFirstOption) {
        return;
      }
      const newZoom = zoomOptions[currentIdx - 1].value;
      setFullScreenSelectedZoom(newZoom);
      onZoom &&
        onZoom({
          isExpanded: true,
          zoom: newZoom,
          newWidth: viewerWidth * newZoom,
        } as ZoomAction);
    } else {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === selectedZoom
      );
      const isFirstOption = currentIdx === 0;
      if (isFirstOption) {
        return;
      }
      const newZoom = zoomOptions[currentIdx - 1].value;
      setSelectedZoom(newZoom);
      onZoom &&
        onZoom({
          isExpanded: false,
          zoom: newZoom,
          newWidth: viewerWidth * newZoom,
        } as ZoomAction);
    }
  }

  function handleZoomSelection(zoomOption: any) {
    const newZoom = zoomOptions.find(
      (z) => z.value === zoomOption.value
    )!.value;
    if (isExpanded) {
      onZoom &&
        onZoom({
          isExpanded: true,
          zoom: newZoom,
          newWidth: viewerWidth * newZoom,
        } as ZoomAction);
      setFullScreenSelectedZoom(newZoom);
    } else {
      onZoom &&
        onZoom({
          isExpanded: false,
          zoom: newZoom,
          newWidth: viewerWidth * newZoom,
        } as ZoomAction);
      setSelectedZoom(newZoom);
    }
  }

  function onCommentsFetched({
    threads,
    comments,
    urlPosition,
  }: {
    threads: { [threadId: string]: CommentThreadGroup };
    comments: CommentType[];
    urlPosition: any;
  }) {
    let furthestPageToPreload = config.numPdfPagesToPreload;

    if (
      urlPosition?.pageNumber &&
      urlPosition?.pageNumber > furthestPageToPreload
    ) {
      furthestPageToPreload = urlPosition?.pageNumber;
    }

    comments.forEach((comment) => {
      const commentPageNum = comment?.thread?.anchor?.pageNumber || 1;

      if (commentPageNum > furthestPageToPreload) {
        furthestPageToPreload = commentPageNum;
      }
    });

    setNumPagesToPreload(furthestPageToPreload);
  }

  // TODO: Update this. Will probably need to create a DocumentViewer Context
  const actualContentWidth = isExpanded
    ? viewerWidth * fullScreenSelectedZoom
    : viewerWidth * selectedZoom;
  const actualZoom = isExpanded ? fullScreenSelectedZoom : selectedZoom;
  const shouldScroll =
    actualContentWidth > windowDimensions.width - LEFT_SIDEBAR_MAX_WIDTH;

  const uploadPDF = (acceptedFiles: File[] | any[]): void => {
    setUploadingPdf(true);

    updateReferenceCitationFile({
      orgId: currentOrg?.id,
      payload: {
        // TODO: calvinhlee - create utily functions to format these
        citation_id: referenceItemDatum.id,
        organization: currentOrg?.id,
        attachment: acceptedFiles[0],
      },
      onError: (e): void => {
        console.log(e);
        setUploadingPdf(false);
      },
      onSuccess: (res): void => {
        setReferenceItemDatum &&
          setReferenceItemDatum({
            ...referenceItemDatum,
            attachment: URL.createObjectURL(acceptedFiles[0]),
          });
        setUploadingPdf(false);
        const newOpenedTabs = openedTabs.map((tab) => {
          if (referenceItemDatum.id === tab.id) {
            tab.attachment = URL.createObjectURL(acceptedFiles[0]);
          }
          return tab;
        });

        setOpenedTabs(newOpenedTabs);
      },
    });
  };

  return (
    <DocumentViewerContext.Provider
      value={{
        onPageRender: setLastPageRendered,
        lastPageRendered,
        setVisibilityPreferenceForViewingComments,
        visibilityPreferenceForViewingComments,
        setVisibilityPreferenceForNewComment,
        visibilityPreferenceForNewComment,
        setNumAnnotations,
        numAnnotations,
        documentInstance,
        document: doc,
        viewerContext,
      }}
    >
      <div
        className={css(
          styles.documentViewer,
          documentViewerClass,
          isExpanded && styles.expandedWrapper
        )}
      >
        {isExpanded && (
          <DocumentExpandedNav
            pdfUrl={pdfUrl}
            documentInstance={documentInstance}
            expandedOnlyMode={expandedOnlyMode}
            handleClose={() => {
              onClose && onClose();
              setIsExpanded(false);
            }}
          />
        )}
        <div
          className={css(
            styles.main,
            isExpanded && styles.expandedContent,
            shouldScroll && styles.scroll,
            !pdfUrl && !isPost && styles.mainFileMissing
          )}
          style={{
            maxWidth: actualContentWidth,
          }}
        >
          {hasLoadError ? (
            <div className={css(styles.error)}>
              <FontAwesomeIcon
                icon={faCircleExclamation}
                style={{ fontSize: 44 }}
              />
              <span style={{ fontSize: 22 }}>
                There was an error loading this page.
              </span>
            </div>
          ) : (
            <>
              {allowAnnotations &&
                visibilityPreferenceForViewingComments !== "OFF" &&
                process.browser && (
                  <AnnotationLayer
                    documentInstance={documentInstance}
                    citationInstance={citationInstance}
                    contentRef={contentRef}
                    onFetch={onCommentsFetched}
                  />
                )}

              {!postHtml ? (
                <>
                  {pdfUrl ? (
                    <>
                      {!isPdfReady && <DocumentPlaceholder />}

                      <PDFViewer
                        pdfUrl={pdfUrl}
                        scale={actualZoom}
                        onReady={onPdfReady}
                        contentRef={contentRef}
                        viewerWidth={actualContentWidth}
                        onLoadError={setHasLoadError}
                        onPageRender={setLastPageRendered}
                        numPagesToPreload={numPagesToPreload}
                        showWhenLoading={
                          <div style={{ padding: 20 }}>
                            <DocumentPlaceholder />
                          </div>
                        }
                      />
                    </>
                  ) : (
                    <div className={css(styles.uploadFile)}>
                      <UploadFileDragAndDrop
                        children={
                          uploadingPdf ? (
                            <FontAwesomeIcon
                              icon={faSpinnerThird}
                              spin
                              style={{ fontSize: 30 }}
                            />
                          ) : (
                            ""
                          )
                        }
                        accept={".pdf"}
                        beforeImageInstructions={
                          <h3 className={css(styles.uploadFileTitle)}>
                            Upload your pdf
                          </h3>
                        }
                        // extraInstructions={
                        //   <div className={css(styles.extraInstructions)}>
                        //     We weren't able to fetch the PDF
                        //   </div>
                        // }
                        handleFileDrop={
                          uploadPDF
                          // formattedReferenceRows.length === 0
                          //   ? handleFileDrop
                          //   : silentEmptyFnc
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {!postHtml && <DocumentPlaceholder />}
                  <div
                    ref={contentRef}
                    id="postBody"
                    className={css(styles.postBody) + " rh-post"}
                    dangerouslySetInnerHTML={{ __html: postHtml! }}
                  />
                </>
              )}

              {withControls && (
                <DocumentControls
                  handleFullScreen={() => {
                    if (isExpanded) {
                      onClose && onClose();
                      setIsExpanded(false);
                    } else {
                      setIsExpanded(true);
                    }
                  }}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  handleZoomSelection={handleZoomSelection}
                  currentZoom={
                    isExpanded ? fullScreenSelectedZoom : selectedZoom
                  }
                  showExpand={showExpandBtn}
                  isExpanded={isExpanded}
                />
              )}
            </>
          )}
        </div>
      </div>
    </DocumentViewerContext.Provider>
  );
};

const styles = StyleSheet.create({
  main: {
    position: "relative",
    justifyContent: "center",
    width: "100%",
  },
  scroll: {
    overflowX: "scroll",
    overflowY: "hidden",
  },
  uploadFileTitle: {
    fontWeight: 500,
  },
  extraInstructions: {
    marginBottom: 8,
  },
  expandedWrapper: {
    position: "fixed",
    zIndex: 999999,
    top: 0,
    right: 0,
    background: "rgb(230, 230, 230, 1.0)",
    width: "100%",
    height: "100%",
    marginTop: 0,
    overflow: "auto",
  },
  uploadFile: {
    height: "100%",
    paddingTop: 16,
  },
  expandedContent: {
    background: "white",
    margin: "75px auto 0 auto",
  },
  mainFileMissing: {
    height: "80%",
  },
  documentViewer: {},
  postBody: {
    paddingRight: 25,
    color: colors.GREY_TEXT(1.0),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 0,
    },
  },
  postHeader: {
    marginBottom: 45,
  },
  error: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    rowGap: "15px",
    justifyContent: "center",
    paddingTop: "35%",
  },
});

export default DocumentViewer;
