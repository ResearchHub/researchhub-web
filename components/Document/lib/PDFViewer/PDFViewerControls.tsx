import { useEffect, useRef, useState, useCallback, ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMaximize,
  faXmark,
} from "@fortawesome/pro-light-svg-icons";
import IconButton from "../../../Icons/IconButton";
import colors from "~/config/themes/colors";
import debounce from "lodash/debounce";
import PDFViewerZoomControls from "./PDFViewerZoomControls";

interface Props {
  handleFullScreen: Function;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleZoomSelection: Function;
  zoomOptions: Array<{ label: string; value: number }>
  currentZoom: number;
  showExpand: boolean;
}

const PDFViewerControls = ({
  handleFullScreen,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
  zoomOptions,
  currentZoom,
  showExpand = true,
}: Props) => {

  return (
    <>
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
