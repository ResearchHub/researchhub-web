import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";

/**
 * Banner component that displays a warning for notes created in the new notebook system
 * and provides a link to view/edit them in the new notebook
 */
export const NewNoteBanner = ({ orgSlug, noteId }) => {
  // Determine the correct URL based on environment
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://new.researchhub.com"
    : "https://v2.staging.researchhub.com";

  const newNoteUrl = `${baseUrl}/notebook/${orgSlug}/${noteId}`;

  return (
    <div className={css(styles.newNoteBanner)}>
      <div className={css(styles.bannerContent)}>
        <div className={css(styles.iconContainer)}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={css(styles.alertIcon)}
          />
        </div>
        <div className={css(styles.messageContainer)}>
          <p className={css(styles.bannerText)}>
            This note was created in our new notebook and needs to be edited
            there.
          </p>
          <a
            href={newNoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={css(styles.bannerLink)}
          >
            <span>View and edit in new notebook</span>
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              className={css(styles.externalLinkIcon)}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if a note is a new format note
export const isNewNote = (note) => {
  return note && !note.latest_version?.src && note.latest_version?.json;
};

const styles = StyleSheet.create({
  newNoteBanner: {
    backgroundColor: "#FEF9C3", // Amber-50 equivalent
    borderLeftWidth: 4,
    borderLeftStyle: "solid",
    borderLeftColor: "#FBBF24", // Amber-400 equivalent
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
    color: "#FBBF24", // Amber-400 equivalent
  },
  messageContainer: {
    marginLeft: 12,
  },
  bannerText: {
    fontSize: 14,
    color: "#B45309", // Amber-700 equivalent
    marginBottom: 4,
  },
  bannerLink: {
    display: "flex",
    alignItems: "center",
    color: "#B45309", // Amber-700 equivalent
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
});

export default NewNoteBanner;
