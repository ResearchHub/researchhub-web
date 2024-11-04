import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faEnvelope } from "@fortawesome/pro-solid-svg-icons";
import { faTwitter, faGoogleScholar, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useCallback, useMemo } from 'react';

const editors = [
    {
      name: "Sam Monic",
      role: "Editor in Chief",
      bio: "Dr. Thompson's research focuses on climate science and environmental modeling. She has contributed to major IPCC reports and leads several international research collaborations.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        email: "hello@researchhub.com",
        twitter: "https://twitter.com/sammonic",
        scholar: "https://scholar.google.com/sammonic"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "Associate Editor",
      bio: "Dr. Rodriguez specializes in molecular biology and genetics. Her groundbreaking research on CRISPR applications has been featured in Nature and Science journals.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        email: "hello@researchhub.com",
        twitter: "https://twitter.com/elenarod",
        scholar: "https://scholar.google.com/elenarod"
      }
    },
    {
      name: "James Chen",
      role: "Associate Editor",
      bio: "Professor Chen leads the Quantum Computing Initiative at MIT. His work bridges the gap between theoretical physics and practical computing applications.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        email: "hello@researchhub.com",
        twitter: "https://twitter.com/jameschen",
        scholar: "https://scholar.google.com/jchen"
      }
    },
    {
      name: "Sarah Thompson",
      role: "Associate Editor",
      bio: "Dr. Thompson's research focuses on climate science and environmental modeling. She has contributed to major IPCC reports and leads several international research collaborations.",
      image: "/static/EinsteinAvatar.png",
      socialLinks: {
        email: "hello@researchhub.com",
        twitter: "https://twitter.com/sarahthompson",
        scholar: "https://scholar.google.com/sthompson"
      }
    }
];

const EditorialBoardSection = () => {
  // Memoize the editor cards since they're static
  const editorCards = useMemo(() => editors.map((editor, index) => (
    <EditorCard key={index} editor={editor} />
  )), []);

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.headerContent)}>
        <h2 className={css(styles.title)}>Editorial Board</h2>
        <p className={css(styles.subtitle)}>
          Our goal at ResearchHub Journal is to drive scientific progress by introducing innovative
          reward systems that compensate peer reviewers for their contributions.
        </p>
      </div>

      <div className={css(styles.editorsGrid)}>
        {editorCards}
      </div>
    </div>
  );
};

// 2. Split into smaller components for better re-render control
const EditorCard = ({ editor }) => {
  // Memoize social links since they're static per editor
  const socialLinks = useMemo(() => (
    <div className={css(styles.socialLinks)}>
      <SocialLink 
        href={`mailto:${editor.socialLinks.email}`} 
        icon={faEnvelope} 
      />
      <SocialLink 
        href={editor.socialLinks.twitter} 
        icon={faXTwitter} 
      />
      <SocialLink 
        href={editor.socialLinks.scholar} 
        icon={faGoogleScholar} 
      />
    </div>
  ), [editor.socialLinks]);

  return (
    <div className={css(styles.editorCard)}>
      <div className={css(styles.editorHeader)}>
        <div className={css(styles.avatarColumn)}>
          <img 
            src={editor.image} 
            className={css(styles.editorAvatar)} 
            alt={editor.name}
          />
          {socialLinks}
        </div>
        <div className={css(styles.editorContent)}>
          <div className={css(styles.editorInfo)}>
            <h3 className={css(styles.editorName)}>{editor.name}</h3>
            <p className={css(styles.editorRole)}>{editor.role}</p>
          </div>
          <hr className={css(styles.divider)} />
          <p className={css(styles.editorBio)}>{editor.bio}</p>
        </div>
      </div>
    </div>
  );
};

// 3. Create reusable components for repeated elements
const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={css(styles.socialIconLink)}
  >
    <FontAwesomeIcon icon={icon} className={css(styles.socialIcon)} />
  </a>
);

const styles = StyleSheet.create({
  container: {
    background: "linear-gradient(180deg, #587FFF 0%, #3B72FF 100%)",
    padding: "80px 32px",
    width: "100%",
    position: "relative",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: "60px 0",
    },
  },
  headerContent: {
    maxWidth: 737,
    margin: "0 auto",
    textAlign: "center",
    marginBottom: 60,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 40,
      padding: "0 24px",
    },
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: 500,
    lineHeight: "40px",
    marginBottom: 16,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 28,
      lineHeight: "34px",
    },
  },
  subtitle: {
    color: "#F1F5FF",
    fontSize: 16,
    lineHeight: "140%",
    opacity: 0.8,
    maxWidth: 633,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 15,
      padding: "0 16px",
    },
  },
  editorsGrid: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 40,
    width: "100%",
    padding: "0 60px",
    boxSizing: "border-box",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gridTemplateColumns: "1fr",
      gap: 24,
      width: "70%",
      maxWidth: 400,
      margin: "0 auto",
      padding: 0,
      justifyItems: "center",
      alignItems: "center",
    },
  },
  editorCard: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1.4px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(1px)",
    borderRadius: 12,
    padding: 32,
    width: "100%",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out",
    ":hover": {
      background: "rgba(255, 255, 255, 0.15)",
      border: "1.4px solid rgba(255, 255, 255, 0.4)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      padding: 24,
      width: "110%",
      position: "relative",
    },
  },
  editorHeader: {
    display: "flex",
    gap: 32,
    alignItems: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gap: 20,
    },
  },
  editorAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "1px solid rgba(255, 255, 255, 0.8)",
    background: "#3971FF",
    flexShrink: 0,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 80,
      height: 80,
    },
  },
  editorContent: {
    flex: 1,
    paddingTop: 8,
    width: "120%",
  },
  editorInfo: {
    //flex: 1,
    paddingTop: 0,
  },
  editorName: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: "24px",
    marginBottom: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
      lineHeight: "20px",
      marginBottom: 4,
    },
  },
  editorRole: {
    color: "#F1F5FF",
    fontSize: 14,
    lineHeight: "140%",
    opacity: 0.8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
    },
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(255, 255, 255, 0.4)",
    margin: "16px 0",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      //marginTop:40,
      //marginLeft: -100,
    },
  },
  editorBio: {
    color: "#F1F5FF",
    fontSize: 14,
    lineHeight: "140%",
    marginBottom: 24,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
      marginTop: 30,
      marginBottom: 60,
      marginLeft: -100,
      maxWidth: "200%",
    },
  },
  socialLinks: {
    display: "flex",
    gap: 12,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      position: "absolute",
      bottom: 24,
      left: 24,
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
    },
  },
  socialIcon: {
    color: "#FFFFFF",
    width: 16,
    height: 16,
    cursor: "pointer",
    opacity: 0.8,
    transition: "all 0.2s ease",
  },
  socialIconLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s ease",
    ":hover": {
      background: "rgba(255, 255, 255, 0.2)",
      transform: "translateY(-1px)",
      "& svg": {
        opacity: 1,
      }
    },
  },
  avatarColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      gap: 12,
      alignItems: "center",
      marginBottom: 40,
    },
  },
});

export default EditorialBoardSection;
