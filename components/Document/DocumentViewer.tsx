import config from "~/components/Document/lib/config";
import { StyleSheet, css } from "aphrodite";
import { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const AnnotationLayer = dynamic(
  () => import("~/components/Comment/modules/annotation/AnnotationLayer")
);
import { breakpoints } from "~/config/themes/screen";
import DocumentControls from "~/components/Document/DocumentControls";
import DocumentExpandedNav from "~/components/Document/DocumentExpandedNav";
import { zoomOptions } from "~/components/Document/lib/PDFViewer/config";
import { isPost } from "./lib/types";
import { DocumentContext } from "./lib/DocumentContext";

export type ZoomAction = {
  isExpanded: boolean;
  zoom: number;
  newWidth: number;
};

const DocumentViewer = ({ document: doc, postHtml, onZoom, viewerWidth }) => {
  const documentContext = useContext(DocumentContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const [fullScreenSelectedZoom, setFullScreenSelectedZoom] =
    useState<number>(1.25);
  const [selectedZoom, setSelectedZoom] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < breakpoints.small.int) {
      setFullScreenSelectedZoom(1.0);
    }
  }, []);

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

  function downloadPDF(pdfUrl) {
    // Create a link for our script to click
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = "download.pdf";

    // Trigger the click
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
  }

  // const fullScreenViewer = useMemo(() => {
  //   return (
  //     <div
  //       className={css(styles.expandedWrapper, isExpanded && styles.expandedOn)}
  //     >
  //       <div className={css(styles.expandedNav)}>
  //         <div
  //           onClick={() => downloadPDF(pdfUrl)}
  //           className={css(styles.downloadBtn)}
  //         >
  //           <IconButton overrideStyle={styles.viewerNavBtn}>
  //             <FontAwesomeIcon
  //               icon={faFileArrowDown}
  //               style={{ fontSize: 20 }}
  //             />
  //           </IconButton>
  //         </div>
  //         <div onClick={onFullScreenClose} className={css(styles.closeBtn)}>
  //           <IconButton overrideStyle={styles.viewerNavBtn}>
  //             <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20 }} />
  //           </IconButton>
  //         </div>
  //       </div>
  //       <div style={{ overflowY: "scroll", height: "100vh", paddingTop: 60 }}>
  //         <_PDFViewer
  //           pdfUrl={pdfUrl}
  //           viewerWidth={viewerWidth * fullScreenSelectedZoom}
  //           onLoadSuccess={onLoadSuccess}
  //           onLoadError={onLoadError}
  //           showWhenLoading={<DocumentPlaceholder />}
  //         />
  //       </div>
  //     </div>
  //   );
  // }, [isExpanded, selectedZoom, viewerWidth, fullScreenSelectedZoom]);

  const commentDisplayPreference = documentContext.preferences?.comments;
  return (
    <div
      className={css(
        styles.documentViewer,
        isExpanded && styles.expandedWrapper
      )}
    >
      {isExpanded && (
        <DocumentExpandedNav handleClose={() => setIsExpanded(false)} />
      )}
      <div
        className={css(styles.main, isExpanded && styles.expandedContent)}
        style={{
          maxWidth: isExpanded ? viewerWidth * fullScreenSelectedZoom : "unset",
        }}
      >
        {commentDisplayPreference !== "none" && (
          <AnnotationLayer
            document={doc}
            contentRef={contentRef}
            displayPreference={commentDisplayPreference}
          />
        )}
        <div
          ref={contentRef}
          className={css(styles.body) + " rh-post"}
          dangerouslySetInnerHTML={{ __html: postHtml }}
        />
      </div>
      <div
        className={css(
          styles.controls,
          styles.controlsSticky,
          isExpanded && styles.controlsStickyExpanded
        )}
      >
        <DocumentControls
          handleFullScreen={() => setIsExpanded(!isExpanded)}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleZoomSelection={handleZoomSelection}
          currentZoom={isExpanded ? fullScreenSelectedZoom : selectedZoom}
          showExpand={true}
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  main: {
    position: "relative",
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
    overflow: "scroll",
  },
  expandedContent: {
    background: "white",
    margin: "75px auto 0 auto",
  },
  documentViewer: {},
  controls: {
    position: "absolute",
    zIndex: 99,
    right: 0,
    top: 25,
    marginRight: 10,
    marginTop: -10,
    display: "flex",
    columnGap: "10px",
    justifyContent: "flex-end",
    background: "white",
    paddingLeft: 15,
    paddingBottom: 15,
    border: "1px solid #aeaeae",
  },
  controlsSticky: {
    position: "fixed",
    left: `calc(50%)`,
    top: "unset",
    right: "unset",
    zIndex: 9999999,
    bottom: 40,
    display: "flex",
    columnGap: "10px",
    justifyContent: "flex-end",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
    userSelect: "none",
    padding: "10px 18px",
    borderRadius: "42px",

    [`@media (max-width: 1100px)`]: {
      transform: "unset",
      left: `calc(50% - ${config.controlsWidth / 2}px)`,
      bottom: 30,
    },
  },
  controlsStickyExpanded: {
    left: `50%`,
    transform: "translateX(-50%)",
    [`@media (max-width: 1100px)`]: {
      left: `50%`,
      transform: "translateX(-50%)",
    },
  },
  body: {
    padding: 45,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 15,
    },
  },
});

export default DocumentViewer;
