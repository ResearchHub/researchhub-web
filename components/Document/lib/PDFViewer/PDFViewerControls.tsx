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
  handleZoomSelection: Function;
  zoomOptions: Array<{ label: string; value: number }>
  currentZoom: number;
}

const PDFViewerControls = ({
  handleFullScreen,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
  handleSearchClick,
  zoomOptions,
  currentZoom,

}: Props): [ReactElement, string] => {
  const [searchText, setSearchText] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function keydownHandler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  const handleInputChange = useCallback(async () => {
    setSearchText(inputRef?.current?.value || "");
  }, []);

  const debouncedHandleSearchInputChange = useCallback(
    debounce(handleInputChange, 500),
    [handleInputChange]
  );

  const el = (
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
                setSearchText("");
                setIsSearchOpen(false);
                handleSearchClick && handleSearchClick(false);
                inputRef!.current!.value = "";
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20,  }} />
            </IconButton>
          </div>
        </div>
      )}
      {!isSearchOpen && (
        <IconButton
          onClick={() => {
            setIsSearchOpen(true);
            handleSearchClick && handleSearchClick(true);
            if (inputRef.current) {
              inputRef.current.focus();
            }
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
      <div className={css(styles.divider)} />        
      <IconButton onClick={() => handleFullScreen()}>
        <FontAwesomeIcon icon={faMaximize} style={{ fontSize: 20 }} />
      </IconButton>
    </>
  );
  
  return [el, searchText];
};

const styles = StyleSheet.create({
  search: {
    border: `1px solid ${colors.BLACK(0.3)}`,
    padding: "0px 15px",
    background: "white",
    width: 150,
  },
  divider: {
    borderRight: `1px solid ${colors.BLACK(0.6)}`,
    height: "20px",
    marginTop: 7,
  }
});

export default PDFViewerControls;
