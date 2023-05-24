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

interface StickyNavProps {
  handleFullScreen: Function;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleZoomSelection: Function;
  zoomOptions: Array<{ label: string; value: number }>
  currentZoom: number;
}

const PDFViewerStickyNav = ({
  handleFullScreen,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
  zoomOptions,
  currentZoom,

}: StickyNavProps): [ReactElement, string] => {
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

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen, inputRef]);

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
          <div style={{ display: "flex" }}>
            <input
              type="text"
              ref={inputRef}
              onChange={debouncedHandleSearchInputChange}
              style={{ border: 0, outline: "none" }}
            />
            <IconButton
              onClick={() => {
                setSearchText("");
                inputRef!.current!.value = "";
                setIsSearchOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20 }} />
            </IconButton>
          </div>
        </div>
      )}
      {!isSearchOpen && (
        <IconButton
          onClick={() => {
            setIsSearchOpen(true);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: 20 }} />
        </IconButton>
      )}
      <div
        style={{
          borderRight: `2px solid ${colors.BLACK(0.5)}`,
          height: "20px",
          marginTop: 5,
        }}
      ></div>
      <PDFViewerZoomControls
        zoomOptions={zoomOptions}
        currentZoom={currentZoom}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoomSelection={(option) => handleZoomSelection(option.value)}
      />
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
    padding: "0px 8px",
    background: "white",
  },
});

export default PDFViewerStickyNav;
