import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DocumentMetadata,
  GenericDocument,
  Paper,
  isPaper,
  isPost,
} from "./lib/types";
import GenericMenu, { MenuOption } from "../shared/GenericMenu";
import { flagGrmContent } from "../Flag/api/postGrmFlag";
import FlagButtonV2 from "../Flag/FlagButtonV2";
import { faPen, faFlag, faBan } from "@fortawesome/pro-light-svg-icons";
import PaperMetadataModal from "./PaperMetadataModal";
import { useSelector } from "react-redux";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";
import IconButton from "../Icons/IconButton";
import {
  faEllipsis,
  faArrowDownToBracket,
} from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { useContext } from "react";
import { DocumentContext } from "./lib/DocumentContext";
import useCacheControl from "~/config/hooks/useCacheControl";
import removeDocFromFeatured from "../Admin/api/removeDocFromFeaturedAPI";
import excludeFromFeed from "../Admin/api/excludeDocFromFeedAPI";

interface Props {
  document: GenericDocument;
  metadata: DocumentMetadata;
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

const DocumentOptions = ({ document: doc, metadata }: Props) => {
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const documentContext = useContext(DocumentContext);
  const { revalidateDocument } = useCacheControl();

  const isModerator = Boolean(currentUser?.moderator);
  const isHubEditor = Boolean(currentUser?.author_profile?.is_hub_editor);

  const options: Array<MenuOption> = [
    ...(isPaper(doc) && currentUser
      ? [
          {
            label: "Edit paper",
            group: "Document",
            html: (
              <PaperMetadataModal
                metadata={metadata}
                paper={doc as Paper}
                onUpdate={(updatedFields) => {
                  const updated = { ...doc, ...updatedFields };
                  documentContext.updateDocument(updated);
                  revalidateDocument();
                }}
              >
                <div style={{ display: "flex", width: 140 }}>
                  <div style={{ width: 30, boxSizing: "border-box" }}>
                    <FontAwesomeIcon icon={faPen} style={{ marginRight: 3 }} />
                  </div>

                  <div>Edit</div>
                </div>
              </PaperMetadataModal>
            ),
            value: "edit-paper",
          },
        ]
      : []),
    ...(isPost(doc) &&
    doc.authors.some((author) => author.id === currentUser?.authorProfile.id)
      ? [
          {
            label: "Edit",
            group: "Document",
            icon: <FontAwesomeIcon icon={faPen} />,
            value: "edit-content",
            onClick: () => {
              documentContext.editDocument && documentContext.editDocument();
            },
          },
        ]
      : []),

    ...(isPaper(doc)
      ? [
          {
            label: "Download",
            group: "Document",
            icon: <FontAwesomeIcon icon={faArrowDownToBracket} />,
            value: "download",
            onClick: () => {
              const pdfUrl = doc.formats.find((f) => f.type === "pdf")?.url;
              downloadPDF(pdfUrl);
            },
          },
        ]
      : []),
    {
      value: "flag",
      group: "Document",
      preventDefault: true,
      html: (
        <FlagButtonV2
          modalHeaderText="Flag content"
          onSubmit={(flagReason, renderErrorMsg, renderSuccessMsg) => {
            flagGrmContent({
              contentID: doc.id,
              contentType: doc.apiDocumentType,
              flagReason,
              onError: renderErrorMsg,
              onSuccess: renderSuccessMsg,
            });
          }}
        >
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: 30, boxSizing: "border-box" }}>
              <FontAwesomeIcon icon={faFlag} />
            </div>
            <div>Flag content</div>
          </div>
        </FlagButtonV2>
      ),
    },

    ...(isModerator || isHubEditor
      ? [
          {
            label: "Remove From Feed",
            group: "Admin",
            icon: <FontAwesomeIcon icon={faBan} />,
            value: "remove-from-feed",
            onClick: () => {
              excludeFromFeed({
                unifiedDocumentId: doc.unifiedDocument.id,
                params: {
                  excludeFromHomepage: true,
                  excludeFromHubs: false,
                },
                onError: () => {
                  alert("Something went wrong trying to remove doc from feed");
                },
                onSuccess: () => {
                  alert("Document successfully removed from feed!");
                },
              });
            },
          },
        ]
      : []),
  ];

  return (
    <div>
      <GenericMenu
        softHide={true}
        options={options}
        width={200}
        id="header-more-options"
        direction="bottom-right"
      >
        <IconButton overrideStyle={styles.btnDots}>
          <FontAwesomeIcon icon={faEllipsis} />
        </IconButton>
      </GenericMenu>
    </div>
  );
};

const styles = StyleSheet.create({
  btnDots: {
    fontSize: 22,
    borderRadius: "50px",
    color: colors.BLACK(1.0),
    background: colors.LIGHTER_GREY(),
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    padding: "6px 12px",
    ":hover": {
      background: colors.DARKER_GREY(0.2),
      transition: "0.2s",
    },
  },
  checkbox: {
    minHeight: 14,
    minWidth: 14,
  },
  checkboxRowWrapper: {
    cursor: "pointer",
    padding: "8px 12px",
    boxSizing: "border-box",
    fontSize: 14,
    borderRadius: 4,
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
  },
});

export default DocumentOptions;
