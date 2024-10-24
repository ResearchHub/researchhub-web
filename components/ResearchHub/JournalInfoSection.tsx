import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";

const editors = [
  {
    role: "Editor in Chief",
    name: "John Smith, PhD",
    bio: "Coming soon",
  },
  {
    role: "Associate Editor",
    name: "John Smith, PhD",
    bio: "Coming soon",
  },
  {
    role: "Associate Editor",
    name: "John Smith, PhD",
    bio: "Coming soon",
  },
  {
    role: "Associate Editor",
    name: "John Smith, PhD",
    bio: "Coming soon",
  },
];

const JournalInfoSection = () => {
  return (
    <div className={css(styles.container)}>
      <div className={css(styles.section)}>
        <h3 className={css(styles.sectionTitle)}>About this journal</h3>
        <p className={css(styles.description)}>
          The ResearchHub Journal aims to accelerate the pace of science through novel incentive structures that allow peer reviewers to be paid for their work and authors to be paid for reproducible research. We have the highest bar of quality in our journal through our peer reviewers, but without the lengthy review times you're used to.
        </p>
        <div className={css(styles.checkList)}>
          <div className={css(styles.checkItem)}>
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className={css(styles.checkIcon)} 
            />
            <span>3+ Expert open peer reviews</span>
          </div>
          <div className={css(styles.checkItem)}>
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className={css(styles.checkIcon)} 
            />
            <span>2 days to initial editorial decision</span>
          </div>
          <div className={css(styles.checkItem)}>
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className={css(styles.checkIcon)} 
            />
            <span>14 days to publication decision</span>
          </div>
        </div>
      </div>

      <div className={css(styles.section)}>
        <h3 className={css(styles.sectionTitle)}>Editorial Board</h3>
        <div className={css(styles.editorsGrid)}>
          {editors.map((editor, index) => (
            <div key={index} className={css(styles.editorCard)}>
              <div className={css(styles.editorHeader)}>
                <img 
                  src="/static/EinsteinAvatar.png" 
                  className={css(styles.editorAvatar)} 
                  alt={editor.name}
                />
                <div>
                  <div className={css(styles.editorRole)}>{editor.role}</div>
                  <div className={css(styles.editorName)}>{editor.name}</div>
                </div>
              </div>
              <div className={css(styles.editorBio)}>{editor.bio}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
  },
  section: {
    background: "#fff",
    borderRadius: 12,
    padding: 32,
    marginBottom: 32,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    transition: "border-color 0.2s ease",
    ":hover": {
      borderColor: colors.NEW_BLUE(0.2),
    },
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 24,
    color: colors.BLACK(0.9),
    letterSpacing: "-0.02em",
  },
  description: {
    fontSize: 14,
    lineHeight: "22px",
    color: colors.BLACK(0.6),
    marginBottom: 15,
  },
  checkList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 16,
    color: colors.BLACK(0.8),
    padding: "8px 0",
  },
  checkIcon: {
    color: colors.GREEN(0.9),
    fontSize: 18,
  },
  editorsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  editorCard: {
    padding: 24,
    background: colors.BLUE(0.02),
    borderRadius: 12,
    border: `1px solid ${colors.GREY_LINE(0.5)}`,
    transition: "all 0.2s ease-in-out",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
      background: colors.BLUE(0.04),
    },
  },
  editorHeader: {
    display: "flex",
    gap: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  editorAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${colors.NEW_BLUE(0.1)}`,
  },
  editorRole: {
    fontSize: 14,
    color: colors.NEW_BLUE(0.8),
    marginBottom: 4,
    fontWeight: 500,
  },
  editorName: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.BLACK(0.9),
  },
  editorBio: {
    fontSize: 15,
    lineHeight: 1.6,
    color: colors.BLACK(0.6),
  },
});

export default JournalInfoSection;
