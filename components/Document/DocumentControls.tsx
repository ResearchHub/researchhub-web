import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import colors from "~/config/themes/colors";
import DocumentZoomControls from "./lib/DocumentZoomControls";

interface Props {
  handleFullScreen: Function;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleZoomSelection: Function;
  currentZoom: number;
  showExpand: boolean;
}

const DocumentControls = ({
  handleFullScreen,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
  currentZoom,
  showExpand = true,
}: Props) => {
  return (
    <>
      <DocumentZoomControls
        currentZoom={currentZoom}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleZoomSelection={handleZoomSelection}
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
  },
});

export default DocumentControls;
