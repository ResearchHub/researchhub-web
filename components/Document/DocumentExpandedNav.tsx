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
import {
  faArrowDownToBracket,
  faPrint,
  faArrowUpRight,
} from "@fortawesome/pro-regular-svg-icons";
import Image from "next/image";

interface Props {
  pdfUrl?: string | null;
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
      <div className={css(styles.verticallyCenterContent)}>
        <div className={css(styles.actionsWrapper)}>
          <div onClick={() => handleClose()}>
            <IconButton overrideStyle={styles.backBtn}>
              <FontAwesomeIcon
                icon={faLongArrowLeft}
                style={{ fontSize: 20 }}
              />
            </IconButton>
          </div>

          <div className={css(styles.rightActions)}>
            {pdfUrl && (
              <div
                onClick={() => downloadPDF(pdfUrl)}
                className={css(styles.downloadBtn)}
              >
                <IconButton overrideStyle={styles.viewerNavBtn}>
                  <FontAwesomeIcon
                    icon={faArrowDownToBracket}
                    style={{ fontSize: 18 }}
                  />
                </IconButton>
              </div>
            )}
            <div className={css(styles.dividerWrapper)}>
              <div className={css(styles.divider)} />
            </div>

            <DocumentCommentMenu
              onSelect={setVisibilityPreferenceForViewingComments}
              selected={visibilityPreferenceForViewingComments}
              annotationCount={numAnnotations}
            />
            {documentInstance && (
              <>
                <div className={css(styles.dividerWrapper)}>
                  <div className={css(styles.divider)} />
                </div>
                <Link
                  href={`${documentInstance?.type}/${documentInstance?.id}`}
                >
                  <IconButton overrideStyle={styles.publicBtn}>
                    <Image
                      src="/static/ResearchHubText.png"
                      width={104}
                      height={12}
                      alt="ResearchHub"
                    />
                    <FontAwesomeIcon
                      icon={faArrowUpRight}
                      style={{ fontSize: 16, marginRight: 4 }}
                    />
                  </IconButton>
                </Link>
              </>
            )}
            {doc && <DocumentOptions document={doc} />}
          </div>
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
  verticallyCenterContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "column",
  },
  rightActions: {
    marginLeft: "auto",
    display: "flex",
  },
  actionsWrapper: {
    display: "flex",
    width: "100%",
  },
  downloadBtn: {},
  dividerWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 10px",
  },
  divider: {
    height: "60%",
    boxSizing: "border-box",
    borderRight: `2px solid ${colors.MEDIUM_GREY()}`,
  },
  viewerNavBtn: {
    color: colors.MEDIUM_GREY(),
    border: "none",
    boxSizing: "border-box",
    padding: "6px 12px",
  },
  backBtn: {
    color: colors.MEDIUM_GREY2(),
  },
  publicBtn: {
    color: colors.MEDIUM_GREY(),
    border: "none",
    boxSizing: "border-box",
    padding: "6px 12px",
  },
});

export default DocumentExpandedNav;
