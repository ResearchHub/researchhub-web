import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faChevronDown,
} from "@fortawesome/pro-light-svg-icons";
import IconButton from "../../../Icons/IconButton";
import GenericMenu from "../../../shared/GenericMenu";


interface Props {
  currentZoom: number;
  handleZoomIn: Function;
  handleZoomOut: Function;
  handleZoomSelection: Function;
  zoomOptions: any[];
}

const PDFViewerZoomControls = ({ currentZoom, zoomOptions, handleZoomIn, handleZoomOut, handleZoomSelection }: Props) => {

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleZoomOut}>
        <FontAwesomeIcon icon={faMinus} style={{ fontSize: 24 }} />
      </IconButton>
      <GenericMenu
        options={zoomOptions}
        width={100}
        direction="top-center"
        onSelect={(option) => handleZoomSelection(option.value)}
      >
        <IconButton>
          {
            zoomOptions.find((option) => option.value === currentZoom)
              ?.label
          }
        </IconButton>
      </GenericMenu>
      <IconButton onClick={handleZoomIn}>
        <FontAwesomeIcon icon={faPlus} style={{ fontSize: 24 }} />
      </IconButton>      
    </div>  
  )
}

export default PDFViewerZoomControls;