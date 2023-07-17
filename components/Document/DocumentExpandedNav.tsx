import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faFileArrowDown } from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";

interface Props {
  pdfUrl?: string;
  handleClose: Function;
}

function downloadPDF(pdfUrl) {
  // Create a link for our script to click
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.target = "_blank";
  link.download = "download.pdf";

  // Trigger the click
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
}

const DocumentExpandedNav = ({ pdfUrl, handleClose }: Props) => {
  return (
    <div className={css(styles.expandedNav)}>
      {pdfUrl && (
        <div
          onClick={() => downloadPDF(pdfUrl)}
          className={css(styles.downloadBtn)}
        >
          <IconButton overrideStyle={styles.viewerNavBtn}>
            <FontAwesomeIcon icon={faFileArrowDown} style={{ fontSize: 20 }} />
          </IconButton>
        </div>
      )}
      <div onClick={() => handleClose()} className={css(styles.closeBtn)}>
        <IconButton overrideStyle={styles.viewerNavBtn}>
          <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20 }} />
        </IconButton>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
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
  viewerNavBtn: {
    background: "white",
    border: "1px solid #aeaeae",
    height: 33,
    width: 33,
    boxSizing: "border-box",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
  },
});

export default DocumentExpandedNav;
