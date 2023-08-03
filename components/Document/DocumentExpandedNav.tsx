import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFileArrowDown,
  faLongArrowLeft,
} from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import { useContext } from "react";
import { DocumentContext } from "./lib/DocumentContext";
import DocumentOptions from "./DocumentOptions";
import { GenericDocument } from "./lib/types";

interface Props {
  pdfUrl?: string;
  handleClose: Function;
  document: GenericDocument;
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

const DocumentExpandedNav = ({ pdfUrl, document: doc, handleClose }: Props) => {
  const documentContext = useContext(DocumentContext);

  return (
    <div className={css(styles.expandedNav)}>
      <div className={css(styles.actionsWrapper)}>
        <div onClick={() => handleClose()}>
          <IconButton overrideStyle={styles.viewerNavBtn} variant="round">
            <FontAwesomeIcon icon={faLongArrowLeft} style={{ fontSize: 20 }} />
          </IconButton>
        </div>

        <div className={css(styles.rightActions)}>
          {pdfUrl && (
            <div
              onClick={() => downloadPDF(pdfUrl)}
              className={css(styles.viewerNavBtn, styles.downloadBtn)}
            >
              <IconButton overrideStyle={styles.viewerNavBtn}>
                <FontAwesomeIcon
                  icon={faFileArrowDown}
                  style={{ fontSize: 20 }}
                />
              </IconButton>
            </div>
          )}
          <div>
            <DocumentOptions document={doc} />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  expandedNav: {
    position: "fixed",
    height: 40,
    width: "100%",
    zIndex: 4,
    background: colors.LIGHTER_GREY(),
    boxSizing: "border-box",
    padding: "0 15px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  },
  rightActions: {
    marginLeft: "auto",
  },
  actionsWrapper: {
    display: "flex",
    marginTop: 3,
  },
  closeBtn: {},
  downloadBtn: {},
  viewerNavBtn: {
    color: "black",
    height: 33,
    width: 33,
    border: "none",
    boxSizing: "border-box",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s",
    },
  },
});

export default DocumentExpandedNav;
