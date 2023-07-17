import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../../Icons/IconButton";
import GenericMenu from "../../shared/GenericMenu";
import { zoomOptions } from "./PDFViewer/config";

interface Props {
  currentZoom: number;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleZoomSelection: Function;
}

const DocumentZoomControls = ({
  currentZoom,
  handleZoomIn,
  handleZoomOut,
  handleZoomSelection,
}: Props) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleZoomOut();
        }}
      >
        <FontAwesomeIcon icon={faMinus} style={{ fontSize: 24 }} />
      </IconButton>
      <GenericMenu
        id="zoom-controls"
        options={zoomOptions}
        width={100}
        direction="top-center"
        onSelect={(option) => {
          handleZoomSelection(option);
        }}
      >
        <IconButton>
          {zoomOptions.find((option) => option.value === currentZoom)?.label}
        </IconButton>
      </GenericMenu>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleZoomIn();
        }}
      >
        <FontAwesomeIcon icon={faPlus} style={{ fontSize: 24 }} />
      </IconButton>
    </div>
  );
};

export default DocumentZoomControls;
