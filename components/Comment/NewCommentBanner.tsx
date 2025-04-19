import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faExternalLinkAlt,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";
import { GenericDocument } from "../Document/lib/types";
import { getNewAppBaseUrl } from "../../redux/auth";

interface NewCommentBannerProps {
  document: GenericDocument;
  commentId?: string;
  onClose?: () => void;
}

export const NewCommentBanner = ({
  document,
  commentId,
  onClose,
}: NewCommentBannerProps) => {
  const baseUrl = getNewAppBaseUrl();

  const getEditUrl = (document: GenericDocument, commentId?: string): string => {
    const documentType = document.type;
    const documentId = document.id;
    const documentSlug = document.slug;

    switch (documentType) {
      case "paper":
        return `${baseUrl}/paper/${documentId}/${documentSlug}/conversation?commentId=${commentId}`;
      case "post":
        return `${baseUrl}/fund/${documentId}/${documentSlug}/conversation?commentId=${commentId}`;
      case "hypothesis":
        return `${baseUrl}/hypothesis/${documentId}/${documentSlug}/conversation?commentId=${commentId}`;
      case "question":
        return `${baseUrl}/question/${documentId}/${documentSlug}/conversation?commentId=${commentId}`;
      default:
        return baseUrl;
    }
  };

  const editUrl = getEditUrl(document, commentId);

  return (
    <div className={css(styles.newCommentBanner)}>
      <div className={css(styles.bannerContent)}>
        <div className={css(styles.iconContainer)}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={css(styles.alertIcon)}
          />
        </div>
        <div className={css(styles.messageContainer)}>
          <p className={css(styles.bannerText)}>
            This comment was added using the new version of ResearchHub. To make changes, you'll need to use the new site's editor.
          </p>
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={css(styles.bannerLink)}
          >
            <span>Open in new ResearchHub</span>
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className={css(styles.externalLinkIcon)}
            />
          </a>
        </div>
        {onClose && (
          <button onClick={onClose} className={css(styles.closeButton)}>
            <FontAwesomeIcon icon={faTimes} className={css(styles.closeIcon)} />
          </button>
        )}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  newCommentBanner: {
    backgroundColor: "#FEF9C3",
    borderLeftWidth: 4,
    borderLeftStyle: "solid",
    borderLeftColor: "#FBBF24",
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  bannerContent: {
    display: "flex",
    alignItems: "flex-start",
  },
  iconContainer: {
    flexShrink: 0,
  },
  alertIcon: {
    height: 20,
    width: 20,
    color: "#FBBF24",
  },
  messageContainer: {
    marginLeft: 12,
  },
  bannerText: {
    fontSize: 14,
    color: "#B45309",
    marginBottom: 4,
  },
  bannerLink: {
    display: "flex",
    alignItems: "center",
    color: "#B45309",
    textDecoration: "underline",
    fontSize: 14,
    cursor: "pointer",
  },
  externalLinkIcon: {
    height: 12,
    width: 12,
    marginLeft: 4,
    flexShrink: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    padding: 8,
    cursor: "pointer",
    color: "#B45309",
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    ":hover": {
      backgroundColor: "rgba(180, 83, 9, 0.1)",
    },
  },
  closeIcon: {
    height: 16,
    width: 16,
  },
});

export default NewCommentBanner;
