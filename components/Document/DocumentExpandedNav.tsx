import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFileArrowDown,
  faLongArrowLeft,
  faGlobe,
} from "@fortawesome/pro-light-svg-icons";
import IconButton from "../Icons/IconButton";
import { useContext } from "react";
import { DocumentContext } from "./lib/DocumentContext";
import DocumentOptions from "./DocumentOptions";
import { ContentInstance, GenericDocument } from "./lib/types";
import Link from "next/link";
import DocumentViewerContext from "./lib/DocumentViewerContext";
import DocumentCommentMenu from "./DocumentCommentMenu";

interface Props {
  pdfUrl?: string;
  handleClose: Function;
  document?: GenericDocument | null;
  documentInstance?: ContentInstance;
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

const DocumentExpandedNav = ({
  pdfUrl,
  document: doc,
  documentInstance,
  handleClose,
}: Props) => {
  const {
    visibilityPreferenceForViewingComments,
    setVisibilityPreferenceForViewingComments,
    numAnnotations,
  } = useContext(DocumentViewerContext);

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
          <Link href={`${documentInstance?.type}/${documentInstance?.id}`}>
            <div className={css(styles.publicPageBtnWrapper)}>
              <IconButton variant="round" overrideStyle={styles.viewerNavBtn}>
                <FontAwesomeIcon
                  icon={faGlobe}
                  style={{ fontSize: 16, marginRight: 4 }}
                />
                View public page
              </IconButton>
            </div>
          </Link>
          <DocumentCommentMenu
            onSelect={setVisibilityPreferenceForViewingComments}
            selected={visibilityPreferenceForViewingComments}
            annotationCount={numAnnotations}
          />
          {doc && (
            <div>
              <DocumentOptions document={doc} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  expandedNav: {
    position: "fixed",
    height: 44,
    width: "100%",
    zIndex: 4,
    background: "white",
    boxSizing: "border-box",
    padding: "0 15px",
    borderBottom: `1px solid rgba(233, 234, 239, 1)`,
    // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  },
  publicPageBtnWrapper: {
    fontSize: 14,
    position: "absolute",
    left: "50%",
    top: 2,
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    transform: "translateX(-50%)",
  },
  rightActions: {
    marginLeft: "auto",
  },
  actionsWrapper: {
    display: "flex",
    marginTop: 3,
  },
  closeBtn: {
    height: 33,
    width: 33,
  },
  downloadBtn: {},
  viewerNavBtn: {
    color: colors.MEDIUM_GREY(),
    border: "none",
    boxSizing: "border-box",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s",
    },
  },
});

export default DocumentExpandedNav;
