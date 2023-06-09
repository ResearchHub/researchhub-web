import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../../../Icons/IconButton";
import GenericMenu from "../../../shared/GenericMenu";
import { zoomOptions } from "./config";

interface Props {
  currentZoom: number;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleZoomSelection: Function;
}

const PDFViewerZoomControls = ({
  currentZoom,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
}: Props) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleZoomOut}>
        <FontAwesomeIcon icon={faMinus} style={{ fontSize: 24 }} />
      </IconButton>
      <GenericMenu
        id="zoom-controls"
        options={zoomOptions}
        width={100}
        direction="top-center"
        onSelect={(option) => {
          console.log("option", option);
          handleZoomSelection(option);
        }}
      >
        <IconButton>
          {zoomOptions.find((option) => option.value === currentZoom)?.label}
        </IconButton>
      </GenericMenu>
      <IconButton onClick={handleZoomIn}>
        <FontAwesomeIcon icon={faPlus} style={{ fontSize: 24 }} />
      </IconButton>
    </div>
  );
};

export default PDFViewerZoomControls;
