import { useEffect, useRef, useState, useCallback, ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMaximize,
  faXmark,
  faSearch,
} from "@fortawesome/pro-light-svg-icons";
import IconButton from "../../../Icons/IconButton";
import colors from "~/config/themes/colors";
import debounce from "lodash/debounce";
import PDFViewerZoomControls from "./PDFViewerZoomControls";

interface Props {
  handleFullScreen: Function;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleSearchClick?: Function;
  handleSearchChange: Function;
  handleZoomSelection: Function;
  zoomOptions: Array<{ label: string; value: number }>
  searchText: string;
  currentZoom: number;
  showExpand: boolean;
}

const PDFViewerControls = ({
  handleFullScreen,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
  handleSearchClick,
  handleSearchChange,
  zoomOptions,
  currentZoom,
  showExpand = true,
  searchText,
}: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    function keydownHandler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
      }
    }

    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen, inputRef]);

  const handleInputChange = useCallback(async () => {
    handleSearchChange(inputRef?.current?.value || "");
  }, []);

  const debouncedHandleSearchInputChange = useCallback(
    debounce(handleInputChange, 500),
    [handleInputChange]
  );

  return (
    <>
      {isSearchOpen && (
        <div className={css(styles.search)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around",  }}>
            <input
              type="text"
              ref={inputRef}
              onChange={debouncedHandleSearchInputChange}
              style={{ border: 0, outline: "none" }}
            />
            <IconButton
              onClick={() => {
                handleSearchChange("");
                setIsSearchOpen(false);
                handleSearchClick && handleSearchClick(false);
                inputRef!.current!.value = "";
              }}
              overrideStyle={styles.closeBtn}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20  }} />
            </IconButton>
          </div>
        </div>
      )}
      {!isSearchOpen && (
        <IconButton
          onClick={() => {
            setIsSearchOpen(true);
            handleSearchClick && handleSearchClick(true);
          }}
        >
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: 20 }} />
        </IconButton>
      )}
      <div className={css(styles.divider)} />
      <PDFViewerZoomControls
        zoomOptions={zoomOptions}
        currentZoom={currentZoom}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoomSelection={(option) => handleZoomSelection(option.value)}
        />
      {showExpand && (
        <>
          <div className={css(styles.divider)} />        
          <IconButton onClick={() => handleFullScreen()}>
            <FontAwesomeIcon icon={faMaximize} style={{ fontSize: 20 }} />
          </IconButton>
        </>
      )}  
    </>
  );
  
};

const styles = StyleSheet.create({
  search: {
    border: `1px solid ${colors.BLACK(0.3)}`,
    padding: "0px 18px",
    background: "white",
    width: 150,
    borderRadius: "50px",
  },
  divider: {
    borderRight: `1px solid ${colors.BLACK(0.6)}`,
    height: "20px",
    marginTop: 7,
  },
  closeBtn: {
    borderRadius: 50,
    padding: 7,
  }
});

export default PDFViewerControls;
