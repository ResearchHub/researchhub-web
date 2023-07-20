import { useRef, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "../Placeholders/DocumentPlaceholder";
import dynamic from "next/dynamic";
import colors from "~/config/themes/colors";
import config from "../config";
import { GenericDocument } from "../types";
import { captureEvent } from "~/config/utils/events";

const _PDFViewer = dynamic(() => import("./_PDFViewer"), { ssr: false });

interface Props {
  document: GenericDocument;
  pdfUrl?: string;
  // PDFJS needs explicit width to render properly.
  // This width should be considered as initial width since user can zoom in/out.
  width?: number;
  onZoom?: Function;
  expanded?: boolean;
  pdfClose?: (e) => void;
  handleError?: Function;
}

type ZoomAction = {
  isExpanded: boolean;
  zoom: number;
  newWidth: number;
};

const PDFViewer = ({
  pdfUrl,
  width = config.width,
  onZoom,
  expanded,
  pdfClose,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded || false);
  const [fullScreenSelectedZoom, setFullScreenSelectedZoom] =
    useState<number>(1.25);
  const [selectedZoom, setSelectedZoom] = useState<number>(1);
  const [viewerWidth, setViewerWidth] = useState<number>(width);
  const containerRef = useRef<HTMLDivElement>(null);

  // Note: This will be turned on. Needs a bit of work to get "pinch zoom" to work properly
  // useEffect(() => {
  //   let initialDistance;

  //   const handleTouchStart = (event) => {
  //     console.log('here')
  //     if(event.touches.length === 2) { // two fingers touched
  //       initialDistance = getDistance(event);
  //     }
  //   };

  //   const handleTouchMove = (event) => {
  //     console.log('move')
  //     if(event.touches.length === 2) { // two fingers moved
  //       const currentDistance = getDistance(event);
  //       if(currentDistance !== initialDistance) {
  //         if(currentDistance > initialDistance) {
  //           // zoom in action, increase scale
  //           handleZoomIn()
  //         } else {
  //           // zoom out action, decrease scale
  //           handleZoomOut()
  //         }
  //         initialDistance = currentDistance;
  //       }
  //     }
  //   };

  //   const getDistance = (event) => {
  //     const { clientX: x1, clientY: y1 } = event.touches[0];
  //     const { clientX: x2, clientY: y2 } = event.touches[1];
  //     const xDiff = x2 - x1;
  //     const yDiff = y2 - y1;
  //     return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  //   };

  //   const pinchZoomArea = containerRef.current;
  //   console.log('pinchZoomArea', pinchZoomArea)
  //   pinchZoomArea.addEventListener("touchstart", handleTouchStart, false);
  //   pinchZoomArea.addEventListener("touchmove", handleTouchMove, false);

  //   return () => {
  //     // Cleanup the event listeners
  //     pinchZoomArea.removeEventListener("touchstart", handleTouchStart);
  //     pinchZoomArea.removeEventListener("touchmove", handleTouchMove);
  //   };

  // }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    function resizeHandler() {
      setViewerWidth(Math.min(width, containerRef!.current!.offsetWidth));
    }

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [containerRef]);

  function onFullScreenClose(e) {
    pdfClose && pdfClose(e);
    setIsExpanded(false);
  }

  function onPageRender(pageNum) {
    console.log("page rendered", pageNum);
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

  return (
    <div className={css(styles.container)} ref={containerRef}>
      <div style={{ overflowX: "scroll" }}>
        <_PDFViewer
          pdfUrl={pdfUrl}
          viewerWidth={viewerWidth * selectedZoom}
          onLoadSuccess={() => {
            setIsLoading(false);
          }}
          onLoadError={onError}
          onPageRender={onPageRender}
          showWhenLoading={
            <div style={{ padding: 20 }}>
              <DocumentPlaceholder />
            </div>
          }
        />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "25px 0",
    position: "relative",
    boxSizing: "border-box",
    maxWidth: "100vw",
  },
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
  expandedOn: {
    display: "block",
  },
  expandedWrapper: {
    display: "none",
    position: "fixed",
    zIndex: 999999,
    top: 0,
    right: 0,
    background: "rgb(230, 230, 230, 1.0)",
    width: "100%",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 3,
  },
  downloadBtn: {
    position: "absolute",
    right: 48,
    top: 3,
  },
  expandedNav: {
    position: "fixed",
    height: 40,
    width: "100%",
    zIndex: 1,
    background: colors.LIGHTER_GREY(),
    boxSizing: "border-box",
    padding: "0 25px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    rowGap: "15px",
    justifyContent: "center",
    marginTop: "30%",
  },
  viewerNavBtn: {
    background: "white",
    border: "1px solid #aeaeae",
    height: 33,
    width: 33,
    boxSizing: "border-box",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
  },
});

export default PDFViewer;
