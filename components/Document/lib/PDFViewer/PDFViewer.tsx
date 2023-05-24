import { useRef, useEffect, useState, useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "../../DocumentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faXmark,
  faMinus,
  faPlus,
  faChevronDown,
} from "@fortawesome/pro-light-svg-icons";
import dynamic from "next/dynamic";
import IconButton from "../../../Icons/IconButton";
import colors from "~/config/themes/colors";
import GenericMenu from "../../../shared/GenericMenu";
import PDFViewerStickyNav from "./PDFViewerStickyNav";
import PDFViewerZoomControls from "./PDFViewerZoomControls";


const _PDFViewer = dynamic(() => import("./_PDFViewer"), { ssr: false });

const zoomOptions = [
  {
    label: "100%",
    value: 1,
  },
  {
    label: "120%",
    value: 1.25,
  },
  {
    label: "150%",
    value: 1.5,
  },
  {
    label: "170%",
    value: 1.75,
  },
  {
    label: "200%",
    value: 2,
  },
];

interface Props {
  pdfUrl?: string;
  maxWidth?: number;
}

const PDFViewer = ({ pdfUrl, maxWidth = 900 }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [fullScreenSelectedZoom, setFullScreenSelectedZoom] = useState<number>(1.25);
  const [selectedZoom, setSelectedZoom] = useState<number>(1);
  const [viewerWidth, setViewerWidth] = useState<number>(maxWidth); // PDFJS needs explicit width to render properly
  const [stickyNav, searchText] = PDFViewerStickyNav({
    handleFullScreen: () => {
      setIsExpanded(true)
    },
    zoomOptions,
    currentZoom: selectedZoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomSelection: (option) => setSelectedZoom(option.value)
  });
  const containerRef = useRef(null);


  function handleZoomIn () {
    const currentIdx = zoomOptions.findIndex((option) => option.value === selectedZoom);
    const isLastOption = currentIdx === zoomOptions.length - 1
    if (isLastOption) {
      return;
    }
    setSelectedZoom(zoomOptions[currentIdx+1].value);
  }
  function handleZoomOut() {
    const currentIdx = zoomOptions.findIndex((option) => option.value === selectedZoom);
    const isFirstOption = currentIdx === 0
    if (isFirstOption) {
      return;
    }
    setSelectedZoom(zoomOptions[currentIdx-1].value);
  }


  useEffect(() => {
    let initialDistance;

    const handleTouchStart = (event) => {
      console.log('here')
      if(event.touches.length === 2) { // two fingers touched
        initialDistance = getDistance(event);
      }
    };

    const handleTouchMove = (event) => {
      console.log('move')
      if(event.touches.length === 2) { // two fingers moved
        const currentDistance = getDistance(event);
        if(currentDistance !== initialDistance) {
          if(currentDistance > initialDistance) {
            // zoom in action, increase scale
            handleZoomIn()
          } else {
            // zoom out action, decrease scale
            handleZoomOut()
          }
          initialDistance = currentDistance;
        }
      }
    };

    const getDistance = (event) => {
      const { clientX: x1, clientY: y1 } = event.touches[0];
      const { clientX: x2, clientY: y2 } = event.touches[1];
      const xDiff = x2 - x1;
      const yDiff = y2 - y1;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    const pinchZoomArea = containerRef.current;
    console.log('pinchZoomArea', pinchZoomArea)
    pinchZoomArea.addEventListener("touchstart", handleTouchStart, false);
    pinchZoomArea.addEventListener("touchmove", handleTouchMove, false);

    return () => {
      // Cleanup the event listeners
      pinchZoomArea.removeEventListener("touchstart", handleTouchStart);
      pinchZoomArea.removeEventListener("touchmove", handleTouchMove);
    };

  }, []);



  useEffect(() => {
    function resizeHandler() {
      setViewerWidth(Math.min(maxWidth, window.outerWidth));
    }

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  function onLoadSuccess() {
    setIsLoading(false);
  }

  function onLoadError() {
    setIsLoading(false);
    setHasLoadError(true);
  }

  if (hasLoadError) {
    return (
      <div className={css(styles.error)}>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 44 }} />
        <span style={{ fontSize: 22 }}>
          There was an error loading the PDF.
        </span>
      </div>
    );
  }

  const fullScreenViewer = useMemo(() => {
    return (
      <div
        className={css(styles.expandedWrapper, isExpanded && styles.expandedOn)}
      >
        <div className={css(styles.expandedNav)}>
          <div
            onClick={() => setIsExpanded(false)}
            className={css(styles.closeBtn)}
          >
            <IconButton>
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 24 }} />
            </IconButton>
          </div>
          <PDFViewerZoomControls
            zoomOptions={zoomOptions}
            currentZoom={selectedZoom}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleZoomSelection={(option) => setSelectedZoom(option.value)}
          />
        </div>
        <div style={{ overflowY: "scroll", height: "100vh" }}>
          <_PDFViewer
            pdfUrl={pdfUrl}
            viewerWidth={viewerWidth * fullScreenSelectedZoom}
            searchText={searchText}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            showWhenLoading={<DocumentPlaceholder />}
          />
        </div>
      </div>
    );
  }, [isExpanded, selectedZoom, viewerWidth]);

  return (
    <div className={css(styles.container)} ref={containerRef}>
      {fullScreenViewer}
      <div className={css(styles.stickyDocNavWrapper)}>{stickyNav}</div>
      <div style={{ overflowX: "scroll" }}>
      <_PDFViewer
        pdfUrl={pdfUrl}
        searchText={searchText}
        viewerWidth={viewerWidth * selectedZoom}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        showWhenLoading={<DocumentPlaceholder />}
      />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "10px 0",
    position: "relative",
    boxSizing: "border-box",
    maxWidth: "100vw",
  },
  stickyDocNavWrapper: {
    position: "sticky",
    zIndex: 99,
    right: 0,
    top: 50,
    marginRight: 10,
    marginTop: -10,
    display: "flex",
    columnGap: "10px",
    justifyContent: "flex-end",
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
    top: 2,
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
});

export default PDFViewer;
