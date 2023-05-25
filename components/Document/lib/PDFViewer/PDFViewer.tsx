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
import PDFViewerControls from "./PDFViewerControls";
import PDFViewerZoomControls from "./PDFViewerZoomControls";
import config from "../config";


const _PDFViewer = dynamic(() => import("./_PDFViewer"), { ssr: false });

// const _zoomOptions = Array.from({ length: 100 }, (_, i) => ({
//   label: `${i + 100}%`,
//   value: (i + 100) / 100,
//   isVisible: false,
// }));

const zoomOptions = [
  // ..._zoomOptions,
  {
    label: "100%",
    value: 1,
    isVisible: true,
  },
  {
    label: "120%",
    value: 1.25,
    isVisible: true,
  },
  {
    label: "150%",
    value: 1.5,
    isVisible: true,
  },
  {
    label: "170%",
    value: 1.75,
    isVisible: true,
  },
  {
    label: "200%",
    value: 2,
    isVisible: true,
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
  const [wrapperWidth, setWrapperWidth] = useState<string>("100vw"); // The Wrapper of PDF.js
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [stickyNav, searchText] = PDFViewerControls({
    handleFullScreen: () => {
      setIsExpanded(true)
    },
    zoomOptions,
    currentZoom: selectedZoom,
    handleSearchClick: (isSearchOpen) => setSearchOpen(isSearchOpen),
    handleZoomIn,
    handleZoomOut,
    handleZoomSelection: (option) => setSelectedZoom(option.value)
  });
  const containerRef = useRef(null);

  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const scrollHandler = () => {
      const pdfInView = containerRef.current.getBoundingClientRect().top < 0;
      if (pdfInView || window.outerHeight < config.maxWidth) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    }
  }, []);

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
    function resizeHandler() {
      const sidebarElWidth = document.querySelector(".root-left-sidebar")?.getBoundingClientRect()?.width || 0;
      setViewerWidth(Math.min(maxWidth, window.outerWidth - sidebarElWidth));

      if (window.outerWidth > config.maxWidth) {
        const borderWidth = 2;
        setWrapperWidth(`${config.maxWidth - borderWidth}px`);
      }
      else {
        setWrapperWidth(`calc(100vw - ${sidebarElWidth}px)`);
      }
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
      <div className={css(styles.controls, isSticky && styles.controlsSticky, isSticky && isSearchOpen && styles.controlsStickySearchOpen)}>{stickyNav}</div>
      <div style={{ overflowX: "scroll", width: wrapperWidth }}>
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
  },
  controlsSticky: {
    position: "fixed",
    left: `calc(50%)`,
    top: "unset",
    right: "unset",
    zIndex: 99,
    bottom: 50,
    display: "flex",
    columnGap: "10px",
    justifyContent: "flex-end",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
    userSelect: "none",
    padding: "10px 12px",
    borderRadius: "42px",
    
    
    [`@media (max-width: 1100px)`]: {
      transform: "unset",
      left: `calc(50% - ${config.controlsWidth / 2}px)`,
    }
  },
  controlsStickySearchOpen: {
    left: `calc(50% - 60px)`,

    [`@media (max-width: 1100px)`]: {
      transform: "unset",
      left: `calc(50% - ${config.controlsWidthExpanded / 2}px)`,
    }    
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
