import { useRef, useEffect, useState, useMemo, ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "../Placeholders/DocumentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faXmark,
  faMinus,
  faPlus,
  faChevronDown,
  faFileArrowDown
} from "@fortawesome/pro-light-svg-icons";
import dynamic from "next/dynamic";
import IconButton from "../../../Icons/IconButton";
import colors from "~/config/themes/colors";
import GenericMenu from "../../../shared/GenericMenu";
import PDFViewerControls from "./PDFViewerControls";
import PDFViewerZoomControls from "./PDFViewerZoomControls";
import config from "../config";

const _PDFViewer = dynamic(() => import("./_PDFViewer"), { ssr: false });

const zoomOptions = [
  {
    label: "100%",
    value: 1,
    isVisible: true,
  },
  {
    label: "125%",
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
  onZoomOut?: Function;
  onZoomIn?: Function;
}

type ZoomAction = {
  size: "full-screen" | "normal";
  zoom: number;
  newWidth: number;
}

const PDFViewer = ({ pdfUrl, maxWidth = 900, onZoomOut, onZoomIn }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [fullScreenSelectedZoom, setFullScreenSelectedZoom] =
    useState<number>(1.25);
  const [selectedZoom, setSelectedZoom] = useState<number>(1);
  const [viewerWidth, setViewerWidth] = useState<number>(maxWidth); // PDFJS needs explicit width to render properly
  const [wrapperWidth, setWrapperWidth] = useState<string>("100vw"); // The Wrapper of PDF.js
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const containerRef = useRef<HTMLElement>(null);

  function handleZoomIn() {

    if (isExpanded) {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === fullScreenSelectedZoom
      );
      const isLastOption = currentIdx === zoomOptions.length - 1;
      if (isLastOption) {
        return;
      }

      const newZoom = zoomOptions[currentIdx + 1].value
      setFullScreenSelectedZoom(newZoom);
      onZoomIn && onZoomIn({
        size: "full-screen",
        zoom: newZoom,
        newWidth: viewerWidth * newZoom
      } as ZoomAction);      
    }
    else {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === selectedZoom
      );
      const isLastOption = currentIdx === zoomOptions.length - 1;
      if (isLastOption) {
        return;
      }

      const newZoom = zoomOptions[currentIdx + 1].value;
      setSelectedZoom(newZoom);
      onZoomIn && onZoomIn({
        size: "normal",
        zoom: newZoom,
        newWidth: viewerWidth * newZoom
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
      const newZoom = zoomOptions[currentIdx - 1].value
      setFullScreenSelectedZoom(newZoom);
      onZoomOut && onZoomOut({
        size: "full-screen",
        zoom: newZoom,
        newWidth: viewerWidth * newZoom
      } as ZoomAction);      
    }
    else {
      const currentIdx = zoomOptions.findIndex(
        (option) => option.value === selectedZoom
      );
      const isFirstOption = currentIdx === 0;
      if (isFirstOption) {
        return;
      }
      const newZoom = zoomOptions[currentIdx - 1].value;
      setSelectedZoom(newZoom);
      onZoomOut && onZoomOut({
        size: "normal",
        zoom: newZoom,
        newWidth: viewerWidth * newZoom
      } as ZoomAction);
    }
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
    if (!containerRef.current) return;

    function resizeHandler() {
      setViewerWidth(Math.min(maxWidth, containerRef!.current!.offsetWidth));

      if (window.outerWidth > config.width) {
        setWrapperWidth(`${containerRef!.current!.offsetWidth}px`);
      } else {
        setWrapperWidth(`${containerRef!.current!.offsetWidth}px`);
      }
    }

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [containerRef]);

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
            className={css(styles.downloadBtn)}
          >
            <IconButton overrideStyle={styles.viewerNavBtn}>
              <FontAwesomeIcon icon={faFileArrowDown} style={{ fontSize: 20 }} />
            </IconButton>
          </div>          
          <div
            onClick={() => setIsExpanded(false)}
            className={css(styles.closeBtn)}
          >
            <IconButton overrideStyle={styles.viewerNavBtn}>
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        </div>
        <div style={{ overflowY: "scroll", height: "100vh", paddingTop: 60 }}>
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
  }, [isExpanded, selectedZoom, viewerWidth, fullScreenSelectedZoom, searchText]);

  return (
    <div className={css(styles.container)} ref={containerRef}>
      {fullScreenViewer}
      <div
        className={css(
          styles.controls,
          styles.controlsSticky,
          isSearchOpen && styles.controlsStickySearchOpen,
          isExpanded && styles.controlsStickyExpanded
        )}
      >

        <PDFViewerControls
          handleFullScreen={() => {
            setIsExpanded(true);
          }}
          zoomOptions={zoomOptions}
          currentZoom={isExpanded ? fullScreenSelectedZoom : selectedZoom}
          handleSearchClick={(isSearchOpen) => setSearchOpen(isSearchOpen)}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleSearchChange={(searchText) => setSearchText(searchText)}
          searchText={searchText}
          showExpand={isExpanded ? false : true}
          handleZoomSelection={(option) => setSelectedZoom(option.value)}
        />


      </div>
      <div style={{ overflowX: "scroll" }}>
        <_PDFViewer
          pdfUrl={pdfUrl}
          searchText={searchText}
          viewerWidth={viewerWidth * selectedZoom}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          showWhenLoading={<div style={{ padding: 20 }}><DocumentPlaceholder /></div>}
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
    },
  },
  controlsStickySearchOpen: {
    left: `calc(50% - 60px)`,

    [`@media (max-width: 1100px)`]: {
      transform: "unset",
      left: `calc(50% - ${config.controlsWidthExpanded / 2}px)`,
    },
  },
  controlsStickyExpanded: {
    left: `50%`,
    transform: "translateX(-50%)",
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
  }
});

export default PDFViewer;
