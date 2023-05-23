import { useEffect, useState, useMemo } from "react";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "./DocumentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faMaximize,
  faXmark,
  faMinus,
  faPlus,
  faChevronDown,
  faSearch,
} from "@fortawesome/pro-light-svg-icons";
import dynamic from "next/dynamic";
import IconButton from "../Icons/IconButton";
import colors from "~/config/themes/colors";
import GenericMenu from "../shared/GenericMenu";

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
  const [selectedZoom, setSelectedZoom] = useState<number>(1.25);
  const [viewerWidth, setViewerWidth] = useState<number>(maxWidth); // PDFJS needs explicit width to render properly

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
          <div style={{ display: "flex" }}>
            <IconButton>
              <FontAwesomeIcon icon={faMinus} style={{ fontSize: 24 }} />
            </IconButton>
            <IconButton>
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 24 }} />
            </IconButton>
            <GenericMenu
              options={zoomOptions}
              width={100}
              onSelect={(option) => setSelectedZoom(option.value)}
            >
              <IconButton>
                {
                  zoomOptions.find((option) => option.value === selectedZoom)
                    ?.label
                }
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: 24 }}
                />
              </IconButton>
            </GenericMenu>
          </div>
        </div>
        <div style={{ overflowY: "scroll", height: "100vh" }}>
          <_PDFViewer
            pdfUrl={pdfUrl}
            viewerWidth={viewerWidth * selectedZoom}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            showWhenLoading={<DocumentPlaceholder />}
          />
        </div>
      </div>
    );
  }, [isExpanded, selectedZoom, viewerWidth]);

  return (
    <div className={css(styles.container)}>
      {fullScreenViewer}
      <div className={css(styles.stickyDocNav)}>
        <div onClick={() => setIsExpanded(true)} style={{}}>
          <IconButton tooltip="Fullscreen mode">
            <FontAwesomeIcon icon={faSearch} style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <div
          style={{
            borderRight: `2px solid ${colors.BLACK(0.5)}`,
            height: "20px",
            marginTop: 5,
          }}
        ></div>
        <div onClick={() => setIsExpanded(true)} style={{}}>
          <IconButton tooltip="Fullscreen mode">
            <FontAwesomeIcon icon={faMaximize} style={{ fontSize: 20 }} />
          </IconButton>
        </div>
      </div>
      <_PDFViewer
        pdfUrl={pdfUrl}
        viewerWidth={viewerWidth}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        showWhenLoading={<DocumentPlaceholder />}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "25px 0",
    position: "relative",
    boxSizing: "border-box",
  },
  stickyDocNav: {
    position: "sticky",
    zIndex: 2,
    right: 0,
    top: 0,
    marginRight: 5,
    marginTop: -18,
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
